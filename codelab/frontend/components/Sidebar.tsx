import Link from "next/link";
import { getTopics } from "@/lib/api";

export default async function Sidebar() {
  let topics: Awaited<ReturnType<typeof getTopics>> = [];
  try {
    topics = await getTopics();
  } catch {
    return <p className="px-5 pb-4 text-sm text-bad">Can't reach the API.</p>;
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <nav className="px-3 pb-4" aria-label="Topics">
        <ul className="space-y-1">
          {topics.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/topics/${t.slug}`}
                className="block rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-brand-soft"
              >
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Auth Section */}
      <div className="border-t border-line p-4">
        <AuthWidget />
      </div>
    </div>
  );
}

// We extract this to keep the file clean. 
// Server actions allow us to run signIn/signOut securely.
import { auth, signIn, signOut } from "@/auth";

async function AuthWidget() {
  const session = await auth();

  if (session?.user) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          {session.user.image && (
            <img src={session.user.image} alt="Avatar" className="h-8 w-8 rounded-full" />
          )}
          <span className="truncate text-sm font-medium">{session.user.name}</span>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit" className="text-xs text-brand hover:underline">
            Logout
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <button type="submit" className="w-full rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark">
        Log In
      </button>
    </form>
  );
}
