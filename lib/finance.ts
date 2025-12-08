// src/lib/finance.ts

import { PlanVersion } from "@prisma/client";

// --- CONSTANTS ---
export const ASSET_RATES = {
  EQUITY: 12, // 10-12% average
  DEBT: 7,    // 6-7% average
  GOLD: 5,    // 4-5% average
};

// --- HELPER 1: Risk Allocator ---
export const getRiskAllocation = (score: number) => {
  if (score <= 3) return { equity: 0.30, debt: 0.60, gold: 0.10 }; // Conservative
  if (score <= 7) return { equity: 0.50, debt: 0.40, gold: 0.10 }; // Balanced
  if (score >= 8) return { equity: 0.70, debt: 0.25, gold: 0.05 }; // Aggressive
  return { equity: 0.50, debt: 0.40, gold: 0.10 }; // Fallback
};

// --- HELPER 2: Date Diff in Months ---
export const getMonthsDifference = (d1: string | Date, d2: string | Date) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
};

// --- FORMULA A: SIP Future Value ---
// FV = P * [ (1+i)^n - 1 ] / i * (1+i)
const calculateSIP_FV = (monthly: number, rate: number, months: number) => {
  if (months <= 0) return 0;
  const i = rate / 12 / 100; 
  return monthly * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
};

// --- FORMULA B: Lump Sum Growth ---
// FV = P * (1+i)^n
const calculateLumpSum_FV = (principal: number, rate: number, months: number) => {
  if (months <= 0 || principal <= 0) return principal;
  const i = rate / 12 / 100;
  return principal * Math.pow(1 + i, months);
};

// --- 🌟 THE MAIN CALCULATOR (The "Chain" Logic) ---
export const calculatePlanTrajectory = (versions: PlanVersion[]) => {
  // 1. Sort versions by date to ensure we process V1 -> V2 -> V3
  const sortedVersions = [...versions].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Trackers for current "Corpus" (The accumulated money so far)
  let corpus = { equity: 0, debt: 0, gold: 0 };
  let totalInvested = 0;

  // 2. Iterate through each version (The "Story")
  sortedVersions.forEach((ver) => {
    // A. How long did this version run?
    const months = getMonthsDifference(ver.startDate, ver.endDate);
    if (months <= 0) return;

    // B. Get Asset Split (e.g., 50% / 40% / 10%)
    const allocation = getRiskAllocation(ver.riskScore);
    
    // C. Calculate Monthly Amounts for this version
    const pmts = {
      equity: ver.monthlyInvestment * allocation.equity,
      debt: ver.monthlyInvestment * allocation.debt,
      gold: ver.monthlyInvestment * allocation.gold,
    };

    totalInvested += ver.monthlyInvestment * months;

    // --- STEP 1: GROW EXISTING CORPUS (Lump Sum) ---
    // The money from previous versions grows for these 'n' months
    corpus.equity = calculateLumpSum_FV(corpus.equity, ASSET_RATES.EQUITY, months);
    corpus.debt   = calculateLumpSum_FV(corpus.debt, ASSET_RATES.DEBT, months);
    corpus.gold   = calculateLumpSum_FV(corpus.gold, ASSET_RATES.GOLD, months);

    // --- STEP 2: ADD NEW SIP GROWTH (Annuity) ---
    // The new contributions made during this version
    corpus.equity += calculateSIP_FV(pmts.equity, ASSET_RATES.EQUITY, months);
    corpus.debt   += calculateSIP_FV(pmts.debt, ASSET_RATES.DEBT, months);
    corpus.gold   += calculateSIP_FV(pmts.gold, ASSET_RATES.GOLD, months);
  });

  // 3. Final Totals
  const grandTotal = corpus.equity + corpus.debt + corpus.gold;
  
  return {
    breakdown: corpus, // { equity: 100k, debt: 50k... }
    totalValue: Math.round(grandTotal),
    totalInvested: Math.round(totalInvested),
    gain: Math.round(grandTotal - totalInvested)
  };
};