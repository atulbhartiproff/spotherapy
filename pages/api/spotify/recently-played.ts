import { NextApiRequest, NextApiResponse } from "next";

async function refreshAccessToken(refreshToken: string) {
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
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  return response.json();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let accessToken = req.headers.authorization?.split(" ")[1] || process.env.SPOTIFY_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(401).json({ error: "No access token found" });
    }

    // Make the API request
    let response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=20",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // If the token is expired, refresh it
    if (response.status === 401) {
      console.log("Access token expired. Attempting to refresh...");
      const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN; // Ensure this is set in your environment variables
      if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token found" });
      }

      const refreshedTokens = await refreshAccessToken(refreshToken);
      accessToken = refreshedTokens.access_token;

      // Retry the API request with the new access token
      response = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=20",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching recently played:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}