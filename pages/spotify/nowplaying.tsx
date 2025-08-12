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
  const [track, setTrack] = useState<Track | null>(null); // Use the Track type

  useEffect(() => {
    fetch("/api/spotify/currently-playing")
      .then(res => res.json())
      .then(data => setTrack(data));
  }, []);

  if (!track) return <p>Loading...</p>;

  if (!track.isPlaying) return <p>Nothing is playing right now 🎧</p>;

  return (
    <div style={{ padding: 20 }}>
      <a href={track.trackUrl} target="_blank" rel="noreferrer">
        <img src={track.albumImageUrl} alt={track.album} width={200} />
        <h2>{track.title}</h2>
        <p>{track.artist}</p>
        <p><em>{track.album}</em></p>
      </a>
    </div>
  );
}
