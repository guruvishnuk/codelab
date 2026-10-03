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
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
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
