import { getServerSession, Session } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/authStuff";
import { redirect } from "next/navigation";

type Props = {};

const dashboard = async (props: Props) => {
  const session: Session | null = await getServerSession(authOptions as any);
  if (!session) redirect("/auth/signin");
  return <div>dashboard</div>;
};

export default dashboard;
