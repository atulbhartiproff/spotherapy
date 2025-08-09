import NextAuth, { DefaultSession } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// Extend the Session type to include `error`
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
  }
}

const SPOTIFY_SCOPES = [
  "user-read-email",
  "user-read-private",
  "user-read-currently-playing",
  "user-read-recently-played",
].join(",");

const SPOTIFY_AUTHORIZATION_URL =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({ scope: SPOTIFY_SCOPES }).toString();

type Token = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  error?: string;
};

async function refreshAccessToken(token: Token): Promise<Token> {
  try {
    const url = "https://accounts.spotify.com/api/token";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000, // 1 hour
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("Error refreshing access token", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

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
      let typedToken = token as Token;

      // Initial sign-in
      if (account) {
        typedToken = {
          accessToken: account.access_token!,
          refreshToken: account.refresh_token!,
          accessTokenExpires: Date.now() + account.expires_at! * 1000,
        };
        return typedToken;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < typedToken.accessTokenExpires) {
        return typedToken;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(typedToken);
    },
    async session({ session, token }) {
      const typedToken = token as Token;
      session.accessToken = typedToken.accessToken;
      session.error = typedToken.error;
      return session;
    },
  },
});
