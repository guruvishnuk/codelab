import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getDashboard } from "@/lib/api";

export default async function ProfilePage() {
  const session = await auth();

  // 1. Kick them out if they aren't logged in
  if (!session?.user) {
    redirect("/");
  }

  // 2. Fetch the data
  const dashboard = await getDashboard().catch(() => null);

  if (!dashboard) {
    return <p className="text-bad mt-10">Failed to load dashboard data.</p>;
  }

  const { stats, recent_solved } = dashboard;
  const progressPercent = Math.round(
    (stats.solved_exercises / (stats.total_exercises || 1)) * 100
  );

  const levelInfo = stats.level_info || {
    level: 1,
    title: "Novice Coder",
    current_xp: stats.total_xp || 0,
    next_level_xp: 150,
    progress_percent: 0,
  };

  const badges = stats.badges || [];

  return (
    <div className="max-w-4xl py-8">
      {/* Header Profile Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-line">
        <div className="flex items-center gap-4">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-brand/30 shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-brand/10 text-brand font-bold flex items-center justify-center text-xl">
              {session.user.name?.[0] || "U"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-ink">{session.user.name}</h1>
            <p className="text-muted text-sm">{session.user.email}</p>
          </div>
        </div>

        {/* Level & Streak Pill Highlights */}
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand border border-brand/20 flex items-center gap-1.5">
            <span>⚡</span> {stats.total_xp || 0} XP
          </div>
          <div className="rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
            <span>🔥</span> {stats.streak_days || 0} Day Streak
          </div>
        </div>
      </div>

      {/* Level Progression Banner */}
      <div className="mb-8 rounded-xl border border-line bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              Rank Level {levelInfo.level}
            </span>
            <h2 className="text-xl font-bold text-ink">{levelInfo.title}</h2>
          </div>
          <span className="text-sm font-semibold text-muted">
            {levelInfo.current_xp} / {levelInfo.next_level_xp} XP
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-700"
            style={{ width: `${Math.max(5, levelInfo.progress_percent)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Earn +50 XP for Easy, +100 XP for Medium, and +15 XP bonus for maintaining daily streaks.
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-line bg-white p-5 shadow-xs">
          <div className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Curriculum Solved
          </div>
          <div className="text-2xl font-black text-ink">
            {stats.solved_exercises}{" "}
            <span className="text-sm font-medium text-muted">/ {stats.total_exercises}</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-ok" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white p-5 shadow-xs">
          <div className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Active Streak
          </div>
          <div className="text-2xl font-black text-ink flex items-center gap-2">
            <span>🔥</span> {stats.streak_days}{" "}
            <span className="text-sm font-medium text-muted">Days</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            {stats.streak_days > 0 ? "Streak is active today! Keep it going." : "Solve an exercise to start a streak!"}
          </p>
        </div>

        <div className="rounded-xl border border-line bg-white p-5 shadow-xs">
          <div className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">
            Total XP Earned
          </div>
          <div className="text-2xl font-black text-ink flex items-center gap-2">
            <span>⚡</span> {stats.total_xp || 0}
          </div>
          <p className="mt-2 text-xs text-muted">Next Rank at {levelInfo.next_level_xp} XP</p>
        </div>
      </div>

      {/* Achievement Badges Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <span>🏅</span> Achievement Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-xl border p-4 transition-all ${
                badge.unlocked
                  ? "border-brand/40 bg-brand-soft/40 shadow-xs"
                  : "border-line bg-white opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{badge.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-ink">{badge.title}</h3>
                    {badge.unlocked ? (
                      <span className="rounded-full bg-ok/10 px-2 py-0.5 text-[10px] font-bold text-ok uppercase">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted font-medium">
                        {badge.progress} / {badge.max_progress}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-1">{badge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solved Exercises List */}
      <div>
        <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <span>📝</span> Recently Solved
        </h2>
        {recent_solved.length === 0 ? (
          <div className="rounded-xl border border-line bg-white p-8 text-center">
            <p className="text-muted mb-3">You haven't solved any exercises yet.</p>
            <Link
              href="/topics/python-basics"
              className="inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
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
                  className="flex items-center justify-between rounded-xl border border-line bg-white p-4 hover:border-brand hover:shadow-xs transition-all"
                >
                  <div>
                    <span className="font-semibold text-ink block">{ex.title}</span>
                    <span className="text-xs text-muted mt-0.5 uppercase tracking-wider">
                      {ex.topic_slug}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase ${
                        ex.difficulty === "easy"
                          ? "bg-ok/10 text-ok"
                          : ex.difficulty === "medium"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-bad/10 text-bad"
                      }`}
                    >
                      {ex.difficulty}
                    </span>
                    <span className="text-xs font-semibold text-ok bg-ok/10 px-3 py-1 rounded-full">
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
