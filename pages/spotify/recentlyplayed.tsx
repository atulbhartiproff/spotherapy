import { useEffect, useState } from "react";

// Define interfaces for the Spotify API response
interface Artist {
  name: string;
}

interface Album {
  images: { url: string }[];
}

interface Track {
  name: string;
  album: Album;
  artists: Artist[];
}

interface RecentlyPlayedItem {
  played_at: string;
  track: Track;
}

export default function RecentlyPlayed() {
  const [tracks, setTracks] = useState<RecentlyPlayedItem[]>([]); // Use the interface for type safety

  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await fetch("/api/spotify/recently-played");
        const data = await res.json();
        if (data && data.items) {
          setTracks(data.items);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchTracks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Recently Played Tracks</h2>
      {tracks.length === 0 ? (
        <p>No tracks found</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tracks.map((track) => (
            <li key={track.played_at} style={{ marginBottom: "10px" }}>
              <img
                src={track.track.album.images[2]?.url || ""}
                alt={track.track.name}
                width={50}
                height={50}
                style={{ borderRadius: "4px", marginRight: "10px" }}
              />
              <strong>{track.track.name}</strong> —{" "}
              {track.track.artists.map((a) => a.name).join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
