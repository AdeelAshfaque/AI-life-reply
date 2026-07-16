from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

client = OpenAI(
    base_url="https://models.github.ai/inference",
    api_key=os.getenv("GITHUB_TOKEN"),
)

response = client.chat.completions.create(
    model="openai/gpt-5",
    messages=[
        {
            "role": "user",
            "content": "Say hello in one sentence."
        }
    ],
)

print(response.choices[0].message.content)