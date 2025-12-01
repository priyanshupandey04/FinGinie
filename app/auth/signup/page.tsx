"use client";

import ElectricBorder from "@/components/ElectricBorder";
import { Spinner } from "@/components/ui/spinner";
import { BadgePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(5, { message: "Name must be at least 5 characters" }),
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must be at most 20 characters" }),
  confirmPassword: z.string(),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^\+?\d{10,15}$/.test(v), {
      message: "Enter a valid phone number",
    }),
});

const SignUpPage = () => {
  return (
    <div className="md:w-[30rem] w-[20rem]">
      <ElectricBorder
        color="#A283C3FF"
        speed={1}
        chaos={0.5}
        thickness={3}
        style={{ borderRadius: 10 }}
        className="w-full p-4 hidden md:block"
      >
        <SignUpForm />
      </ElectricBorder>

      <div className="md:hidden p-4 relative">
        <div className="absolute border-2 border-[#ffffff] h-full w-full animate-pulse left-0 top-0 rounded-xl"></div>
        <SignUpForm />
      </div>
    </div>
  );
};

const SignUpForm = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    acceptTos: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(false);

    const parsed = await signUpSchema.safeParseAsync({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      phone: form.phone.trim() || undefined,
    });

    if (!parsed.success) {
      const zodErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        zodErrors[key] = issue.message;
      }
      setErrors(zodErrors);

      // focus first errored field
      const firstKey = parsed.error.issues[0]?.path[0];
      if (firstKey === "name") nameRef.current?.focus();
      else if (firstKey === "email") emailRef.current?.focus();
      else if (firstKey === "password") passwordRef.current?.focus();
      else if (firstKey === "confirmPassword") confirmRef.current?.focus();
      else if (firstKey === "phone") phoneRef.current?.focus();
      return;
    }
    if (form.confirmPassword !== form.password) {
      setErrors((prev) => {
        return { ...prev, confirmPassword: "Passwords do not match" };
      });

      return;
    }

    // Passed validation
    setIsSubmitting(true);

    try {
      const data = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
        }),
      });

      const json = await data.json();

      console.log("data = ", json);

      if (json.error) {
        setErrors((prev) => {
          return { ...prev, ["general"]: json.error };
        });
        return;
      }

      // reset form or redirect
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        acceptTos: false,
      });

      toast("Signed up", {
        description: "You can now sign in",
        action: {
          label: "Okay",
          onClick: () => console.log("Undo"),
        },
        duration: 3000,
        style: {
          background: "#0d1117",
          color: "#ffffff",
          border: "1px solid #ffffff",
          borderRadius: "0.5rem",
          padding: "0.5rem",
          margin: "0.5rem",
        },
      });
      setErrors({});
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/auth/signin");
    } catch (err) {
      // map server errors to fields if possible
      setErrors({ general: "Something went wrong. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-transparent">
      <h1 className="text-2xl font-sans text-white text-center mb-5 font-bold flex justify-center items-center gap-2">
        Create account
        <BadgePlus className="hover:text-purple-400 transition-colors duration-300" />
      </h1>

      <h2 className="text-sm text-white/90 text-center mb-3">
        Enter your details to create an account
      </h2>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-4"
      >
        {/* Name */}
        <div className="h-full w-full relative flex flex-col items-center gap-2">
          <div
            className={`text-white/70 absolute ${
              form.name.length > 0
                ? "-top-2 md:-top-2 left-6 md:left-8 text-xs"
                : "top-2 left-6 md:left-8 text-base md:-z-10 text-white select-none"
            }  bg-black transition-all duration-200 linear`}
          >
            Full name
          </div>
          <div
            className={`w-[90%] flex rounded-md flex-col items-center ${
              errors.name ? "error" : ""
            }`}
          >
            <input
              ref={nameRef}
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-1 text-white border border-white rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="h-full w-full relative flex flex-col items-center gap-2">
          <div
            className={`text-white/70 absolute ${
              form.email.length > 0
                ? "-top-2 md:-top-2 left-6 md:left-8 text-xs"
                : "top-2 left-6 md:left-8 text-base md:-z-10 text-white select-none"
            }  bg-black transition-all duration-200 linear`}
          >
            Email
          </div>
          <div
            className={`w-[90%] flex rounded-md flex-col items-center ${
              errors.email ? "error" : ""
            }`}
          >
            <input
              ref={emailRef}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-1 text-white border border-white rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="h-full w-full relative flex flex-col items-center gap-2">
          <div
            className={`text-white/70 absolute ${
              form.password.length > 0
                ? "-top-2 md:-top-2 left-6 md:left-8 text-xs"
                : "top-2 left-6 md:left-8 text-base md:-z-10 text-white select-none"
            }  bg-black transition-all duration-200 linear`}
          >
            Password
          </div>
          <div
            className={`w-[90%] flex rounded-md flex-col items-center ${
              errors.password ? "error" : ""
            }`}
          >
            <input
              ref={passwordRef}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-1 text-white border border-white rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="h-full w-full relative flex flex-col items-center gap-2">
          <div
            className={`text-white/70 absolute ${
              form.confirmPassword.length > 0
                ? "-top-2 md:-top-2 left-6 md:left-8 text-xs"
                : "top-2 left-6 md:left-8 text-base md:-z-10 text-white select-none"
            }  bg-black transition-all duration-200 linear`}
          >
            Confirm password
          </div>
          <div
            className={`w-[90%] flex rounded-md flex-col items-center ${
              errors.confirmPassword ? "error" : ""
            }`}
          >
            <input
              ref={confirmRef}
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-1 text-white border border-white rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Phone (optional) */}
        <div className="h-full w-full relative flex flex-col items-center gap-2">
          <div
            className={`text-white/70 absolute ${
              form.phone.length > 0
                ? "-top-2 md:-top-2 left-6 md:left-8 text-xs"
                : "top-2 left-6 md:left-8 text-base md:-z-10 text-white select-none"
            }  bg-black transition-all duration-200 linear`}
          >
            Phone (optional)
          </div>
          <div
            className={`w-[90%] flex rounded-md flex-col items-center ${
              errors.phone ? "error" : ""
            }`}
          >
            <input
              ref={phoneRef}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-1 text-white border border-white rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* General server error */}
        {errors.general && (
          <p className="text-sm text-red-500">{errors.general}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-purple-800 text-base font-medium p-2 rounded text-white px-5 active:scale-95 transition-colors duration-100 z-10 flex justify-center items-center gap-2 ${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-purple-500 hover:text-black"
          }`}
        >
          {isSubmitting && <Spinner />}
          {isSubmitting && "Creating account..."}
          {!isSubmitting && "Create account"}
        </button>
        <p className="text-sm text-white/70 text-center z-1">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => {
              router.push("/auth/signin");
            }}
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
