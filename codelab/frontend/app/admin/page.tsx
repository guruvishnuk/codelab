"use client";

import { useState } from "react";
import { createExerciseAction } from "../actions";

export default function AdminPage() {
  const [topicId, setTopicId] = useState("1"); // Default to Topic 1
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Saving...");

    try {
      // 1. Prepare the data
      const exerciseData = {
        title: title,
        difficulty: "easy",
        prompt_md: "Write a function that does something cool.",
        starter_code: "# Start coding here\n",
        test_cases: [{"input": "1\n", "expected": "1"}]
      };

      // 2. Send it securely via the Server Action
      await createExerciseAction(parseInt(topicId), exerciseData);
      
      setMessage(`Success! "${title}" was added to the database.`);
      setTitle(""); // Clear the form
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <div className="max-w-2xl py-8">
      <h1 className="text-3xl font-bold text-ink mb-2">Admin Panel</h1>
      <p className="text-muted mb-8">Add new exercises to the database visually.</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-line space-y-4">
        
        {/* Topic Selector */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Select Topic</label>
          <select 
            value={topicId} 
            onChange={(e) => setTopicId(e.target.value)}
            className="w-full border border-line rounded-md p-2"
          >
            <option value="1">Python Basics</option>
            <option value="2">Control Flow</option>
            <option value="3">Strings</option>
          </select>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Exercise Title</label>
          <input 
            type="text" 
            required
            placeholder="e.g. Add Three Numbers"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-line rounded-md p-2"
          />
        </div>

        <button 
          type="submit" 
          className="bg-brand text-white font-medium px-4 py-2 rounded-md hover:bg-brand-dark"
        >
          Create Exercise
        </button>

        {/* Status Message */}
        {message && (
          <p className={`mt-4 text-sm font-bold ${message.includes("Success") ? "text-ok" : "text-bad"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}