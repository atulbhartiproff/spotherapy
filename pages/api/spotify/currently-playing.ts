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

interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  item: SpotifyTrack;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || typeof token.accessToken !== "string") {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (response.status === 204 || response.status > 400) {
      return res.status(200).json({ isPlaying: false });
    }

    const song: SpotifyCurrentlyPlaying = await response.json();

    return res.status(200).json({
      isPlaying: song.is_playing,
      title: song.item?.name,
      artist: song.item?.artists?.map((a) => a.name).join(", "),
      album: song.item?.album?.name,
      albumImageUrl: song.item?.album?.images?.[0]?.url,
      trackUrl: song.item?.external_urls?.spotify,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch currently playing" });
  }
}
