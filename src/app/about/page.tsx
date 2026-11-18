import React from 'react';
import Link from 'next/link';
import {
  Cpu,
  ShieldCheck,
  Scale,
  Zap,
  Server,
  Database,
  Lock,
} from 'lucide-react';
import { AiStatusIndicator } from '../../components/ui/AiStatusIndicator';
import { PageBackground } from '../../components/ui/PageBackground';

export const metadata = {
  title: 'About ShopMate AI — Intelligent E-Commerce Shopping Architecture',
  description:
    'Learn how ShopMate AI combines Next.js App Router, deterministic catalog search, and NVIDIA Nemotron 3 Ultra (550B) to deliver unbiased shopping intelligence in INR.',
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      {/* Relatable Hardware / Data Center Architecture Background */}
      <PageBackground
        imageUrl="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2200&q=80"
        alt="Silicon microarchitecture and neural computing"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30">
              System Architecture & Principles
            </span>
            <AiStatusIndicator compact />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-slate-200 to-emerald-400">ShopMate AI</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            ShopMate AI was created to solve a fundamental problem in modern e-commerce: <strong>sponsored bias, spec overload, and marketing jargon</strong> that lead to buyer’s remorse.
          </p>
        </div>

        {/* The Core Mission */}
        <div className="rounded-3xl bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 p-8 sm:p-12 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Our Mission: 100% Unbiased Shopping Intelligence
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Most online shopping engines prioritize products based on advertising bids, vendor commissions, or affiliate margins. Consumers are flooded with generic 5-star reviews and confusing marketing terms like <em>"AI Boost"</em> or <em>"Turbo Acceleration"</em> that mask thermal throttling, short battery lives, or soldered memory.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              ShopMate AI takes the opposite approach: <strong>grounded, deterministic hardware facts paired with deep, honest AI reasoning in real Indian Rupees (INR).</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <ShieldCheck className="w-5 h-5 text-cyan-400 mb-2" />
              <h3 className="font-semibold text-white text-sm">Zero Sponsored Ranks</h3>
              <p className="text-xs text-slate-400 mt-1">Recommendations are driven strictly by your budget and workflow needs.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <Zap className="w-5 h-5 text-emerald-400 mb-2" />
              <h3 className="font-semibold text-white text-sm">Grounded Hardware Data</h3>
              <p className="text-xs text-slate-400 mt-1">Every watt, gram, screen resolution, and port is verified against real hardware specs.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <Scale className="w-5 h-5 text-cyan-400 mb-2" />
              <h3 className="font-semibold text-white text-sm">Mandatory Compromises</h3>
              <p className="text-xs text-slate-400 mt-1">Every product analysis highlights its true limitations, not just sales praise.</p>
            </div>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              The Technology Stack
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Engineered with modern production technologies for speed, security, and accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: NVIDIA Nemotron */}
            <div className="p-6 rounded-2xl bg-[#0e1017]/90 backdrop-blur-xl border border-cyan-500/30 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Reasoning Foundation Model
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  NVIDIA Nemotron 3 Ultra (550B)
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Powered by NVIDIA's premier 550B parameter open-weights model via the high-throughput <code>https://integrate.api.nvidia.com/v1</code> endpoint. Its advanced reasoning and thinking capabilities synthesize complex trade-offs, budget margins, and multi-variable comparisons.
              </p>
              <div className="text-[11px] text-slate-400 font-mono bg-black/40 p-2 rounded-lg border border-white/10">
                Model: nvidia/nemotron-3-ultra-550b-a55b
              </div>
            </div>

            {/* Card 2: Next.js App Router */}
            <div className="p-6 rounded-2xl bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] text-slate-200 border border-white/15 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Full-Stack Architecture
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Next.js App Router & React 19
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Built on Next.js with React Server Components, Partial Prerendering (PPR), Turbopack compilation, and secure server-side API route handlers that isolate API keys from client bundles.
              </p>
              <div className="text-[11px] text-slate-400 font-mono bg-black/40 p-2 rounded-lg border border-white/10">
                Turbopack • Cache Components • Node.js Runtime
              </div>
            </div>

            {/* Card 3: Deterministic Retrieval */}
            <div className="p-6 rounded-2xl bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Data Grounding Architecture
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Deterministic Catalog Retrieval
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Before user prompts reach Nemotron, an intelligent deterministic search engine scans the query for INR budget numbers, product categories, hardware aliases, and specs (e.g., RAM, storage, battery). Only real catalog products are provided as grounded context, preventing hallucinations.
              </p>
            </div>

            {/* Card 4: Security & Privacy */}
            <div className="p-6 rounded-2xl bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Privacy & Data Security
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Local Storage & Zero Secret Leakage
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Wishlists, comparison lists, and session chat histories are stored locally on your device in browser localStorage. No tracking cookies, no advertising profiling, and API keys are strictly confined to server-side variables.
              </p>
            </div>
          </div>
        </div>

        {/* The 7 Shopping Agent Pillars */}
        <div className="rounded-3xl bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 p-8 sm:p-12 space-y-8 shadow-2xl">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Intelligent Agent Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              The 7 Shopping Pillars of ShopMate AI
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-colors">
              <h4 className="font-bold text-cyan-300 text-sm">1. Smart Budget Planner</h4>
              <p className="leading-relaxed text-slate-300">Computes exact INR surpluses or deficits (e.g. +₹14,990) and evaluates whether stretching your budget provides proportional hardware value.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-colors">
              <h4 className="font-bold text-cyan-300 text-sm">2. 4-Way Spec Comparison Matrix</h4>
              <p className="leading-relaxed text-slate-300">Lines up 2 to 4 models simultaneously across 12+ verified hardware metrics with direct links into the comparison engine.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-colors">
              <h4 className="font-bold text-cyan-300 text-sm">3. Requirement Matching & Scores</h4>
              <p className="leading-relaxed text-slate-300">Assigns mathematical match scores (e.g. 95% Match) by verifying each individual criteria (camera, battery, storage, RAM).</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-colors">
              <h4 className="font-bold text-cyan-300 text-sm">4. Closest Alternative Finder</h4>
              <p className="leading-relaxed text-slate-300">When an exact budget cannot be met, finds the closest viable catalog alternative without fabricating fake low prices.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-colors">
              <h4 className="font-bold text-cyan-300 text-sm">5. Jargon Demystifier</h4>
              <p className="leading-relaxed text-slate-300">Translates technical terms (OLED 120Hz LTPO, NPU, MagSpeed, Nano IPS Black) into clear daily human benefits.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-colors">
              <h4 className="font-bold text-cyan-300 text-sm">6. Multi-Turn Conversation Memory</h4>
              <p className="leading-relaxed text-slate-300">Remembers category, budget, and prior constraints as you converse across multiple questions in your session.</p>
            </div>
          </div>
        </div>

        {/* CTA Box */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#10121a] to-emerald-950/30 border border-cyan-500/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="font-bold text-white text-lg">Experience ShopMate AI Live</h3>
            <p className="text-xs text-slate-300 mt-1">Start a conversation with NVIDIA Nemotron 3 Ultra or browse the verified catalog.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/assistant"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs transition-all shadow-md"
            >
              Launch AI Assistant
            </Link>
            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 font-semibold text-xs transition-all"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
