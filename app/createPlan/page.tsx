"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Banknote,
  Calendar,
  Activity,
  User,
  Globe,
  FileText,
  Sparkles,
  ChevronRight,
  BrainCircuit,
  Lock,
  CheckCircle2,
  Sun,
  Moon,
  AlertCircle,
} from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";

// --- Zod Schema Validation ---
const formSchema = z.object({
  annualIncome: z.coerce
    .number()
    .refine((n) => !Number.isNaN(n), { message: "Required" })
    .min(0, "Income cannot be negative"),
  age: z.coerce
    .number()
    .refine((n) => !Number.isNaN(n), { message: "Required" })
    .min(18, "Must be at least 18")
    .max(100, "Max age is 100"),
  monthlyInvestment: z.coerce
    .number()
    .refine((n) => !Number.isNaN(n), { message: "Required" })
    .min(500, "Min investment is 500")
    .max(100000, "Max investment is 1,00,000"),
  period: z.coerce
    .number()
    .refine((n) => !Number.isNaN(n), { message: "Required" })
    .min(1, "Min 1 year")
    .max(50, "Max 50 years"),
  // We don't strictly validate description length, but ensure it exists
  goalDescription: z.string().min(3, "Please describe your goal"),
  // These are handled by selects/sliders, so they are safe, but good to include
  country: z.string(),
  currency: z.string(),
  riskScore: z.number(),
});

// --- Types & Theme Config ---

type ThemeMode = "light" | "dark";

interface ThemeStyles {
  pageBg: string;
  cardBg: string;
  textMain: string;
  textMuted: string;
  border: string;
  inputBg: string;
  inputBorder: string;
  accentText: string;
  accentBg: string;
  highlightBg: string;
  shadow: string;
  overlayBg: string;
}

const THEMES: Record<ThemeMode, ThemeStyles> = {
  dark: {
    pageBg: "bg-[#0d1117]",
    cardBg: "bg-[#161b22]",
    textMain: "text-white",
    textMuted: "text-gray-400",
    border: "border-gray-800",
    inputBg: "bg-[#0d1117]",
    inputBorder: "border-gray-700",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-600 hover:bg-emerald-500",
    highlightBg: "bg-emerald-500/10",
    shadow: "shadow-2xl shadow-emerald-900/20",
    overlayBg: "bg-[#0d1117]/95",
  },
  light: {
    pageBg: "bg-slate-50",
    cardBg: "bg-white",
    textMain: "text-slate-900",
    textMuted: "text-slate-500",
    border: "border-slate-200",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-300",
    accentText: "text-emerald-600",
    accentBg: "bg-emerald-600 hover:bg-emerald-700",
    highlightBg: "bg-emerald-100",
    shadow: "shadow-xl shadow-slate-200",
    overlayBg: "bg-white/95",
  },
};

interface CountryOption {
  code: string;
  currency: string;
  flag: string;
  name: string;
}

const COUNTRIES: CountryOption[] = [
  { code: "IN", currency: "₹", flag: "🇮🇳", name: "India" },
  { code: "US", currency: "$", flag: "🇺🇸", name: "USA" },
  { code: "UK", currency: "£", flag: "🇬🇧", name: "UK" },
  { code: "EU", currency: "€", flag: "🇪🇺", name: "Europe" },
  { code: "JP", currency: "¥", flag: "🇯🇵", name: "Japan" },
];

// --- Sub-Components ---

const AnimatedNumber = ({ value }: { value: number }) => {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  return <motion.span>{display}</motion.span>;
};

const ErrorMessage = ({ message }: { message?: string }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex items-center gap-1 text-red-500 text-xs font-semibold ml-auto"
        >
          <AlertCircle className="w-3 h-3" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AILoader = ({
  onComplete,
  theme,
}: {
  onComplete: () => void;
  theme: ThemeMode;
}) => {
  const [step, setStep] = useState(0);
  const styles = THEMES[theme];
  const steps = [
    "Encrypting Financial Data...",
    "Analyzing Risk Profile...",
    "Fetching Global Market Indices...",
    "Running Monte Carlo Simulations...",
    "Optimizing Asset Allocation...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev == steps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 ${styles.overlayBg} backdrop-blur-xl flex flex-col items-center justify-center p-6 transition-colors duration-500`}
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 rounded-full animate-pulse" />
        <BrainCircuit
          className={`w-24 h-24 ${styles.accentText} relative z-10 animate-pulse`}
        />
      </div>
      <h2 className={`text-2xl font-bold ${styles.textMain} mb-2 text-center`}>
        FinGinie AI Engine
      </h2>
      <div className="h-8 mb-4 overflow-hidden flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`${styles.accentText} font-mono text-sm md:text-base`}
          >
            {steps[step]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="w-64 h-1 bg-gray-500/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4.5, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function CreatePlanPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const styles = THEMES[theme];

  const [formData, setFormData] = useState({
    annualIncome: "",
    age: "",
    country: "IN",
    currency: "₹",
    monthlyInvestment: "",
    period: "",
    riskScore: 5,
    goalDescription: "",
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = COUNTRIES.find((c) => c.code === e.target.value);
    if (selected) {
      setFormData({
        ...formData,
        country: selected.code,
        currency: selected.currency,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using Zod
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      // Map Zod errors to our state object
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        // Path is array, we want the first element as key
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return; // Stop submission
    }

    // If valid, proceed

    try {
      const createPlan = async () => {
        const res = await fetch("/api/createNewPlan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (data.success) {
          router.push("/dashboard");
        }

        console.log("data = ", data);
      };

      createPlan();
    } catch (e: unknown) {
      console.log("e = ", e);
    }

    setErrors({});
    setIsLoading(true);
  };

  return (
    <div
      className={`min-h-screen ${styles.pageBg} ${styles.textMain} font-sans selection:bg-emerald-500/30 flex items-center justify-center p-4 md:p-8 transition-colors duration-500 relative`}
    >
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-40">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full border ${styles.border} ${styles.cardBg} ${styles.textMuted} hover:${styles.textMain} transition-all shadow-lg`}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-20 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <AnimatePresence>
        {isLoading && (
          <AILoader
            theme={theme}
            onComplete={() => {
              setIsLoading(false);
              alert("Plan Generated! (Check Console for Data)");
              console.log(formData);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-4xl ${styles.cardBg} border ${styles.border} rounded-2xl ${styles.shadow} overflow-hidden relative z-10 transition-colors duration-500`}
      >
        {/* Header */}
        <div
          className={`p-8 border-b ${styles.border} ${
            theme === "dark" ? "bg-[#0d1117]/50" : "bg-slate-50/50"
          } backdrop-blur-md transition-colors duration-500`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${styles.highlightBg}`}>
              <Sparkles className={`w-5 h-5 ${styles.accentText}`} />
            </div>
            <h1 className="text-2xl font-bold">Initialize Investment Plan</h1>
          </div>
          <p className={`${styles.textMuted} text-sm`}>
            Fill in the details below. Our deterministic AI model will compute
            your optimal asset allocation.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Section 1: Financial Basics */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Annual Income */}
            <div className="space-y-3 group">
              <div className="flex justify-between items-center">
                <label
                  className={`text-xs font-bold ${styles.textMuted} uppercase tracking-wider flex items-center gap-2 group-focus-within:${styles.accentText} transition-colors`}
                >
                  <Banknote className="w-4 h-4" /> Annual Income
                </label>
                <ErrorMessage message={errors.annualIncome} />
              </div>
              <div className="relative">
                <span
                  className={`absolute left-4 top-3.5 ${styles.textMuted} font-mono`}
                >
                  {formData.currency}
                </span>
                <input
                  type="number"
                  name="annualIncome"
                  placeholder="e.g. 1200000"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  className={`w-full ${styles.inputBg} border ${
                    errors.annualIncome ? "border-red-500" : styles.inputBorder
                  } rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono placeholder:opacity-50`}
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-3 group">
              <div className="flex justify-between items-center">
                <label
                  className={`text-xs font-bold ${styles.textMuted} uppercase tracking-wider flex items-center gap-2 group-focus-within:${styles.accentText} transition-colors`}
                >
                  <User className="w-4 h-4" /> Current Age
                </label>
                <ErrorMessage message={errors.age} />
              </div>
              <input
                type="number"
                name="age"
                placeholder="e.g. 24"
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full ${styles.inputBg} border ${
                  errors.age ? "border-red-500" : styles.inputBorder
                } rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono placeholder:opacity-50`}
              />
            </div>

            {/* Monthly Investment + Country Select */}
            <div className="space-y-3 group md:col-span-2">
              <div className="flex justify-between items-center">
                <label
                  className={`text-xs font-bold ${styles.textMuted} uppercase tracking-wider flex items-center gap-2 group-focus-within:${styles.accentText} transition-colors`}
                >
                  <Globe className="w-4 h-4" /> Monthly SIP Amount
                </label>
                <ErrorMessage message={errors.monthlyInvestment} />
              </div>
              <div className="flex gap-0 relative">
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleCountryChange}
                    className={`h-full ${
                      theme === "dark" ? "bg-[#21262d]" : "bg-slate-100"
                    } border-y border-l ${
                      styles.inputBorder
                    } rounded-l-xl pl-3 pr-8 py-3.5 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer hover:opacity-80 transition-colors text-sm`}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[10px]">
                    ▼
                  </div>
                </div>
                <div className="relative flex-1">
                  <span
                    className={`absolute left-4 top-3.5 ${styles.textMuted} font-mono`}
                  >
                    {formData.currency}
                  </span>
                  <input
                    type="number"
                    name="monthlyInvestment"
                    placeholder="e.g. 5000"
                    value={formData.monthlyInvestment}
                    onChange={handleInputChange}
                    className={`w-full ${styles.inputBg} border ${
                      errors.monthlyInvestment
                        ? "border-red-500"
                        : styles.inputBorder
                    } rounded-r-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono placeholder:opacity-50`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`border-t ${styles.border} my-8 transition-colors duration-500`}
          />

          {/* Section 2: Strategy */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Time Period */}
            <div className="space-y-3 group">
              <div className="flex justify-between items-center">
                <label
                  className={`text-xs font-bold ${styles.textMuted} uppercase tracking-wider flex items-center gap-2 group-focus-within:${styles.accentText} transition-colors`}
                >
                  <Calendar className="w-4 h-4" /> Investment Period
                </label>
                <ErrorMessage message={errors.period} />
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="period"
                  placeholder="e.g. 10"
                  value={formData.period}
                  onChange={handleInputChange}
                  className={`w-full ${styles.inputBg} border ${
                    errors.period ? "border-red-500" : styles.inputBorder
                  } rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono placeholder:opacity-50`}
                />
                <span
                  className={`absolute right-4 top-3.5 ${styles.textMuted} text-sm`}
                >
                  Years
                </span>
              </div>
            </div>

            {/* Risk Score Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label
                  className={`text-xs font-bold ${styles.textMuted} uppercase tracking-wider flex items-center gap-2`}
                >
                  <Activity className="w-4 h-4" /> Risk Score
                </label>
                <div
                  className={`text-3xl font-bold ${styles.accentText} font-mono`}
                >
                  <AnimatedNumber value={formData.riskScore} />
                  <span className={`text-sm ${styles.textMuted} ml-1`}>
                    / 10
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={formData.riskScore}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      riskScore: parseInt(e.target.value),
                    })
                  }
                  className={`w-full h-2 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  } rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all`}
                />
                <div
                  className={`flex justify-between text-xs ${styles.textMuted} mt-2 font-mono uppercase`}
                >
                  <span>Low Risk </span>
                  <span>Balanced</span>
                  <span>High Risk </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 group">
            <div className="flex justify-between items-center">
              <label
                className={`text-xs font-bold ${styles.textMuted} uppercase tracking-wider flex items-center gap-2 group-focus-within:${styles.accentText} transition-colors`}
              >
                <FileText className="w-4 h-4" /> Goal Description
              </label>
              <ErrorMessage message={errors.goalDescription} />
            </div>
            <textarea
              name="goalDescription"
              rows={3}
              placeholder="I want to save for my daughter's higher education..."
              value={formData.goalDescription}
              onChange={handleInputChange}
              className={`w-full ${styles.inputBg} border ${
                errors.goalDescription ? "border-red-500" : styles.inputBorder
              } rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none placeholder:opacity-50`}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className={`w-full group ${styles.accentBg} text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2`}
            >
              <BrainCircuit className="w-5 h-5" />
              Generate Deterministic Plan
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div
              className={`flex items-center justify-center gap-2 mt-4 text-xs ${styles.textMuted}`}
            >
              <Lock className="w-3 h-3" />
              <span>End-to-end encrypted inputs</span>
              <span className="mx-2">•</span>
              <CheckCircle2
                className={`w-3 h-3 ${
                  theme === "dark" ? "text-emerald-500" : "text-emerald-600"
                }`}
              />
              <span>No AI Hallucinations</span>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
