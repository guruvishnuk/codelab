"use server";

import { runCode } from "@/lib/api";
import { cookies } from "next/headers";
import { signOut } from "@/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

// This acts as a secure bridge. The browser will call this, 
// and Next.js will magically run it on the server and return the result!
export async function submitCodeAction(exerciseId: number, code: string) {
  try {
    const res = await runCode(exerciseId, code);
    return { ...res, error: undefined };
  } catch (err: any) {
    return {
      passed: false,
      results: [],
      error: err?.message || "Failed to execute code against backend.",
    };
  }
}

export async function createExerciseAction(topicId: number, data: any) {
  const cookieStore = cookies();
  const token = cookieStore.get("authjs.session-token")?.value || cookieStore.get("__Secure-authjs.session-token")?.value;
  
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const res = await fetch(`${BASE}/api/admin/topics/${topicId}/exercises`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    let errorMessage = "Failed to create exercise.";
    try {
      const errBody = await res.json();
      errorMessage = errBody.detail || errorMessage;
    } catch (e) {
      errorMessage = `Server returned status ${res.status}`;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}