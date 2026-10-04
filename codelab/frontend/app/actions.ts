"use server";

import { runCode } from "@/lib/api";
import { cookies } from "next/headers";

// This acts as a secure bridge. The browser will call this, 
// and Next.js will magically run it on the server and return the result!
export async function submitCodeAction(exerciseId: number, code: string) {
  return await runCode(exerciseId, code);
}


export async function createExerciseAction(topicId: number, data: any) {
  // Grab the cookie (checking both normal and secure names)
  const cookieStore = cookies();
  const token = cookieStore.get("authjs.session-token")?.value || cookieStore.get("__Secure-authjs.session-token")?.value;
  
  // Call the secure Admin endpoint
  const res = await fetch(`http://localhost:8000/api/admin/topics/${topicId}/exercises`, {
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