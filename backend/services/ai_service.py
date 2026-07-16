import base64
import json
import mimetypes

from openai import OpenAI
from utils.settings import get_settings

settings = get_settings()

client = OpenAI(
    base_url="https://models.github.ai/inference",
    api_key=settings.github_token,
)


async def analyze_image(file):
    file.file.seek(0)
    image_bytes = file.file.read()

    mime_type = mimetypes.guess_type(file.filename)[0] or "image/jpeg"

    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    response = client.chat.completions.create(
        model="openai/gpt-5",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """
You are an AI memory assistant.

Look at this image and return ONLY valid JSON.

{
  "title": "",
  "diary": "",
  "description": "",
  "tags": [],
  "mood": "",
  "location": "",
  "people": []
}

Rules:

- title:
  Human friendly.
  Maximum 6 words.
  Never use filenames.

- diary:
  Write in first person.
  50-80 words.
  Sound like a real diary.
  If you can infer a person's name from visible context (e.g. a name tag,
  a caption-worthy detail, or the user has told you a name in a previous
  message), naturally include it. Never invent a name you cannot justify.

- description:
  Describe what is actually visible.

- tags:
  3-6 searchable keywords.

- mood:
  One word only.

- location:
  If unknown return "".

- people:
  List of real names of people who appear to be present, ONLY if there is
  clear evidence (visible face count + any name context given). If you
  cannot identify names, return an empty list. Never guess random names.

Return JSON only.
"""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{image_base64}"
                        }
                    }
                ]
            }
        ]
    )

    content = response.choices[0].message.content

    try:
        parsed = json.loads(content)
        parsed.setdefault("people", [])
        return parsed
    except Exception:
        return {
            "title": file.filename.rsplit(".", 1)[0].replace("_", " ").title(),
            "diary": content,
            "description": content,
            "tags": [],
            "mood": "",
            "location": "",
            "people": [],
        }

async def generate_ai_diary(memories):
    if not memories:
        return {
            "date": "Today",
            "mood": "Neutral",
            "summary": "No memories available.",
            "diary": "Upload some memories to generate your AI diary."
        }

    memory_text = ""

    for memory in memories:
        memory_text += f"""
Title: {memory.get("title","")}
Description: {memory.get("description","")}
Location: {memory.get("location","")}
Tags: {", ".join(memory.get("tags", []))}
People: {", ".join(memory.get("people", []))}
Mood: {memory.get("mood","")}

"""

    response = client.chat.completions.create(
        model="openai/gpt-5",
        messages=[
            {
                "role": "system",
                "content":
                """
You are an AI personal journal.

You receive today's memories.

Write a natural diary.

Return ONLY JSON.

{
  "date":"",
  "mood":"",
  "summary":"",
  "diary":""
}

Rules:

summary:
One sentence.

diary:
80-120 words.

Write naturally in first person.

Never invent events that are not in the memories.

Mood should be one word.
"""
            },
            {
                "role": "user",
                "content": memory_text
            }
        ]
    )

    return json.loads(response.choices[0].message.content)