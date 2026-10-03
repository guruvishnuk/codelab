import { cookies } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Helper to get the JWT token from the NextAuth cookies
function getAuthHeaders() {
  const cookieStore = cookies();
  // Auth.js names the cookie differently depending on if it's localhost or HTTPS (production)
  const token = cookieStore.get("authjs.session-token")?.value || cookieStore.get("__Secure-authjs.session-token")?.value;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export type TopicSummary = { slug: string; title: string; summary: string };
export type ExerciseSummary = { id: number; title: string; difficulty: string; solved: boolean };
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
  const res = await fetch(`${BASE}${path}`, { 
    cache: "no-store",
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const getTopics = () => get<TopicSummary[]>("/api/topics");
export const getTopic = (slug: string) => get<TopicDetail>(`/api/topics/${slug}`);
export const getExercise = (id: string) => get<ExerciseDetail>(`/api/exercises/${id}`);

export async function runCode(id: number, code: string): Promise<RunResponse> {
  const res = await fetch(`${BASE}/api/exercises/${id}/run`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error("Could not run your code. Are you logged in?");
  return res.json();
}

export type DashboardExercise = {
  id: number;
  title: string;
  topic_slug: string;
  difficulty: string;
};

export type DashboardStats = {
  total_exercises: number;
  solved_exercises: number;
};

export type DashboardResponse = {
  stats: DashboardStats;
  recent_solved: DashboardExercise[];
};

export const getDashboard = () => get<DashboardResponse>("/api/users/me/dashboard");
