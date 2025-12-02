import { getServerSession, Session } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/authStuff";
import { redirect } from "next/navigation";
import Dashboard from "./Dashboard";

type Props = {};

const dashboard = async (props: Props) => {
  const session: Session | null = await getServerSession(authOptions as any);
  if (!session) redirect("/auth/signin");
  console.log("session = ", session);
  return (
    <div className="text-white">
      <Dashboard id={parseInt(session.user.id)} />
    </div>
  );
};

export default dashboard;
