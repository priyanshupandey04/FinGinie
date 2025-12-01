// app/page.tsx  (server component — no "use client")
import { getServerSession, Session } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authStuff";
import LandingClient from "@/components/LandingClient";

export default async function Page() {
  const session: Session | null = await getServerSession(authOptions as any);
  return <LandingClient session={session} />;
}
