import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export default async function AuthWidget() {
  const session = await auth();

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/profile" className="flex items-center gap-2 overflow-hidden hover:opacity-80">
          {session.user.image && (
            <img src={session.user.image} alt="Avatar" className="h-8 w-8 rounded-full border border-line" />
          )}
          <span className="truncate text-sm font-medium text-ink">{session.user.name}</span>
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit" className="text-xs font-medium text-muted hover:text-brand hover:underline">
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
      <button type="submit" className="rounded-md bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark">
        Log In
      </button>
    </form>
  );
}
