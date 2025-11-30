import React from "react";

// LandingPage component (Next.js + Tailwind)
// How to use:
// - Save as `components/LandingPage.tsx` and import into `app/page.tsx` or a route.
// - Tailwind must be configured in your Next.js project.
// - This is a presentational component — wire auth/sign-up actions to the CTA buttons.

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-r from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold">IA</div>
          <div>
            <h1 className="text-lg font-semibold">InvestAI (Demo)</h1>
            <p className="text-xs text-gray-500">Personalized investment recommendations</p>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <a href="#features" className="text-sm hover:underline">Features</a>
          <a href="#how-it-works" className="text-sm hover:underline">How it works</a>
          <a href="#contact" className="text-sm hover:underline">Contact</a>
          <a href="/auth/signin" className="ml-4 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm shadow">Sign in</a>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">Smart, simple investment guidance — for everyone</h2>
          <p className="mt-4 text-gray-600">Create a profile, tell us your monthly budget and risk level. We’ll give you an easy-to-follow allocation across equity, debt and gold and show projected growth for your goal.</p>

          <div className="mt-6 flex gap-3">
            <a href="/auth/signup" className="px-5 py-3 rounded-md bg-emerald-500 text-white font-medium shadow">Get Started — It's Free</a>
            <a href="#how-it-works" className="px-5 py-3 rounded-md border border-gray-200 text-sm">How it works</a>
          </div>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-indigo-50 rounded-md flex items-center justify-center text-indigo-600 font-bold">1</div>
              <div>
                <p className="font-semibold">Simple Profile</p>
                <p className="text-sm text-gray-500">Answer 4 quick questions and get a personalized plan.</p>
              </div>
            </li>

            <li className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-emerald-50 rounded-md flex items-center justify-center text-emerald-600 font-bold">2</div>
              <div>
                <p className="font-semibold">Clear Visuals</p>
                <p className="text-sm text-gray-500">Charts show your allocation and growth over time.</p>
              </div>
            </li>

            <li className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-yellow-50 rounded-md flex items-center justify-center text-yellow-600 font-bold">3</div>
              <div>
                <p className="font-semibold">Explainable Rules</p>
                <p className="text-sm text-gray-500">Recommendations are rule-based and easy to justify in viva.</p>
              </div>
            </li>

            <li className="flex gap-3 items-start">
              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-700 font-bold">4</div>
              <div>
                <p className="font-semibold">Export & Share</p>
                <p className="text-sm text-gray-500">Download your plan as a PDF for faculty demo or records.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Example projection</p>
              <h3 className="text-2xl font-bold">₹10.68 Lakh</h3>
              <p className="text-xs text-gray-400">Projected total for ₹5,000/mo, 10 years (demo)</p>
            </div>
            <div className="w-32 h-32 bg-gradient-to-r from-indigo-100 to-emerald-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">Chart</div>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="text-sm text-gray-500">Allocation</p>
            <div className="mt-3 flex gap-3">
              <div className="flex-1 text-sm">
                <p className="font-semibold">Equity</p>
                <p className="text-xs text-gray-500">50% — ₹2,500 / month</p>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-semibold">Debt</p>
                <p className="text-xs text-gray-500">40% — ₹2,000 / month</p>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-semibold">Gold</p>
                <p className="text-xs text-gray-500">10% — ₹500 / month</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <a href="/auth/signup" className="block text-center px-4 py-2 rounded-md bg-indigo-600 text-white">Create your plan</a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-12">
        <h4 className="text-xl font-semibold">How it works</h4>
        <ol className="mt-4 space-y-3 text-gray-600">
          <li>1. Create account and fill 4 simple inputs: age, monthly investment, years, risk.</li>
          <li>2. Backend applies rule-based allocation and computes estimated future value.</li>
          <li>3. View charts, save recommendation, and download report.</li>
        </ol>
      </section>

      <footer id="contact" className="border-t py-6 mt-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">© 2025 InvestAI — Major Project Demo. Team 26_CS_AIML_4B_11</p>
          <div className="flex gap-3 items-center">
            <a href="mailto:priyanshu1pandey2003@gmail.com" className="text-sm text-gray-600 hover:underline">Contact</a>
            <a href="#" className="text-sm text-gray-600 hover:underline">Docs</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
