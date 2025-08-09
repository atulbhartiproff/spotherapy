import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const SPOTIFY_SCOPES = [
  "user-read-email",
  "user-read-private",
  "user-read-currently-playing",
  "user-read-recently-played",
].join(",");

const SPOTIFY_AUTHORIZATION_URL =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({ scope: SPOTIFY_SCOPES }).toString();

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: SPOTIFY_AUTHORIZATION_URL,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = Date.now() + account.expires_at! * 1000;
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken; // Safely assign if it's a string
      } else {
        session.accessToken = undefined; // Fallback to undefined if not a string
      }
      return session;
    },
  },
});
