import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | CodeLab",
  description:
    "Learn about CodeLab's philosophy, interactive curriculum, and secure Docker sandboxed code execution engine.",
};

export default function AboutPage() {
  const architectures = [
    {
      title: "Next.js 14 Frontend",
      tag: "Client & SSR",
      description:
        "Engineered with React Server Components, App Router, TypeScript, and Tailwind CSS. Features CodeMirror 6 with live auto-save and OAuth authentication.",
      badge: "App Router",
    },
    {
      title: "FastAPI Backend",
      tag: "REST API",
      description:
        "High-performance asynchronous Python API with automatic OpenAPI documentation, JWT-secured session verification, and structured Pydantic schemas.",
      badge: "Python 3.11+",
    },
    {
      title: "Docker Sandbox Runner",
      tag: "Isolated Runtime",
      description:
        "Executes untrusted user code inside ephemeral, zero-network Docker containers with strict CPU, memory, and execution time bounds.",
      badge: "Secure Sandbox",
    },
    {
      title: "Relational Database",
      tag: "Data Layer",
      description:
        "SQLAlchemy 2 ORM modeling topics, exercises, submissions, and user accounts. Zero-friction SQLite for dev with PostgreSQL for production deployments.",
      badge: "Postgres & SQLite",
    },
  ];

  const securityFeatures = [
    {
      label: "Zero Network Access",
      detail: "Containers run with `--net none` to strictly prevent any outbound or inbound network connections.",
    },
    {
      label: "Strict Memory & CPU Limits",
      detail: "Hardware caps at 128 MB RAM and 0.5 CPU prevent memory exhaustion and runaway fork bombs.",
    },
    {
      label: "5-Second Execution Timeout",
      detail: "Subprocess execution kills runaway infinite loops and hanging scripts automatically.",
    },
    {
      label: "Ephemeral Lifecycle",
      detail: "Containers run with `--rm`, ensuring state is wiped clean immediately after test evaluation.",
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
    {
      name: "Object-Oriented Python",
      desc: "Classes, instances, attributes, methods, and encapsulation.",
      status: "In Development",
    },
  ];

  return (
    <div className="max-w-4xl space-y-16 py-4">
      {/* Hero Section */}
      <section className="space-y-4 border-b border-line pb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          About CodeLab
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
          Learn topic by topic.
          <span className="block text-brand">Read notes. Write code. Pass tests.</span>
        </h1>
        <p className="max-w-[70ch] text-lg text-muted">
          CodeLab is a minimal, distraction-free coding platform built to bridge the gap between
          reading technical tutorials and building practical muscle memory. Every concept is accompanied
          by concise notes and instant test-driven exercises.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link
            href="/topics/python-basics"
            className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
          >
            Start with Python Basics →
          </Link>
          <Link
            href="/"
            className="rounded-md border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-brand-soft"
          >
            Browse All Topics
          </Link>
          <Link
            href="/search?q=loop"
            className="rounded-md border border-line bg-white px-5 py-2.5 text-sm font-medium text-muted hover:text-ink"
          >
            Search Exercises
          </Link>
        </div>
      </section>

      {/* The 3-Step Learning Loop */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-ink">The Learning Loop</h2>
          <p className="mt-1 text-sm text-muted">
            Engineered around active recall and immediate automated verification.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft font-mono font-bold text-brand">
              01
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">Bite-Sized Notes</h3>
            <p className="mt-2 text-sm text-muted">
              Laser-focused Markdown notes explaining the core concept in under two minutes. No fluff or irrelevant history.
            </p>
          </div>

          <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft font-mono font-bold text-brand">
              02
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">In-Browser Editor</h3>
            <p className="mt-2 text-sm text-muted">
              Write Python code directly in a syntax-highlighted CodeMirror editor equipped with local draft autosave.
            </p>
          </div>

          <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft font-mono font-bold text-brand">
              03
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">Instant Test Feedback</h3>
            <p className="mt-2 text-sm text-muted">
              Submit your code to see inputs, expected outputs, actual outputs, and runtime errors in real time.
            </p>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-ink">System Architecture</h2>
          <p className="mt-1 text-sm text-muted">
            Built with modern web technologies and a decoupled backend architecture.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {architectures.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-lg border border-line bg-white p-6 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {item.tag}
                  </span>
                  <span className="rounded bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-dark">
                    {item.badge}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Docker Sandbox & Security Model */}
      <section className="rounded-xl border border-line bg-white p-8 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-ok/10 px-2.5 py-1 text-xs font-semibold text-ok">
            🛡️ Isolated Sandbox Environment
          </div>
          <h2 className="mt-3 text-2xl font-bold text-ink">How Code Runs Safely</h2>
          <p className="mt-1 text-sm text-muted">
            Executing user-submitted code requires strict multi-layer containment to ensure server stability and tenant isolation.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {securityFeatures.map((feat) => (
            <div key={feat.label} className="rounded-md border border-line/70 bg-slate-50/70 p-4">
              <h4 className="font-medium text-ink text-sm">{feat.label}</h4>
              <p className="mt-1 text-xs text-muted leading-relaxed">{feat.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-ink p-4 text-xs font-mono text-slate-200 overflow-x-auto">
          <p className="text-slate-400"># Docker sandbox command execution pattern</p>
          <p className="mt-1 text-emerald-400">
            docker run --rm -i --net none --memory 128m --cpus 0.5 python:3.11-slim python -c "$USER_CODE"
          </p>
        </div>
      </section>

      {/* Curriculum & Roadmap */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Curriculum Tracks</h2>
            <p className="mt-1 text-sm text-muted">
              Progressive mastery from foundational programming to data structures.
            </p>
          </div>
          <Link href="/" className="text-sm font-medium text-brand hover:underline">
            View full syllabus →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {curriculumTopics.map((topic) => (
            <div
              key={topic.name}
              className="flex flex-col justify-between rounded-lg border border-line bg-white p-5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-ink">{topic.name}</h3>
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                      topic.status === "Available"
                        ? "bg-ok/10 text-ok"
                        : "bg-slate-100 text-muted"
                    }`}
                  >
                    {topic.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{topic.desc}</p>
              </div>
              {topic.href && (
                <div className="mt-4 pt-3 border-t border-line/50">
                  <Link
                    href={topic.href}
                    className="text-xs font-medium text-brand hover:text-brand-dark"
                  >
                    Jump into topic →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Footer Card */}
      <section className="rounded-xl border border-line bg-brand p-8 text-white shadow-md">
        <h2 className="text-2xl font-bold">Ready to write some code?</h2>
        <p className="mt-2 max-w-[60ch] text-sm text-brand-soft">
          Dive into hands-on exercises right now. Track your solved challenges, practice syntax, and build real confidence.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/topics/python-basics"
            className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand-soft"
          >
            Start Coding Now
          </Link>
          <Link
            href="/profile"
            className="rounded-md border border-white/30 bg-transparent px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
          >
            View Your Progress Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
