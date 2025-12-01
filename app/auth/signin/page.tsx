"use client";

import ElectricBorder from "@/components/ElectricBorder";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { set, z, ZodError } from "zod";

const singInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must be at most 20 characters" }),
});

const page = () => {
  return (
    <div className=" md:w-[30rem] w-[20rem]">
      <ElectricBorder
        color="#A283C3FF"
        speed={1}
        chaos={0.5}
        thickness={3}
        style={{ borderRadius: 10 }}
        className="w-full p-4 hidden md:block"
      >
        <Form />
      </ElectricBorder>
      <div className="md:hidden  p-4 relative">
        <div className="absolute border-2 border-[#ffffff] h-full w-full animate-pulse left-0 top-0 rounded-xl"></div>
        <Form />
      </div>
    </div>
  );
};

const Form = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mailError, setMailError] = useState<string>("");
  const [passError, setPassError] = useState<string>("");
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMailError("");
    setIsSigningIn(false);
    setPassError("");
    setError("");
    const parsed = await singInSchema.safeParseAsync({ email, password });

    if (!parsed.success) {
      const errorType = parsed.error._zod.def[0].path[0];
      const errorMessage = parsed.error._zod.def[0].message;

      if (errorType === "email") {
        setMailError(errorMessage);
      } else if (errorType === "password") {
        setPassError(errorMessage);
      }
    } else {
      setIsSigningIn(true);

      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });

        if (!res?.ok) {
          setError("Invalid credentials. Please try again.");
        } else {
          toast("Signed in", {
            description: "You can now access your dashboard",
            duration: 3000,
            style: {
              background: "#00000005",
              backdropFilter: "blur(20px)",
              color: "#ffffff",
            },
          });

          setIsSigningIn(false);
          await new Promise((r) => setTimeout(r, 1000));
          router.push("/dashboard");
        }
        setIsSigningIn(false);
      } catch (err: unknown) {
        setError(err as string);
      }
    }
  };
  return (
    <div className="w-full ">
      <h1 className="text-2xl font-sans text-white text-center mb-5 font-bold">
        Welcome back
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-4"
      >
        <div className="h-full w-full  relative flex flex-col items-center gap-2">
          <div
            className={`text-white/70 absolute ${
              email.length > 0
                ? "-top-1 md:-top-2 left-6 md:left-8 text-xs"
                : "top-2 left-6 md:left-8 text-base md:-z-10 text-white select-none"
            }  bg-black transition-all duration-200 linear `}
          >
            Email
          </div>
          <div
            className={`w-[90%] flex rounded-md flex-col items-center ${
              mailError.length > 0 ? "error" : ""
            }`}
          >
            <input
              type="email"
              name="email"
              ref={emailRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full  p-1 text-white border border-white rounded-md  py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          {mailError.length > 0 && (
            <p className="text-xs text-red-500">{mailError}</p>
          )}
        </div>
        <div className="h-full w-full  relative flex flex-col items-center gap-2">
          <div
            className={`text-white/70 absolute ${
              password.length > 0
                ? "-top-1 md:-top-2 left-6 md:left-8 text-xs"
                : "top-2 left-6 md:left-8 text-base md:-z-10 text-white select-none"
            }  bg-black transition-all duration-200 linear`}
          >
            Password
          </div>
          <div
            className={`w-[90%] flex rounded-md flex-col items-center ${
              passError.length > 0 ? "error" : ""
            }`}
          >
            <input
              type="password"
              name="password"
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-1 text-white border border-white rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          {passError.length > 0 && (
            <p className="text-xs text-red-500">{passError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSigningIn}
          className={`bg-purple-800 text-base font-medium p-2 rounded   text-white px-5 active:scale-95 transition-colors duration-100 z-10 flex justify-center items-center gap-2 ${
            isSigningIn
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-purple-500 hover:text-black"
          }`}
        >
          {isSigningIn && <Spinner />}
          {isSigningIn && "Sign you in..."}
          {!isSigningIn && "Sign in"}
        </button>
        {error.length > 0 && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default page;
