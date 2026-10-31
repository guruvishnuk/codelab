import { cookies } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Extract JWT session token from cookies to authenticate requests against FastAPI backend.
 */
function getAuthHeaders(): Record<string, string> {
  const cookieStore = cookies();
  // Auth.js names the cookie differently depending on if it's localhost or HTTPS (production)
  const token =
    cookieStore.get("authjs.session-token")?.value ||
    cookieStore.get("__Secure-authjs.session-token")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export type TopicSummary = {
  slug: string;
  title: string;
  summary: string;
};

export type ExerciseSummary = {
  id: number;
  title: string;
  difficulty: string;
  solved: boolean;
};

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

export type RunResponse = {
  passed: boolean;
  results: TestResult[];
  xp_earned?: number;
  is_first_solve?: boolean;
};

/**
 * Generic fetch wrapper with auth header injection and error handling.
 */
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch all available curriculum topics ordered by position.
 */
export const getTopics = (): Promise<TopicSummary[]> => get<TopicSummary[]>("/api/topics");

/**
 * Fetch complete details and exercises for a given topic slug.
 */
export const getTopic = (slug: string): Promise<TopicDetail> => get<TopicDetail>(`/api/topics/${slug}`);

/**
 * Fetch an individual exercise by ID including starter code and tests.
 */
export const getExercise = (id: string | number): Promise<ExerciseDetail> => get<ExerciseDetail>(`/api/exercises/${id}`);

/**
 * Submit user code to the backend runner to execute against test cases.
 */
export async function runCode(id: number, code: string): Promise<RunResponse> {
  const res = await fetch(`${BASE}/api/exercises/${id}/run`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    let detail = "Could not run your code. Are you logged in?";
    try {
      const errData = await res.json();
      detail = errData.detail || errData.message || detail;
    } catch {
      detail = `Server returned status ${res.status}`;
    }
    throw new Error(detail);
  }
  return res.json();
}

export type DashboardExercise = {
  id: number;
  title: string;
  topic_slug: string;
  difficulty: string;
};

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  max_progress: number;
};

export type LevelInfo = {
  level: number;
  title: string;
  current_xp: number;
  next_level_xp: number;
  progress_percent: number;
};

export type DashboardStats = {
  total_exercises: number;
  solved_exercises: number;
  total_xp: number;
  streak_days: number;
  level_info: LevelInfo;
  badges: Badge[];
};

export type DashboardResponse = {
  stats: DashboardStats;
  recent_solved: DashboardExercise[];
};

/**
 * Retrieve user profile analytics, XP points, rank and achievement badges.
 */
export const getDashboard = (): Promise<DashboardResponse> => get<DashboardResponse>("/api/users/me/dashboard");

export type SearchResult = {
  topics: TopicSummary[];
  exercises: (ExerciseSummary & { topic_slug: string })[];
};

/**
 * Search topics and exercises matching the search keyword.
 */
export const searchEntities = (q: string): Promise<SearchResult> =>
  get<SearchResult>(`/api/search?q=${encodeURIComponent(q)}`);
