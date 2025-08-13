import { getToken } from "next-auth/jwt";
import type { NextApiRequest, NextApiResponse } from "next";

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyAlbum {
  name: string;
  images: SpotifyImage[];
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: { spotify: string };
}

interface SpotifyRecentlyPlayedItem {
  played_at: string;
  track: SpotifyTrack;
}

interface SpotifyRecentlyPlayedResponse {
  items: SpotifyRecentlyPlayedItem[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || typeof token.accessToken !== "string") {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=20", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch recently played tracks" });
    }

    const data: SpotifyRecentlyPlayedResponse = await response.json();

    const tracks = data.items.map((item) => ({
      playedAt: item.played_at,
      title: item.track.name,
      artist: item.track.artists.map((a) => a.name).join(", "),
      album: item.track.album.name,
      albumImageUrl: item.track.album.images[0]?.url,
      trackUrl: item.track.external_urls.spotify,
    }));

    return res.status(200).json(tracks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recently played tracks" });
  }
}