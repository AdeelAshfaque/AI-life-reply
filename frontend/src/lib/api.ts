export type MemoryItem = {
  image_url: string;
  title: string;
  description: string;
  date: string;
  time?: string | null;
  tags: string[];
  people?: string[] | null;
  location?: string | null;
  mood?: string | null;
};

export type TimelineItem = {
  time: string;
  title: string;
  note: string;
};

export type DiaryEntry = {
  date: string;
  diary: string;
  mood: string;
  summary: string;
};

export type SearchResult = {
  query: string;
  answer: string;
  related_memories: string[];
};

export type GraphResponse = {
  focus: string;
  nodes: string[];
  edges: Array<{ source: string; target: string }>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://192.168.100.5:8000";
async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getMemories() {
  return requestJson<{ items: MemoryItem[] }>("/memories");
}

export async function getTimeline() {
  return requestJson<{ items: TimelineItem[] }>("/timeline");
}

export async function getDiary() {
  return requestJson<DiaryEntry>("/diary");
}

export async function getGraph(focus = "Ali") {
  return requestJson<GraphResponse>(`/graph?focus=${encodeURIComponent(focus)}`);
}

export async function getWeeklyInsights() {
  return requestJson<{ studied_days: number; football_days: number; university_days: number; top_people: string[]; top_locations: string[] }>(
    "/graph/weekly-insights",
  );
}

export async function searchMemories(query: string) {
  return requestJson<SearchResult>(`/search?query=${encodeURIComponent(query)}`);
}

export async function uploadMemory(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  return response.json() as Promise<{
    image_url: string;
    title: string;
    description: string;
    tags: string[];
    people: string[];
    location: string;
    mood: string;
  }>;
}
