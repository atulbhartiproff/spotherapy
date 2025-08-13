import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const accessToken = req.headers.authorization?.split(" ")[1] || process.env.SPOTIFY_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(401).json({ error: "No access token found" });
    }

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=20",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

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