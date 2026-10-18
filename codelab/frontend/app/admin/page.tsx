"use client";

import { useState } from "react";
import { createExerciseAction } from "../actions";

export default function AdminPage() {
  const [topicId, setTopicId] = useState("1");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Publishing challenge to database...");

    try {
      const exerciseData = {
        title: title,
        difficulty: "easy",
        prompt_md: "Write a function that solves the given problem statement.",
        starter_code: "# Start coding here\n",
        test_cases: [{ input: "1\n", expected: "1" }],
      };

      await createExerciseAction(parseInt(topicId), exerciseData);

      setMessage(`Success! "${title}" was published to the curriculum.`);
      setTitle("");
    } catch (err: any) {
      setMessage(err.message || "Failed to create exercise.");
    }
  }

  return (
    <div className="max-w-2xl py-2 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-ink mb-1">Curriculum Administration</h1>
        <p className="text-sm text-muted">Create and publish interactive Python exercises visually.</p>
      </div>

      <form onSubmit={handleSubmit} className="cyber-card cyber-card-accent p-6 md:p-8 space-y-5 backdrop-blur-md">
        {/* Track Selector */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
            Target Track
          </label>
          <select 
            value={topicId} 
            onChange={(e) => setTopicId(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface-elevated px-4 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand font-mono"
          >
            <option value="1">1. Python Basics</option>
            <option value="2">2. Control Flow</option>
            <option value="3">3. Strings</option>
            <option value="4">4. Functions & Scope</option>
            <option value="5">5. Lists & Tuples</option>
            <option value="6">6. Dictionaries & Sets</option>
          </select>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
            Challenge Title
          </label>
          <input 
            type="text" 
            required
            placeholder="e.g. Calculate Fibonacci Sequence"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface-elevated px-4 py-2.5 text-sm text-ink placeholder:text-muted outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>

        <button 
          type="submit" 
          className="btn-cyber btn-cyber-primary"
        >
          Publish Challenge →
        </button>

        {/* Status Message */}
        {message && (
          <div className={`p-3.5 rounded-xl border text-xs font-mono ${
            message.includes("Success") 
              ? "border-ok/30 bg-ok/10 text-ok" 
              : "border-bad/30 bg-bad/10 text-bad"
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}