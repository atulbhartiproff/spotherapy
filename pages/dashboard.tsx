import { useSession, signIn } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") return <p>Loading...</p>;

  return <h1>Welcome, {session?.user?.name}!</h1>;
}
