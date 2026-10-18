import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Architecture | CodeLab",
  description:
    "Learn about CodeLab's philosophy, interactive curriculum, and secure Docker sandboxed code execution engine.",
};

export default function AboutPage() {
  const architectures = [
    {
      title: "Next.js 14 Frontend",
      tag: "Client & SSR",
      description:
        "Engineered with React Server Components, App Router, TypeScript, and Tailwind CSS. Features CodeMirror 6 with live autosave, Three.js 3D WebGL, and OAuth 2.0 authentication.",
      badge: "App Router",
    },
    {
      title: "FastAPI Backend",
      tag: "REST API",
      description:
        "High-performance asynchronous Python API with automatic OpenAPI documentation, stateless JWT-secured verification, and structured Pydantic v2 schemas.",
      badge: "Python 3.11+",
    },
    {
      title: "Sandbox Code Runner",
      tag: "Isolated Runtime",
      description:
        "Executes untrusted user code inside ephemeral, zero-network sandboxes with strict CPU, memory (128MB), and 5-second execution timeout protection.",
      badge: "Secure Sandbox",
    },
    {
      title: "PostgreSQL Database",
      tag: "Data Layer",
      description:
        "Managed PostgreSQL cluster hosted on Supabase modeling curriculum tracks, graded exercises, daily streaks, XP counters, and user submissions.",
      badge: "Supabase & Postgres",
    },
  ];

  const securityFeatures = [
    {
      label: "Zero Network Access",
      detail: "Execution environments run with `--net none` to strictly prevent outbound or inbound network connections.",
    },
    {
      label: "Strict Memory & CPU Limits",
      detail: "Hardware caps at 128 MB RAM and 0.5 CPU prevent memory exhaustion and runaway fork bombs.",
    },
    {
      label: "5-Second Execution Timeout",
      detail: "Process supervision automatically kills infinite loops and hanging scripts.",
    },
    {
      label: "Ephemeral Isolation",
      detail: "Environment state is wiped clean immediately after test evaluation to guarantee isolation between runs.",
    },
  ];

  const curriculumTopics = [
    {
      name: "Python Basics",
      desc: "Variables, console I/O, type conversions, and formatted strings.",
      status: "Available",
      href: "/topics/python-basics",
    },
    {
      name: "Control Flow",
      desc: "Conditionals, branch logic, and iterative for/while loops.",
      status: "Available",
      href: "/topics/control-flow",
    },
    {
      name: "Strings",
      desc: "Slicing, substring manipulation, character inspection, and case transformations.",
      status: "Available",
      href: "/topics/strings",
    },
    {
      name: "Functions & Scope",
      desc: "Modular code, return values, parameters, and variable lifetimes.",
      status: "Available",
      href: "/topics/functions-and-scope",
    },
    {
      name: "Lists & Tuples",
      desc: "Ordered sequences, indexing, list comprehensions, and immutable records.",
      status: "Available",
      href: "/topics/lists-and-tuples",
    },
    {
      name: "Dictionaries & Sets",
      desc: "Key-value mappings, hash lookups, set operations, and frequency counters.",
      status: "Available",
      href: "/topics/dictionaries-and-sets",
    },
  ];

  return (
    <div className="max-w-4xl space-y-12 py-2">
      {/* Hero Section */}
      <section className="space-y-4 border-b border-line pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 font-mono text-xs font-semibold text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
          About CodeLab Architecture
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-ink">
          Learn topic by topic.
          <span className="block text-brand">Read notes. Write code. Pass tests.</span>
        </h1>
        <p className="max-w-[70ch] text-base text-muted leading-relaxed">
          CodeLab is a minimal, distraction-free coding platform built to bridge the gap between
          reading passive tutorials and building muscle memory. Every concept is accompanied
          by concise notes and instant test-driven exercises.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/topics/python-basics"
            className="btn-cyber btn-cyber-primary"
          >
            Start with Python Basics →
          </Link>
          <Link
            href="/"
            className="btn-cyber btn-cyber-secondary"
          >
            Explore 3D Home
          </Link>
          <Link
            href="/search?q=loop"
            className="btn-cyber btn-cyber-secondary text-muted"
          >
            Search Curriculum
          </Link>
        </div>
      </section>

      {/* The 3-Step Learning Loop */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-ink">The Active Learning Loop</h2>
          <p className="mt-1 text-xs text-muted">
            Engineered around active recall and immediate automated verification.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="cyber-card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft border border-brand/30 font-mono font-bold text-brand">
              01
            </div>
            <h3 className="mt-4 text-base font-bold font-display text-ink">Bite-Sized Notes</h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Laser-focused Markdown notes explaining the core concept in under two minutes without fluff.
            </p>
          </div>

          <div className="cyber-card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft border border-brand/30 font-mono font-bold text-brand">
              02
            </div>
            <h3 className="mt-4 text-base font-bold font-display text-ink">In-Browser Editor</h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Write Python code directly in a syntax-highlighted CodeMirror editor with draft autosave.
            </p>
          </div>

          <div className="cyber-card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft border border-brand/30 font-mono font-bold text-brand">
              03
            </div>
            <h3 className="mt-4 text-base font-bold font-display text-ink">Instant Test Feedback</h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Submit code to inspect inputs, expected outputs, runtime diagnostics, and earn XP.
            </p>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-ink">System Architecture</h2>
          <p className="mt-1 text-xs text-muted">
            Built with modern web technologies and a decoupled backend architecture.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {architectures.map((item) => (
            <div
              key={item.title}
              className="cyber-card cyber-card-accent p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                    {item.tag}
                  </span>
                  <span className="pill-badge pill-badge-violet">
                    {item.badge}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold font-display text-ink">{item.title}</h3>
                <p className="mt-2 text-xs text-muted leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Docker Sandbox & Security Model */}
      <section className="cyber-card p-6 md:p-8 space-y-6 backdrop-blur-md">
        <div>
          <div className="pill-badge pill-badge-mint">
            🛡️ Isolated Sandbox Environment
          </div>
          <h2 className="mt-3 text-2xl font-bold font-display text-ink">How Code Runs Safely</h2>
          <p className="mt-1 text-xs text-muted">
            Executing user-submitted code requires strict multi-layer containment to ensure server stability.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {securityFeatures.map((feat) => (
            <div key={feat.label} className="cyber-card p-4 border-line/80 bg-surface-elevated/70">
              <h4 className="font-semibold text-ink text-sm flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                {feat.label}
              </h4>
              <p className="mt-1 text-xs text-muted leading-relaxed">{feat.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-[#0a0719] border border-line p-4 text-xs font-mono text-slate-200 overflow-x-auto shadow-inner">
          <p className="text-muted"># Sandbox execution command pattern</p>
          <p className="mt-1 text-ok">
            docker run --rm -i --net none --memory 128m --cpus 0.5 python:3.11-slim python -c "$USER_CODE"
          </p>
        </div>
      </section>

      {/* Curriculum Tracks */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-ink">Curriculum Tracks</h2>
            <p className="mt-1 text-xs text-muted">
              Progressive mastery from foundational programming to data structures.
            </p>
          </div>
          <Link href="/" className="text-xs font-semibold text-brand hover:underline">
            View full syllabus →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {curriculumTopics.map((topic) => (
            <div
              key={topic.name}
              className="cyber-card p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-ink text-sm">{topic.name}</h3>
                  <span className="pill-badge pill-badge-mint">
                    {topic.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed">{topic.desc}</p>
              </div>
              {topic.href && (
                <div className="mt-4 pt-3 border-t border-line/60">
                  <Link
                    href={topic.href}
                    className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    <span>Jump into track</span>
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Footer Card */}
      <section className="rounded-2xl border border-line bg-gradient-to-r from-[#5a3dff] to-[#ff6b5b] p-8 text-white shadow-glow">
        <h2 className="text-2xl font-bold font-display">Ready to write some code?</h2>
        <p className="mt-2 max-w-[55ch] text-sm text-white/90 leading-relaxed">
          Dive into hands-on exercises right now. Track your solved challenges, practice syntax, and build real confidence.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/topics/python-basics"
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#181240] hover:bg-white/90 shadow-sm transition-all"
          >
            Start Coding Free
          </Link>
          <Link
            href="/profile"
            className="rounded-xl border border-white/30 bg-black/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/30 transition-colors"
          >
            View Your Profile
          </Link>
        </div>
      </section>
    </div>
  );
}
