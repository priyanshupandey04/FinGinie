"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  TrendingUp,
  Shield,
  PieChart,
  Activity,
  ArrowRight,
  CheckCircle2,
  Lock,
  Smartphone,
  Globe,
  Users,
  Send,
  MessageSquare,
  Cpu,
  Zap,
  Server,
  Star,
  Quote,
} from "lucide-react";
import { motion, useScroll, useSpring, Variants } from "framer-motion";
import DotGrid from "@/components/DotGrid";
import SplitText from "@/components/SplitText";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

// --- Types & Interfaces ---
interface StepData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface TestimonialData {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

// --- Animation Variants ---
// Typed using Variants; removed `ease: "easeOut"` (-> keep only duration)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.69 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

// --- Main Page Component ---
export default function LandingClient(props: { session: Session | null }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver to detect current section and set activeSection
  useEffect(() => {
    const ids = ["hero", "how", "features", "reviews", "feedback"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveSection(
            visible.target.getAttribute("data-section") || "hero"
          );
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0.15, 0.4, 0.6],
      }
    );

    ids.forEach((id) => {
      const el = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
      `}</style>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 origin-left z-[60]"
        style={{
          scaleX,
          background: "linear-gradient(50deg,#10b981 0%, #06b6d4 100%)",
        }}
      />

      {/* --- NAVBAR --- */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0d1117]/90 backdrop-blur-md border-b border-gray-800 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <TrendingUp className="text-emerald-400 w-5 h-5 relative z-10" />
            </div>
            <span className="text-xl font-bold  text-gray-100">
              FinGinie<span className="text-emerald-500">.AI</span>
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors hover:underline decoration-emerald-500 underline-offset-4"
            >
              Workflow
            </a>
            <a
              href="#features"
              className="hover:text-white transition-colors hover:underline decoration-blue-500 underline-offset-4"
            >
              Capabilities
            </a>
            <a
              href="#reviews"
              className="hover:text-white transition-colors hover:underline decoration-yellow-500 underline-offset-4"
            >
              Reviews
            </a>
            <a
              href="#feedback"
              className="hover:text-white transition-colors hover:underline decoration-purple-500 underline-offset-4"
            >
              Feedback
            </a>
          </div>
          <div className="flex gap-4">
            {!props.session && (
              <button
                className="hidden sm:block text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                onClick={() => router.push("/auth/signin")}
              >
                Sign In
              </button>
            )}
            {props.session && (
              <button
                className="px-5 py-2 text-sm font-bold bg-white text-black rounded-md hover:bg-gray-200 transition-colors border border-transparent hover:border-emerald-500/50"
                onClick={() => router.push("/dashboard")}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section
        data-section="hero"
        id="hero"
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-black/90 select-none"
      >
        <div className="absolute h-full w-full top-0 left-0">
          <DotGrid
            dotSize={5}
            gap={15}
            baseColor="#090618FF"
            activeColor="#5227FF"
            proximity={100}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-emerald-400 text-xs font-mono font-medium mb-8 backdrop-blur-sm"
            >
              <Zap className="w-3 h-3 fill-emerald-400" />
              <span>v2.0.4 PROD BUILD </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold  leading-none  text-white"
            >
              <SplitText
                text="Wealth Logic, "
                className="text-5xl md:text-7xl lg:text-8xl font-extrabold  leading-none  text-white"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
              <br />
              <div className="gradient-text">
                <SplitText
                  text="Decoded & Optimized. "
                  className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 text-white"
                  delay={100}
                  duration={0.6}
                  splitType="chars"
                  textAlign="center"
                />
              </div>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
            >
              Replace noisy advice with a deterministic algorithm. Enter your{" "}
              <code className="bg-gray-800 px-1 py-0.5 rounded text-emerald-300 text-sm">
                Monthly Investment
              </code>{" "}
              and{" "}
              <code className="bg-gray-800 px-1 py-0.5 rounded text-emerald-300 text-sm">
                Risk Score
              </code>{" "}
              — get a clear allocation and projected growth.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button className="group px-8 py-4 text-lg font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-[0_0_30px_-10px_rgba(16,185,129,0.5)]">
                Initialize Plan{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 text-lg font-bold bg-[#21262d] border border-gray-700 text-white rounded-lg hover:border-gray-500 transition-all flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" /> View Live Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.4, duration: 1, type: "spring" }}
            className="mt-24 relative mx-auto max-w-5xl"
          >
            <div className="relative rounded-xl bg-[#161b22] border border-gray-700 p-2 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#0d1117] opacity-20 pointer-events-none z-20"></div>

              {/* Fake Browser Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#0d1117] rounded-t-lg">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="ml-4 px-3 py-1 bg-[#21262d] rounded-md text-xs text-gray-400 font-mono w-64 text-center">
                  finginie.ai/dashboard/overview
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
                alt="FinGinie Dashboard"
                className="rounded-b-lg w-full h-auto opacity-95 block"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- TICKER SECTION --- */}
      <div className="w-full bg-[#161b22] border-y border-gray-800 overflow-hidden py-3">
        <div className="flex marquee whitespace-nowrap gap-12 text-xs font-mono text-gray-400 uppercase tracking-widest px-6">
          <span className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-emerald-500" /> SYSTEM ONLINE
          </span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-2">
            <Server className="w-3 h-3 text-blue-500" /> Best Forecasting
          </span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-purple-500" /> AES-256 ENCRYPTED
          </span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-orange-500" /> ENGINE ACTIVE
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-emerald-400">NIFTY +1.24%</span>
          <span className="text-red-400">GOLD -0.12%</span>
          <span className="text-emerald-400">NASDAQ +0.8%</span>
          <span className="text-red-400">GOOG -0.12%</span>
        </div>
      </div>

      {/* --- PROBLEM STATEMENT --- */}
      <section className="py-24 bg-[#0d1117] border-b border-gray-800 ">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              The Retail Investor's Dilemma
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              70% of retail investors lose capital not because of market
              volatility, but due to{" "}
              <span className="text-white font-semibold underline decoration-red-500 underline-offset-4">
                emotional decision-making
              </span>{" "}
              and poor asset allocation.
            </p>
            <div className="space-y-6">
              {[
                {
                  title: "Panic Selling",
                  desc: "Exiting positions during temporary market corrections.",
                },
                {
                  title: "Inflation Erosion",
                  desc: "Keeping money in savings accounts that yield 3% while inflation is 6%.",
                },
                {
                  title: "Complexity Paralysis",
                  desc: "Overwhelmed by too many financial instruments.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-transparent blur-2xl rounded-full opacity-50"></div>
            <div className="relative bg-[#161b22] border border-gray-700 rounded-2xl p-8 overflow-hidden">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-gray-400 text-sm font-mono mb-1">
                    YOUR PORTFOLIO WITHOUT FINGINIE
                  </div>
                  <div className="text-3xl font-bold text-red-400">-12.4%</div>
                </div>
                <Activity className="w-10 h-10 text-red-500/20" />
              </div>
              <div className="flex items-end gap-1 h-32 opacity-80">
                {[40, 60, 55, 70, 45, 30, 20, 35, 15, 10].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 bg-red-900/40 rounded-t-sm relative group"
                  >
                    <div
                      className="absolute bottom-0 left-0 w-full bg-red-500/20 transition-all duration-500 group-hover:bg-red-500"
                      style={{ height: "100%" }}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500 font-mono text-center">
                DATA: AVERAGE RETAIL PERFORMANCE (DEMO)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- WORKFLOW --- */}
      <section
        id="how-it-works"
        data-section="how"
        className="py-32 relative overflow-hidden bg-[#0d1117]"
      >
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold mb-4">
              From Confusion to Clarity
            </h2>
            <p className="text-gray-400">
              Our deterministic engine processes your data through a 4-stage
              pipeline — clear steps you can explain in viva.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent md:-translate-x-1/2"></div>

            <div className="space-y-24">
              {steps.map((step, index) => (
                <WorkflowStep key={step.id} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section
        id="features"
        data-section="features"
        className="py-24 bg-[#161b22] border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Technical Capabilities</h2>
            <p className="text-gray-400 max-w-2xl">
              Built with a modern technology to ensure reliability and speed.
              This keeps your demo production-like and evaluable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={PieChart}
              title="Smart Rebalancing"
              desc="Algorithm suggests shifts from Equity to Debt as you approach maturity to protect capital."
            />
            <FeatureCard
              icon={Lock}
              title="Bank-Grade Security"
              desc="Inputs and outputs are encrypted transport."
            />
            <FeatureCard
              icon={Smartphone}
              title="Responsive UI"
              desc="PWA-ready design for any device."
            />
            <FeatureCard
              icon={Cpu}
              title=" Forecasting"
              desc="AI-ML forecasting can be added later."
            />
            <FeatureCard
              icon={Globe}
              title="Global Indices"
              desc="Supports index tracking to contextualize projections."
            />
            <FeatureCard
              icon={Zap}
              title="Instant PDF Reports"
              desc="Generate a downloadable plan for presentation or evaluation."
            />
          </div>
        </div>
      </section>

      {/* --- REVIEW SECTION --- */}
      <section
        id="reviews"
        data-section="reviews"
        className="pt-10 bg-[#0d1117] border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-400">
              Trusted by students and early investors.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} data={t} />
            ))}
          </div>
        </div>
      </section>

      {/* --- FEEDBACK SECTION --- */}
      <section
        id="feedback"
        data-section="feedback"
        className="py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] to-black" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  System Feedback
                </h3>
                <p className="text-sm text-gray-400">
                  Help us improve the algorithm. Report bugs or suggest
                  features.
                </p>
              </div>
            </div>

            <FeedbackForm />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] border-t border-gray-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
                  <TrendingUp className="text-white w-3 h-3" />
                </div>
                <span className="text-xl font-bold">FinGinie.AI</span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs mb-6">
                A Final Year Project designed to solve financial illiteracy
                through deterministic algorithms and aesthetic UI.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={Users} />
                <SocialIcon icon={Zap} />
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-emerald-400 cursor-pointer">
                  Documentation
                </li>
                <li className="hover:text-emerald-400 cursor-pointer">
                  API Reference
                </li>
                <li className="hover:text-emerald-400 cursor-pointer">
                  System Status
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-emerald-400 cursor-pointer">
                  Privacy Policy
                </li>
                <li className="hover:text-emerald-400 cursor-pointer">
                  Terms of Service
                </li>
                <li className="hover:text-emerald-400 cursor-pointer">
                  Project License
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs">
              © 2024 FinGinie AI. Built by Team 26 (CS_AIML-4B). All rights
              reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
              Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS --- //

const WorkflowStep: React.FC<{ step: StepData; index: number }> = ({
  step,
  index,
}) => {
  const isEven = index % 2 === 0;
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col md:gap-24 gap-8`}
    >
      <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full bg-[#0d1117] border-4 border-gray-700 md:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(0,0,0,1)] group">
        <div
          className={`absolute inset-0 rounded-full ${step.color} opacity-20 group-hover:opacity-80 transition-opacity blur-sm`}
        />
      </div>

      <div
        className={`w-full md:w-1/2 pl-16 md:pl-0 ${
          isEven ? "md:text-right md:pr-12" : "md:text-left md:pl-12"
        }`}
      >
        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gray-800/50 border border-gray-700 mb-4 backdrop-blur-sm">
          <Icon
            className={`w-6 h-6 ${step.color
              .replace("bg-", "text-")
              .replace("/50", "")}`}
          />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-white">{step.title}</h3>
        <p className="text-xl text-emerald-400 mb-3 font-medium">
          {step.subtitle}
        </p>
        <p className="text-gray-400 leading-relaxed">{step.description}</p>
      </div>

      <div className="w-full md:w-1/2 hidden md:block" />
    </motion.div>
  );
};

// Feature Card
const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  desc: string;
}> = ({ icon: Icon, title, desc }) => (
  <div className="p-6 rounded-xl border border-gray-800 bg-[#0d1117] hover:bg-[#161b22] hover:border-gray-700 transition-all group">
    <Icon className="w-8 h-8 text-gray-500 group-hover:text-emerald-400 mb-4 transition-colors" />
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

// Testimonial Card
const TestimonialCard: React.FC<{ data: TestimonialData }> = ({ data }) => (
  <div className="bg-[#161b22] p-8 rounded-2xl border border-gray-800 relative">
    <Quote className="absolute top-6 right-6 w-8 h-8 text-gray-700/50" />
    <div className="flex items-center gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      ))}
    </div>
    <p className="text-gray-300 mb-6 leading-relaxed">"{data.quote}"</p>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
        <img
          src={data.avatar}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h4 className="font-bold text-white text-sm">{data.name}</h4>
        <p className="text-gray-500 text-xs">{data.role}</p>
      </div>
    </div>
  </div>
);

// Feedback Form
const FeedbackForm: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2500);
    }, 1300);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            Your Name
          </label>
          <input
            required
            type="text"
            className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">
            Email Address
          </label>
          <input
            required
            type="email"
            className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="john@example.com"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase">
          Message / Bug Report
        </label>
        <textarea
          required
          rows={4}
          className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          placeholder="I found a glitch in the allocation logic..."
        />
      </div>
      <button
        disabled={status !== "idle"}
        type="submit"
        className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "idle" && (
          <>
            <Send className="w-4 h-4" /> Send Feedback
          </>
        )}
        {status === "sending" && (
          <span className="animate-pulse">Processing...</span>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="w-4 h-4" /> Sent Successfully
          </>
        )}
      </button>
    </form>
  );
};

const SocialIcon: React.FC<{ icon: React.ElementType }> = ({ icon: Icon }) => (
  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all cursor-pointer text-gray-400">
    <Icon className="w-4 h-4" />
  </div>
);

// --- DATA ---
const steps: StepData[] = [
  {
    id: 1,
    title: "1. Profile Intake",
    subtitle: "Understanding Capacity",
    description:
      "We collect four simple inputs (age, monthly invest, duration, risk) — this snapshot helps us compute what you can comfortably invest and when you need results.",
    icon: Users,
    color: "bg-blue-500/50",
  },
  {
    id: 2,
    title: "2. Risk Assessment",
    subtitle: "Psychometric Scoring",
    description:
      "Three quick questions determine how you react to market swings — the output is a Risk Score (1-10) that determines comfort with volatility.",
    icon: Activity,
    color: "bg-purple-500/50",
  },
  {
    id: 3,
    title: "3. Strategic Allocation",
    subtitle: "Asset Division",
    description:
      "We apply the project’s rule-table to split your monthly contribution across Equity, Debt and Gold — transparent, repeatable, and explainable.",
    icon: PieChart,
    color: "bg-emerald-500/50",
  },
  {
    id: 4,
    title: "4. Wealth Projection",
    subtitle: "Future Value Calculation",
    description:
      "We estimate future corpus with conservative growth assumptions and present an illustrated year-by-year growth curve you can export and present.",
    icon: TrendingUp,
    color: "bg-orange-500/50",
  },
];

const testimonials: TestimonialData[] = [
  {
    id: 1,
    name: "Aarav Patel",
    role: "CS Student, 4th Year",
    quote:
      "I never understood where to put my stipend. FinGinie gave me a clear 50-30-20 split that actually makes sense.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sneha Reddy",
    role: "Junior Developer",
    quote:
      "The visual breakdown helped me convince my parents to start an SIP. The math is solid and the UI is beautiful.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Rohan Gupta",
    role: "Freelancer",
    quote:
      "Finally, a tool that doesn't confuse you with jargon. It just tells you the optimal allocation and lets you act.",
    avatar: "https://randomuser.me/api/portraits/men/86.jpg",
  },
];
