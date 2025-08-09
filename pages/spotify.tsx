// pages/spotify.tsx
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SpotifyLoginPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session && status !== "loading") {
      signIn("spotify");
    }
  }, [session, status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-xl font-bold">Spotify Connected ✅</h1>
        <p>Logged in as {session.user?.name}</p>
      </div>
    );
  }

  return null; // It will redirect to Spotify login
}
