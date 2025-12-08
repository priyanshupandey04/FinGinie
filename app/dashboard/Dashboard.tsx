"use client";

import NoPlans from "@/components/NoPlans";
import React, { useEffect, useState } from "react";
import { calculatePlanTrajectory, getRiskAllocation } from "@/lib/finance";
import { TrendingUp, PieChart, DollarSign, Activity } from "lucide-react";
import { Plan } from "@/src/generated";
import { PlanWithVersions } from "@/lib/types";

type Props = {
  id: number;
};

// Define stats type for TS
type PlanStats = {
  breakdown: { equity: number; debt: number; gold: number };
  totalValue: number;
  totalInvested: number;
  gain: number;
};

const Dashboard = (props: Props) => {
  const { id } = props;

  const [plans, setPlans] = useState<PlanWithVersions[]>([]);
  const [stats, setStats] = useState<PlanStats | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllPlans = async () => {
      try {
        const response = await fetch(`/api/getAllPlans?id=${id}`);
        const data = await response.json();

        if (data.plans && data.plans.length > 0) {
          setPlans(data.plans);
          
          // ⚡ CALCULATE PREDICTION FOR THE FIRST PLAN ⚡
          // (You can expand this later to select different plans)
          const primaryPlan = data.plans[0];
          if (primaryPlan.versions && primaryPlan.versions.length > 0) {
            const calculated = calculatePlanTrajectory(primaryPlan.versions);
            setStats(calculated);
          }
        } else {
          setPlans([]);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchAllPlans();
  }, [id]);

  if (isFetching) return <div className="text-white p-10 animate-pulse">Loading Financial Data...</div>;

  if (plans.length === 0) {
    return (
      <div>
        <NoPlans />
      </div>
    );
  }

  // Get the latest version to show current monthly split
  const activePlan = plans[0];
  const latestVersion = activePlan.versions[activePlan.versions.length - 1];
  const allocation = getRiskAllocation(latestVersion.riskScore);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6 md:p-10">
      
      {/* --- HEADER --- */}
      <div className="mb-8 flex justify-between items-end border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400 mb-1">
            {activePlan.label || "Investment Plan"}
          </h1>
          <p className="text-gray-400 text-sm">
             Ends on: {new Date(activePlan.endDate).toDateString()} 
             <span className="mx-2">•</span> 
             Duration: {new Date(activePlan.endDate).getFullYear() - new Date(activePlan.startDate).getFullYear()} Years
          </p>
        </div>
        <div className="text-right hidden md:block">
           <div className="text-sm text-gray-500 uppercase tracking-wider font-bold">Risk Profile</div>
           <div className="text-xl font-mono text-emerald-500">({latestVersion.riskScore}/10)</div>
        </div>
      </div>

      {/* --- BIG NUMBERS (PREDICTION) --- */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* 1. Total Wealth */}
          <div className="bg-[#161b22] border border-gray-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={100} className="text-emerald-500" />
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} /> Projected Corpus
            </h3>
            <div className="text-4xl font-bold text-white mt-3 font-mono">
              ₹{(stats.totalValue / 100000).toFixed(2)} Lakh
            </div>
            <p className="text-emerald-400 text-sm mt-2 font-mono flex items-center gap-1">
              +₹{(stats.gain / 100000).toFixed(2)} L Returns
            </p>
          </div>

          {/* 2. Total Invested */}
          <div className="bg-[#161b22] border border-gray-800 p-6 rounded-2xl shadow-xl">
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <DollarSign size={16} /> Total Invested
            </h3>
            <div className="text-4xl font-bold text-gray-300 mt-3 font-mono">
              ₹{(stats.totalInvested / 100000).toFixed(2)} Lakh
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Principal Amount
            </p>
          </div>

           {/* 3. Wealth Split (Final) */}
           <div className="bg-[#161b22] border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-center">
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <PieChart size={16} /> Final Asset Split
             </h3>
             <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-400">Equity Fund</span>
                  <span className="font-mono">₹{(stats.breakdown.equity / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-400">Debt Fund</span>
                  <span className="font-mono">₹{(stats.breakdown.debt / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-400">Digital Gold</span>
                  <span className="font-mono">₹{(stats.breakdown.gold / 100000).toFixed(2)} L</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- CURRENT MONTHLY SPLIT --- */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left: How your money is divided monthly */}
        <div className="bg-[#161b22] border border-gray-800 p-8 rounded-2xl">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <Activity className="text-emerald-500" /> 
             Monthly Investment Split
           </h3>
           <div className="flex items-center gap-4 mb-8">
              <div className="text-3xl font-bold">₹{latestVersion.monthlyInvestment}</div>
              <div className="text-gray-500 text-sm">/ month</div>
           </div>

           {/* Visualization Bar */}
           <div className="h-4 w-full flex rounded-full overflow-hidden mb-6">
              <div style={{ width: `${allocation.equity * 100}%` }} className="bg-blue-500 h-full"></div>
              <div style={{ width: `${allocation.debt * 100}%` }} className="bg-purple-500 h-full"></div>
              <div style={{ width: `${allocation.gold * 100}%` }} className="bg-yellow-500 h-full"></div>
           </div>

           <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="text-xs text-blue-400 uppercase font-bold">Equity</div>
                <div className="text-lg font-bold mt-1">{allocation.equity * 100}%</div>
                <div className="text-xs text-gray-400 mt-1">₹{latestVersion.monthlyInvestment * allocation.equity}</div>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <div className="text-xs text-purple-400 uppercase font-bold">Debt</div>
                <div className="text-lg font-bold mt-1">{allocation.debt * 100}%</div>
                <div className="text-xs text-gray-400 mt-1">₹{latestVersion.monthlyInvestment * allocation.debt}</div>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <div className="text-xs text-yellow-400 uppercase font-bold">Gold</div>
                <div className="text-lg font-bold mt-1">{allocation.gold * 100}%</div>
                 <div className="text-xs text-gray-400 mt-1">₹{latestVersion.monthlyInvestment * allocation.gold}</div>
              </div>
           </div>
        </div>

        {/* Right: Plan History / Timeline */}
        <div className="bg-[#161b22] border border-gray-800 p-8 rounded-2xl">
           <h3 className="text-xl font-bold mb-6">Plan History</h3>
           <div className="space-y-4">
             {activePlan.versions.map((version, idx) => (
               <div key={version.id} className="relative pl-6 border-l-2 border-gray-700 pb-2">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#161b22]"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">Version {idx + 1}</h4>
                      <p className="text-xs text-gray-400">
                        {new Date(version.startDate).toLocaleDateString()} - {new Date(version.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                       <div className="font-mono text-emerald-400">₹{version.monthlyInvestment}</div>
                       <div className="text-[10px] text-gray-500 uppercase">Risk: {version.riskScore}</div>
                    </div>
                  </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;