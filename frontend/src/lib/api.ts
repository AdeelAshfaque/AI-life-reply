
export type MemoryItem = {
  id: string;
  image_url: string;
  title: string;
  description: string;
  date: string;
  time: string;
  tags: string[];
  people: string[];
  location: string;
  mood: string;
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

export interface GraphNode {
  id: string;
  label: string;
  type: "focus" | "memory" | "person" | "place" | "tag" | "mood";
  size: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphResponse {
  focus: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

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
  return requestJson<{ total_memories: number; total_tags: number; total_people: number; total_locations: number }>(
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

  return response.json() as Promise<MemoryItem & {
  id: string;
  created_at: string;
  }>;
}

export async function deleteMemory(id: string) {
  const response = await fetch(`http://localhost:8000/memories/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete memory");
  }

  return response.json();
}



