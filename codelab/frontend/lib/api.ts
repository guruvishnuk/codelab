const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type TopicSummary = { slug: string; title: string; summary: string };
export type ExerciseSummary = { id: number; title: string; difficulty: string };
export type TopicDetail = TopicSummary & {
  notes_md: string;
  exercises: ExerciseSummary[];
};
export type ExerciseDetail = ExerciseSummary & {
  prompt_md: string;
  starter_code: string;
  topic_slug: string;
  next_exercise_id: number | null;
};
export type TestResult = {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error: string;
};
export type RunResponse = { passed: boolean; results: TestResult[] };

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const getTopics = () => get<TopicSummary[]>("/api/topics");
export const getTopic = (slug: string) => get<TopicDetail>(`/api/topics/${slug}`);
export const getExercise = (id: string) => get<ExerciseDetail>(`/api/exercises/${id}`);

export async function runCode(id: number, code: string): Promise<RunResponse> {
  const res = await fetch(`${BASE}/api/exercises/${id}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error("Could not run your code. Is the API running?");
  return res.json();
}
