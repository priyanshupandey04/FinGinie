import { getServerSession, Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { ReactNode } from "react";
import { authOptions } from "../api/auth/[...nextauth]/authStuff";
import { redirect } from "next/navigation";

type Props = {
  children: ReactNode;
};

const layout = async (props: Props) => {
  const session: Session | null = await getServerSession(authOptions as any);

  console.log("..session = ", session);

  if(session){
    redirect("/dashboard");
  }

  return (
    <div className="bg-black h-[100vh]  w-[100vw] relative overflow-hidden ">
      <div className="circlularColoredBlur h-52 w-52 blur-[80px] absolute -right-10 -bottom-10 md:hidden " />
    
      <div className="bg-black h-[100%] md:h-[100%] w-[100vw] flex items-center justify-center ">
        {props.children}
      </div>
    </div>
  );
};

export default layout;
