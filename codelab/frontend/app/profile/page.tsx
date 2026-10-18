import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getDashboard, DashboardResponse } from "@/lib/api";

const FALLBACK_DASHBOARD: DashboardResponse = {
  stats: {
    total_exercises: 12,
    solved_exercises: 0,
    total_xp: 0,
    streak_days: 0,
    level_info: {
      level: 1,
      title: "Python Apprentice",
      current_xp: 0,
      next_level_xp: 150,
      progress_percent: 5,
    },
    badges: [
      {
        id: "first_solve",
        title: "Hello World",
        description: "Solve your first coding exercise.",
        icon: "🌱",
        unlocked: false,
        progress: 0,
        max_progress: 1,
      },
      {
        id: "streak_3",
        title: "Consistent Coder",
        description: "Maintain a 3-day practice streak.",
        icon: "🔥",
        unlocked: false,
        progress: 0,
        max_progress: 3,
      },
      {
        id: "xp_500",
        title: "XP Pioneer",
        description: "Earn 500 total XP points across all tracks.",
        icon: "⚡",
        unlocked: false,
        progress: 0,
        max_progress: 500,
      },
    ],
  },
  recent_solved: [],
};

export default async function ProfilePage() {
  const session = await auth();

  // 1. Redirect if not logged in
  if (!session?.user) {
    redirect("/login");
  }

  // 2. Fetch the data with resilient fallback
  const dashboard = await getDashboard().catch(() => null);
  const isLive = Boolean(dashboard);
  const data = dashboard || FALLBACK_DASHBOARD;

  const { stats, recent_solved } = data;
  const progressPercent = Math.round(
    (stats.solved_exercises / (stats.total_exercises || 1)) * 100
  );

  const levelInfo = stats.level_info || {
    level: 1,
    title: "Python Apprentice",
    current_xp: stats.total_xp || 0,
    next_level_xp: 150,
    progress_percent: 5,
  };

  const badges = stats.badges || [];

  return (
    <div className="max-w-4xl py-2 space-y-8">
      {/* Cold Start Notice (Render free tier) */}
      {!isLive && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-ink flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <p className="font-semibold text-amber-300">
                Backend Cloud Sync Connecting
              </p>
              <p className="text-xs text-muted">
                Displaying local profile. Stats and cloud saves will synchronize automatically upon your next test run.
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors shrink-0"
          >
            Refresh
          </Link>
        </div>
      )}

      {/* Header Profile Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
        <div className="flex items-center gap-4">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-brand/50 shadow-glow object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-brand/20 text-brand font-bold flex items-center justify-center text-xl font-display border border-brand/40">
              {session.user.name?.[0] || "U"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold font-display text-ink">{session.user.name}</h1>
            <p className="text-muted text-sm font-mono">{session.user.email}</p>
          </div>
        </div>

        {/* Level & Streak Pill Highlights */}
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand border border-brand/30 flex items-center gap-1.5">
            <span>⚡</span> {stats.total_xp || 0} XP
          </div>
          <div className="rounded-full bg-amber-500/15 px-4 py-1.5 text-xs font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <span>🔥</span> {stats.streak_days || 0} Day Streak
          </div>
        </div>
      </div>

      {/* Level Progression Banner */}
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand font-mono">
              Rank Tier {levelInfo.level}
            </span>
            <h2 className="text-xl font-bold font-display text-ink">{levelInfo.title}</h2>
          </div>
          <span className="text-sm font-mono text-muted">
            {levelInfo.current_xp} / {levelInfo.next_level_xp} XP
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-surface-elevated overflow-hidden border border-line/60">
          <div
            className="h-full bg-gradient-to-r from-brand to-ok transition-all duration-700"
            style={{ width: `${Math.max(5, levelInfo.progress_percent)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Earn +50 XP for Easy, +100 XP for Medium, and +15 XP bonus for maintaining daily streaks.
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="text-muted text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            Curriculum Solved
          </div>
          <div className="text-2xl font-black font-display text-ink">
            {stats.solved_exercises}{" "}
            <span className="text-sm font-medium text-muted">/ {stats.total_exercises}</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-surface-elevated overflow-hidden">
            <div className="h-full bg-ok" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="text-muted text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            Active Streak
          </div>
          <div className="text-2xl font-black font-display text-ink flex items-center gap-2">
            <span>🔥</span> {stats.streak_days}{" "}
            <span className="text-sm font-medium text-muted">Days</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            {stats.streak_days > 0 ? "Streak active today! Keep it going." : "Solve a challenge to start your streak!"}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="text-muted text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            Total XP Earned
          </div>
          <div className="text-2xl font-black font-display text-ink flex items-center gap-2">
            <span>⚡</span> {stats.total_xp || 0}
          </div>
          <p className="mt-2 text-xs text-muted font-mono">Next Rank at {levelInfo.next_level_xp} XP</p>
        </div>
      </div>

      {/* Achievement Badges Section */}
      <div>
        <h2 className="text-xl font-bold font-display text-ink mb-4 flex items-center gap-2">
          <span>🏅</span> Achievement Milestones
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-2xl border p-4.5 transition-all ${
                badge.unlocked
                  ? "border-brand/40 bg-surface shadow-glow"
                  : "border-line bg-surface/50 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{badge.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-ink">{badge.title}</h3>
                    {badge.unlocked ? (
                      <span className="rounded-full bg-ok/15 text-ok border border-ok/30 px-2 py-0.5 text-[10px] font-bold uppercase font-mono">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted font-mono">
                        {badge.progress} / {badge.max_progress}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{badge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solved Exercises List */}
      <div>
        <h2 className="text-xl font-bold font-display text-ink mb-4 flex items-center gap-2">
          <span>📝</span> Recently Solved
        </h2>
        {recent_solved.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-8 text-center">
            <p className="text-muted mb-3">You haven't solved any exercises yet.</p>
            <Link
              href="/topics/python-basics"
              className="inline-block rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark shadow-sm shadow-brand/20 transition-all"
            >
              Start Python Basics →
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {recent_solved.map((ex) => (
              <li key={ex.id}>
                <Link
                  href={`/exercises/${ex.id}`}
                  className="flex items-center justify-between rounded-xl border border-line bg-surface p-4 hover:border-brand hover:bg-surface-hover hover:shadow-xs transition-all"
                >
                  <div>
                    <span className="font-semibold text-ink block">{ex.title}</span>
                    <span className="text-xs text-muted font-mono uppercase tracking-wider">
                      {ex.topic_slug}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase ${
                        ex.difficulty === "easy"
                          ? "bg-ok/15 text-ok border border-ok/30"
                          : ex.difficulty === "medium"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : "bg-bad/15 text-bad border border-bad/30"
                      }`}
                    >
                      {ex.difficulty}
                    </span>
                    <span className="text-xs font-semibold text-ok bg-ok/15 border border-ok/30 px-3 py-1 rounded-full">
                      ✓ Solved
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
