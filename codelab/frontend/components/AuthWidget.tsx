import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/app/actions";

export default async function AuthWidget() {
  const session = await auth();

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="flex items-center gap-2.5 rounded-full border border-line bg-surface/80 px-3 py-1 hover:border-brand/50 transition-colors shadow-xs"
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt="Avatar"
              className="h-6 w-6 rounded-full border border-brand/40 object-cover"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-brand/20 text-brand font-bold text-xs flex items-center justify-center">
              {session.user.name?.[0] || "U"}
            </div>
          )}
          <span className="truncate max-w-[120px] text-xs font-semibold text-ink">
            {session.user.name?.split(" ")[0]}
          </span>
          <span className="text-[10px] text-brand">⚡</span>
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-lg border border-line/60 bg-surface/40 px-2.5 py-1 text-xs font-medium text-muted hover:text-bad hover:border-bad/40 transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-brand/30 hover:bg-brand-dark hover:shadow-brand/50 transition-all"
      >
        <span>Sign in</span>
        <span>→</span>
      </Link>
    </div>
  );
}
