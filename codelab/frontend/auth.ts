import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { SignJWT, jwtVerify } from "jose";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt({ token, account }) {
      if (account?.provider) {
        token.provider = account.provider;
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (!user?.email || !process.env.AUTH_SECRET) return;

      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
      ).replace(/\/+$/, "");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const token = await new SignJWT({
          email: user.email,
          name: user.name || "CodeLab Learner",
          picture: user.image || "",
          provider: account?.provider || "oauth",
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("5m")
          .sign(new TextEncoder().encode(process.env.AUTH_SECRET));

        const res = await fetch(`${apiBase}/api/users/me/welcome`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          console.error(
            `[CodeLab Auth] Welcome email trigger returned ${res.status}`
          );
        }
      } catch (err) {
        // Non-blocking: never prevent a user from signing in if email delivery fails
        console.error("[CodeLab Auth] Failed to trigger welcome email:", err);
      } finally {
        clearTimeout(timeoutId);
      }
    },
  },
  jwt: {
    // We override the default encrypted JWT (JWE) to use a standard signed JWT (JWS).
    // This allows our FastAPI backend to easily decode it using PyJWT.
    encode: async ({ secret, token }) => {
      const encodedToken = await new SignJWT(token!)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(new TextEncoder().encode(secret as string));
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      if (!token) return null;
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(secret as string),
          { algorithms: ["HS256"] }
        );
        return payload as any;
      } catch (e) {
        return null;
      }
    },
  },
});
