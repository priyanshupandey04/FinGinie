import React from "react";
import { Plus, BarChart3, TrendingUp, ShieldAlert } from "lucide-react";

const EmptyPortfolio = () => {
  return (
    <div className="min-h-screen w-full bg-[#09090b] flex flex-col justify-center items-center relative overflow-hidden selection:bg-emerald-500/30">
      
      {/* Background Grid (Financial Graph Paper effect) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px]"></div>

      <div className="relative z-10 flex flex-col items-center max-w-lg text-center px-6">
        
        {/* Animated Icon Container */}
        <div className="relative mb-8 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-24 h-24 bg-[#18181b] border border-zinc-800 rounded-full flex items-center justify-center shadow-2xl">
                <BarChart3 className="w-10 h-10 text-zinc-500 group-hover:text-emerald-400 transition-colors duration-300" />
                
                {/* Floating Badge */}
                <div className="absolute -right-2 -top-2 bg-zinc-900 border border-zinc-700 rounded-full p-2 animate-bounce">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                </div>
            </div>
        </div>

        {/* Main Headline */}
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          No Strategy Found
        </h2>
        
        {/* Subtext - Connecting to your Problem Statement */}
        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
          Your dashboard is currently empty. <br/>
          Our algorithms cannot optimize your wealth without your <span className="text-emerald-400 font-medium">Risk Profile</span> and <span className="text-emerald-400 font-medium">Financial Goals</span>.
        </p>

        {/* Call to Action */}
        <a 
          href="/createPlan" // Link to your form page
          className="group relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-emerald-500 to-blue-600 group-hover:from-emerald-500 group-hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-emerald-800"
        >
          <span className="relative px-8 py-4 transition-all ease-in duration-75 bg-[#09090b] rounded-md group-hover:bg-opacity-0 text-white font-bold text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500 group-hover:text-white transition-colors" />
            Initialize Financial Plan
          </span>
        </a>

        {/* Micro-copy for Trust */}
        <p className="mt-6 text-xs text-zinc-600 font-mono uppercase tracking-widest">
          AI-Driven • Personalized • Secure
        </p>

      </div>
    </div>
  );
};

export default EmptyPortfolio;