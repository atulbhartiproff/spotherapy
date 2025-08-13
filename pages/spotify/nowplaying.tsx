import { useEffect, useState } from "react";

interface Track {
  isPlaying: boolean;
  trackUrl: string;
  albumImageUrl: string;
  title: string;
  artist: string;
  album: string;
}

export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrack = async () => {
    try {
      const res = await fetch("/api/spotify/currently-playing");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTrack(data);
    } catch (err) {
      console.error("Error fetching track:", err);
      setTrack(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack(); // Initial fetch
    const interval = setInterval(fetchTrack, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!track || !track.isPlaying) {
    return <p>Nothing is playing right now 🎧</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <a href={track.trackUrl} target="_blank" rel="noreferrer">
        <img
          src={track.albumImageUrl}
          alt={track.album}
          width={200}
          style={{ borderRadius: 8 }}
        />
        <h2>{track.title}</h2>
        <p>{track.artist}</p>
        <p><em>{track.album}</em></p>
      </a>
    </div>
  );
}
