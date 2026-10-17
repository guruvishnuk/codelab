import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { SceneLazy } from "@/components/home/SceneLazy";
import ThemeToggle from "@/components/home/ThemeToggle";
import "@/app/home.css";

interface LoginPageProps {
  searchParams?: {
    callbackUrl?: string;
    error?: string;
  };
}

function getErrorMessage(error?: string) {
  if (!error) return null;
  switch (error) {
    case "OAuthSignin":
    case "OAuthCallback":
      return "Could not connect to provider. Please try again.";
    case "OAuthAccountNotLinked":
      return "An account with this email already exists with another provider.";
    case "AccessDenied":
      return "Sign-in was cancelled. You can try again whenever ready.";
    case "Callback":
      return "Session callback error. Please retry.";
    case "Configuration":
      return "Authentication setup issue. Please try again shortly.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const callbackUrl = searchParams?.callbackUrl || "/";
  const errorMessage = getErrorMessage(searchParams?.error);

  return (
    <div className="home3d auth-page">
      <SceneLazy />

      {/* Top Header */}
      <header className="auth-nav-wrap">
        <Link className="logo" href="/">
          <i>&lt;/&gt;</i>CodeLab
        </Link>
        <div className="r">
          <Link className="btn hide" href="/topics/python-basics">
            Browse tracks
          </Link>
          <ThemeToggle />
          <Link className="btn" href="/">
            ← Home
          </Link>
        </div>
      </header>

      {/* Centered Auth Card Shell */}
      <main className="auth-shell">
        <div className="aur" />
        <div className="grid" />

        <div className="auth-card">
          {session?.user ? (
            /* Active Session State */
            <div className="auth-user-box">
              <div className="auth-avatar-shell">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    className="auth-avatar"
                  />
                ) : (
                  <div
                    className="auth-avatar"
                    style={{
                      display: "grid",
                      placeItems: "center",
                      fontSize: "26px",
                      background: "var(--v)",
                      color: "#fff",
                    }}
                  >
                    {session.user.name?.[0]?.toUpperCase() || "C"}
                  </div>
                )}
                <span className="auth-avatar-sparkle">⚡</span>
              </div>

              <div className="auth-user-name">
                {session.user.name || "CodeLab Learner"}
              </div>
              <div className="auth-user-email">
                {session.user.email}
              </div>

              <p className="auth-sub" style={{ margin: "0 0 16px" }}>
                You are currently signed in. Ready to continue coding?
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                <Link
                  href={callbackUrl}
                  className="btn p"
                  style={{ width: "100%", justifyContent: "center", padding: "11px 18px" }}
                >
                  Continue Learning →
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                  style={{ width: "100%" }}
                >
                  <button
                    type="submit"
                    className="btn"
                    style={{ width: "100%", justifyContent: "center", padding: "10px 18px", fontSize: "13.5px" }}
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Sign in Providers */
            <>
              <div className="auth-badge">
                <span>⚡ Instant Cloud Sync & Progress</span>
              </div>

              <h1 className="auth-title">Welcome to CodeLab</h1>
              <p className="auth-sub">
                Sign in to save your code, maintain streaks, and unlock coding badges.
              </p>

              {errorMessage && (
                <div className="auth-error">
                  <span style={{ fontSize: "14px", lineHeight: "1" }}>⚠️</span>
                  <div>{errorMessage}</div>
                </div>
              )}

              <div className="auth-providers">
                {/* Google Sign In */}
                <form
                  action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: callbackUrl });
                  }}
                >
                  <button type="submit" className="auth-btn google">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </form>

                {/* GitHub Sign In */}
                <form
                  action={async () => {
                    "use server";
                    await signIn("github", { redirectTo: callbackUrl });
                  }}
                >
                  <button type="submit" className="auth-btn github">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                    <span>Continue with GitHub</span>
                  </button>
                </form>
              </div>

              <div className="auth-divider">
                <span>Account benefits</span>
              </div>

              <div className="auth-perk-row">
                <div className="auth-perk-item">
                  <span>🔄</span>
                  <span>Auto-Sync</span>
                </div>
                <div className="auth-perk-item">
                  <span>🔥</span>
                  <span>Streaks</span>
                </div>
                <div className="auth-perk-item">
                  <span>🏆</span>
                  <span>XP Ranks</span>
                </div>
              </div>

              <div className="auth-card-footer">
                <div>
                  Just want to practice?{" "}
                  <Link href="/topics/python-basics">
                    Start as a guest →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Bottom Sticky Minimal Footer */}
      <footer className="auth-page-footer">
        <span>© 2026 CodeLab · No password required</span>
        <span>
          <Link href="/topics/python-basics">Guest Mode</Link> ·{" "}
          <Link href="/about">About</Link>
        </span>
      </footer>
    </div>
  );
}
