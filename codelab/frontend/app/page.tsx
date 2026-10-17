import "./home.css";
import Link from "next/link";
import { auth } from "@/auth";
import { getTopics, getDashboard } from "@/lib/api";
import { SceneLazy } from "@/components/home/SceneLazy";
import TiltCard from "@/components/home/TiltCard";
import LiveEditor from "@/components/home/LiveEditor";
import MentorChat from "@/components/home/MentorChat";
import GamificationCard from "@/components/home/GamificationCard";
import ThemeToggle from "@/components/home/ThemeToggle";

const FALLBACK_TOPICS = [
  { slug: "python-basics", title: "Python Basics", summary: "Variables, types, input and output.", count: "2 challenges", pct: 100 },
  { slug: "control-flow", title: "Control Flow", summary: "If, loops and decisions.", count: "2 challenges", pct: 60 },
  { slug: "strings", title: "Strings", summary: "Slicing, formatting, searching.", count: "2 challenges", pct: 30 },
  { slug: "functions-and-scope", title: "Functions & Scope", summary: "Reuse code with confidence.", count: "3 challenges", pct: 15 },
  { slug: "lists-and-tuples", title: "Lists & Tuples", summary: "Order, indexing, comprehension.", count: "3 challenges", pct: 0 },
  { slug: "dictionaries-and-sets", title: "Dictionaries & Sets", summary: "Fast lookups and unique data.", count: "3 challenges", pct: 0 },
];

export default async function Home() {
  const session = await auth();

  // 1. Fetch real tracks with safe fallback
  let topics = FALLBACK_TOPICS;
  try {
    const real = await getTopics();
    if (real && real.length > 0) {
      topics = real.map((t, idx) => ({
        slug: t.slug,
        title: t.title,
        summary: t.summary || "Interactive practice challenges.",
        count: "Interactive challenges",
        pct: idx === 0 ? 80 : idx === 1 ? 55 : idx === 2 ? 30 : 10,
      }));
    }
  } catch {
    // Backend may be waking up, fallback is ready
  }

  // 2. Fetch real user gamification stats if logged in
  let userStats = {
    rankTitle: "Code Crafter",
    currentXp: 650,
    nextXp: 1000,
    streakDays: 7,
    progressPercent: 65,
    isLoggedIn: false,
  };

  if (session?.user) {
    try {
      const dash = await getDashboard();
      if (dash?.stats) {
        userStats = {
          rankTitle: dash.stats.level_info?.title || "Python Apprentice",
          currentXp: dash.stats.total_xp || 0,
          nextXp: dash.stats.level_info?.next_level_xp || 150,
          streakDays: dash.stats.streak_days || 0,
          progressPercent: dash.stats.level_info?.progress_percent || 10,
          isLoggedIn: true,
        };
      }
    } catch {
      userStats.isLoggedIn = true;
    }
  }

  const cta = session?.user
    ? { href: "/topics/python-basics", label: "Continue Learning →" }
    : { href: "/topics/python-basics", label: "Start Coding Free" };

  return (
    <div className="home3d">
      <SceneLazy />

      {/* Header & Hero Section */}
      <header className="wrap hero">
        <div className="aur" />
        <div className="grid" />

        <nav>
          <Link className="logo" href="/">
            <i>&lt;/&gt;</i>CodeLab
          </Link>
          <div className="r">
            <a className="btn hide" href="#tracks">
              Browse tracks
            </a>
            <ThemeToggle />
            {session?.user ? (
              <Link className="btn p" href="/profile">
                {session.user.name?.split(" ")[0] || "Profile"} ⚡
              </Link>
            ) : (
              <Link className="btn p" href="/login">
                Sign in
              </Link>
            )}
          </div>
        </nav>

        <div className="hg" style={{ marginTop: "50px" }}>
          <div>
            <h1>
              Stop watching.
              <br />
              <em>Start typing.</em>
            </h1>
            <p className="lead">
              Read a 2-minute note, write the code in your browser, and see every test pass or fail instantly. No setup,
              no paywall.
            </p>
            <div className="cta">
              <Link className="btn p" href={cta.href}>
                {cta.label}
              </Link>
              <a className="btn" href="#loop">
                See how it works
              </a>
            </div>
            <div className="pills">
              <span>No sign-up to start</span>
              <span>Python 3 ready</span>
              <span>100% Free tracks</span>
            </div>
          </div>

          <LiveEditor />
        </div>
      </header>

      {/* The 3-Step Learning Loop */}
      <section id="loop">
        <div className="wrap">
          <h2>One loop. Zero fluff.</h2>
          <p className="sub">
            Learning sticks when you recall it and get feedback right away. Every lesson follows the same three steps.
          </p>
          <div className="loop">
            <div>
              <span className="ic" style={{ background: "color-mix(in srgb, var(--v) 18%, transparent)" }}>
                📖
              </span>
              <h3>Read</h3>
              <p>A laser-focused Markdown note that explains only the core concept in under two minutes.</p>
            </div>
            <div>
              <span className="ic" style={{ background: "color-mix(in srgb, var(--c) 18%, transparent)" }}>
                ⌨️
              </span>
              <h3>Write</h3>
              <p>An in-browser syntax-highlighted editor opens instantly with automated draft saving.</p>
            </div>
            <div>
              <span className="ic" style={{ background: "color-mix(in srgb, var(--m) 22%, transparent)" }}>
                ✅
              </span>
              <h3>Verify</h3>
              <p>Inspect inputs, expected outputs, actual outputs, and friendly diagnostics immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Six Curriculum Tracks */}
      <section id="tracks">
        <div className="wrap">
          <h2>Six tracks to your first real fluency</h2>
          <p className="sub">Start anywhere. Guests can run code right away; sign in to save your cloud progress.</p>
          <div className="tr">
            {topics.map((t) => (
              <TiltCard key={t.slug} href={`/topics/${t.slug}`} className="t">
                <h3>{t.title}</h3>
                <p>{t.summary}</p>
                <span className="mono">{t.count}</span>
                <div className="prog">
                  <i style={{ width: `${t.pct}%` }} />
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification: XP, Levels, Badges, Streaks */}
      <section>
        <div className="wrap">
          <h2>Every passing test pays out</h2>
          <p className="sub">
            Earn XP, climb ranks, maintain your daily streak, and unlock milestone achievement badges.
          </p>
          <GamificationCard {...userStats} />
        </div>
      </section>

      {/* Interactive Socratic AI Mentor Demo */}
      <section>
        <MentorChat />
      </section>

      {/* Roadmap: Where CodeLab is Going */}
      <section>
        <div className="wrap">
          <h2>Where CodeLab is going</h2>
          <div className="road">
            <div className="ph">
              <h3>AI mentor</h3>
              <p>Progressive hints and a plain-English error explainer.</p>
            </div>
            <div className="ph">
              <h3>Playground+</h3>
              <p>Custom test inputs, runtime stats, then JavaScript, SQL and Go.</p>
            </div>
            <div className="ph">
              <h3>Micro-labs</h3>
              <p>Build a CLI expense tracker, a Markdown parser and an API client.</p>
            </div>
            <div className="ph">
              <h3>Community</h3>
              <p>Peer solutions, leaderboards and verifiable certificates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <div className="wrap">
        <div className="final">
          <h2>Your first line of code is one click away.</h2>
          <p>No account, no install. Open the editor and pass your first test today.</p>
          <Link className="btn" href="/topics/python-basics">
            Start coding free
          </Link>
        </div>

        <footer>
          <span>© 2026 CodeLab. Built for people who learn by doing.</span>
          <span>
            <Link href="/" className="hover:underline">
              Tracks
            </Link>{" "}
            ·{" "}
            <Link href="/about" className="hover:underline">
              About
            </Link>{" "}
            ·{" "}
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>{" "}
            ·{" "}
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          </span>
        </footer>
      </div>
    </div>
  );
}
