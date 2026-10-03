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
  const progressPercent = Math.round((stats.solved_exercises / (stats.total_exercises || 1)) * 100);

  return (
    <div className="max-w-3xl py-8">
      {/* Header Profile Section */}
      <div className="flex items-center gap-4 mb-10">
        {session.user.image && (
          <img src={session.user.image} alt="Profile" className="w-16 h-16 rounded-full" />
        )}
        <div>
          <h1 className="text-2xl font-bold text-ink">{session.user.name}</h1>
          <p className="text-muted text-sm">{session.user.email}</p>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="mb-12 rounded-lg border border-line bg-white p-6">
        <h2 className="text-lg font-semibold mb-2">Overall Progress</h2>
        <div className="flex justify-between text-sm mb-2 text-muted">
          <span>{stats.solved_exercises} solved</span>
          <span>{stats.total_exercises} total</span>
        </div>
        <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden">
          <div 
            className="h-full bg-ok transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Solved Exercises List */}
      <h2 className="text-xl font-bold mb-4">Recently Solved</h2>
      {recent_solved.length === 0 ? (
        <p className="text-muted">You haven't solved any exercises yet. Get coding!</p>
      ) : (
        <ul className="space-y-3">
          {recent_solved.map((ex) => (
            <li key={ex.id}>
              <Link 
                href={`/exercises/${ex.id}`}
                className="flex items-center justify-between rounded-md border border-line bg-white p-4 hover:border-brand hover:shadow-sm"
              >
                <div>
                  <span className="font-medium text-ink block">{ex.title}</span>
                  <span className="text-xs text-muted mt-1 uppercase tracking-wider">{ex.topic_slug}</span>
                </div>
                <span className="rounded-full bg-ok/10 px-3 py-1 text-xs font-bold text-ok uppercase">
                  Solved
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
