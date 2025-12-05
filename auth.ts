// auth.ts
import NextAuth from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]/authStuff";

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions as any);
