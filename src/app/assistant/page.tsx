'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Product, ChatMessage, ActivePreferences, RecommendationDetail, ComparisonData } from '../../lib/types';
import { formatINR } from '../../lib/utils';
import { useShop } from '../../context/ShopContext';
import { FormattedMessage } from '../../components/chat/FormattedMessage';
import { AiStatusIndicator } from '../../components/ui/AiStatusIndicator';
import { PageBackground } from '../../components/ui/PageBackground';
import {
  Sparkles,
  Send,
  BotMessageSquare,
  User,
  RotateCcw,
  Scale,
  Heart,
  ArrowUpRight,
  Star,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  DollarSign,
  Tag,
  X,
} from 'lucide-react';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-msg',
    sender: 'assistant',
    text: "Hello! I am your **ShopMate AI Shopping Agent**, powered by **NVIDIA Nemotron 3 Ultra (550B)**.\n\nI can help you with:\n• **Smart Budget Planning** (e.g. *\"I have ₹70,000 for programming and gaming\"*)\n• **Head-to-Head Comparisons** (e.g. *\"Compare these three laptops\"*)\n• **Strict Requirement Matching** (e.g. *\"Phone with good cameras, 256GB, and long battery\"*)\n• **Alternative Finder** when items exceed your budget\n• **Plain-Language Explanations** of complex hardware specifications\n• **Session Memory**: I remember your criteria as we chat!",
    timestamp: 'Just now',
    suggestedFollowUps: [
      'I have ₹70,000. I need a laptop for programming and gaming.',
      'Compare Sony WH-1000XM5, Bose QC Ultra and AirPods Max',
      'I need a phone with great cameras, all-day battery and 256GB storage',
      'Explain what OLED 120Hz LTPO and NPU mean in simple language',
    ],
  },
];

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  const { isInWishlist, toggleWishlist, isInCompare, addToCompare, clearCompare } = useShop();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionPrefs, setSessionPrefs] = useState<ActivePreferences>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const hasTriggeredInitial = useRef(false);
  useEffect(() => {
    if (initialQuery && initialQuery.trim() && !hasTriggeredInitial.current) {
      hasTriggeredInitial.current = true;
      handleUserSubmit(initialQuery.trim());
    }
  }, [initialQuery]);

  const handleUserSubmit = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const queryText = text.trim();

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: queryText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: queryText,
          preferences: sessionPrefs,
          history: messages.slice(-8).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: Failed to get AI response`);
      }

      if (data.activePreferences) {
        setSessionPrefs(data.activePreferences);
      }

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: data.response || 'Here are my recommendations based on your request.',
        timestamp: 'Just now',
        recommendedProducts: data.recommendedProducts || [],
        recommendationDetails: data.recommendationDetails || [],
        comparisonData: data.comparisonData || null,
        activePreferences: data.activePreferences || sessionPrefs,
        agentAction: data.agentAction,
        suggestedFollowUps: data.suggestedFollowUps || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Shopping Agent Error:', err);

      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: `⚠️ **Shopping Agent Notice**: ${err.message || 'An error occurred while communicating with NVIDIA Nemotron 3 Ultra.'}\n\n*Note for deployment:* In Vercel, ensure \`NVIDIA_API_KEY\` is added under **Project Settings → Environment Variables** (and redeploy). For local development, check \`.env.local\`.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setSessionPrefs({});
  };

  const removePreference = (key: keyof ActivePreferences) => {
    setSessionPrefs((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleOpenComparison = (productIds: string[]) => {
    clearCompare();
    productIds.slice(0, 4).forEach((id) => addToCompare(id));
  };

  const hasActivePreferences = Boolean(
    sessionPrefs.category ||
    sessionPrefs.maxBudget ||
    sessionPrefs.ram ||
    sessionPrefs.storage ||
    (sessionPrefs.keyRequirements && sessionPrefs.keyRequirements.length > 0)
  );

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 h-[calc(100vh-4rem)] flex flex-col">
      {/* Relatable Photographic Atmosphere Background */}
      <PageBackground
        imageUrl="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80"
        alt="Silicon microarchitecture and neural computing atmosphere"
      />

      {/* Top Assistant Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 shrink-0 gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center shadow-lg shadow-black/40">
            <BotMessageSquare className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-bold text-zinc-100 text-base sm:text-lg">
                ShopMate AI Agent
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>NVIDIA Nemotron 3 Ultra</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Autonomous budget planning, requirement matching, and unbiased spec comparison in INR.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AiStatusIndicator />

          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141520] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-750 text-xs font-medium transition-colors"
            title="Reset conversation session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Session</span>
          </button>
        </div>
      </div>

      {/* CONVERSATION SESSION MEMORY BAR */}
      {hasActivePreferences && (
        <div className="mb-3 px-3.5 py-2 rounded-xl bg-[#0f1018]/90 backdrop-blur-xl border border-zinc-700/80 flex items-center justify-between text-xs animate-in fade-in duration-200 shadow-md">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <Sliders className="w-3 h-3" />
              <span>Session Memory:</span>
            </span>

            {sessionPrefs.category && sessionPrefs.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 text-[11px]">
                <Tag className="w-3 h-3 text-cyan-400" />
                <span className="capitalize">{sessionPrefs.category}</span>
                <button
                  onClick={() => removePreference('category')}
                  className="hover:text-rose-400 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sessionPrefs.maxBudget && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                <span>Max: {formatINR(sessionPrefs.maxBudget)}</span>
                <button
                  onClick={() => removePreference('maxBudget')}
                  className="hover:text-rose-400 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sessionPrefs.ram && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 text-[11px]">
                <span>RAM: {sessionPrefs.ram}</span>
                <button
                  onClick={() => removePreference('ram')}
                  className="hover:text-rose-400 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sessionPrefs.storage && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 text-[11px]">
                <span>Storage: {sessionPrefs.storage}</span>
                <button
                  onClick={() => removePreference('storage')}
                  className="hover:text-rose-400 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sessionPrefs.keyRequirements && sessionPrefs.keyRequirements.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 text-[11px]">
                <span>Focus: {sessionPrefs.keyRequirements.slice(0, 3).join(', ')}</span>
              </span>
            )}
          </div>

          <button
            onClick={() => setSessionPrefs({})}
            className="text-[11px] text-zinc-400 hover:text-rose-400 transition-colors shrink-0 ml-2"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-zinc-800 text-cyan-300 border border-zinc-700 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <BotMessageSquare className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={`flex flex-col space-y-3 max-w-2xl sm:max-w-3xl ${
                  isUser ? 'items-end' : 'items-start'
                }`}
              >
                {/* Bubble */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-zinc-100 text-zinc-950 font-medium rounded-br-none shadow-xl'
                      : 'bg-[#10111a]/95 backdrop-blur-xl text-zinc-200 border border-zinc-800 rounded-bl-none shadow-2xl'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-line">{msg.text}</p>
                  ) : (
                    <FormattedMessage content={msg.text} />
                  )}
                </div>

                {/* STRUCTURED COMPARISON CARD (If Agent Outputted Comparison Data) */}
                {msg.comparisonData && (
                  <div className="w-full p-4 rounded-2xl bg-[#10111a]/90 backdrop-blur-xl border border-zinc-700/80 space-y-3 text-xs shadow-xl">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-bold text-white text-sm">
                          {msg.comparisonData.title || 'Side-by-Side Product Comparison'}
                        </h4>
                      </div>
                      <Link
                        href="/compare"
                        onClick={() => handleOpenComparison(msg.comparisonData!.productIds || [])}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-[11px] transition-all shadow-md"
                      >
                        <span>Open 4-Way Matrix</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {msg.comparisonData.summary && (
                      <p className="text-zinc-300 text-xs italic">
                        "{msg.comparisonData.summary}"
                      </p>
                    )}

                    {msg.comparisonData.rows && msg.comparisonData.rows.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] border-collapse">
                          {msg.comparisonData.headers && (
                            <thead>
                              <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-900/60">
                                {msg.comparisonData.headers.map((h, idx) => (
                                  <th key={idx} className="py-2 px-3 font-semibold">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody className="divide-y divide-zinc-800/80">
                            {msg.comparisonData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-zinc-900/30' : ''}>
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`py-2 px-3 ${
                                      cIdx === 0 ? 'font-semibold text-zinc-400' : 'text-zinc-200'
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* EMBEDDED PRODUCT RECOMMENDATION CARDS WITH REASONS & MATCH SCORES */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="w-full space-y-2 pt-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Recommended Catalog Models ({msg.recommendedProducts.length})</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                      {msg.recommendedProducts.map((p, pIdx) => {
                        const inWish = isInWishlist(p.id);
                        const inComp = isInCompare(p.id);

                        const details = msg.recommendationDetails?.find(
                          (d) => d.productId === p.id
                        ) || {
                          matchScore: Math.max(88, 98 - pIdx * 4),
                          whyRecommended: p.aiAnalysis.whyRecommend,
                          strengths: p.pros.slice(0, 2),
                          compromises: p.cons.slice(0, 1),
                        };

                        return (
                          <div
                            key={p.id}
                            className="flex flex-col justify-between p-4 rounded-xl bg-[#10111a]/95 backdrop-blur-xl border border-zinc-800 hover:border-zinc-600 transition-all text-xs shadow-xl"
                          >
                            <div className="space-y-2.5">
                              {/* Media & Match Score Badge */}
                              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[#151622]">
                                <Image
                                  src={p.image}
                                  alt={p.name}
                                  fill
                                  sizes="240px"
                                  className="object-cover"
                                />

                                <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-900/90 text-cyan-300 border border-cyan-500/30 shadow-md">
                                    {details.matchScore}% Match
                                  </span>
                                </div>

                                {p.badge && (
                                  <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-white border border-zinc-700">
                                    {p.badge}
                                  </span>
                                )}
                              </div>

                              <div>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                  {p.brand} • {p.category}
                                </span>
                                <h4 className="font-semibold text-zinc-100 line-clamp-1 text-sm">
                                  {p.name}
                                </h4>
                              </div>

                              {/* Price & Rating */}
                              <div className="flex items-baseline justify-between pt-0.5">
                                <span className="font-black text-white text-base">
                                  {formatINR(p.price)}
                                </span>
                                <span className="text-amber-400 font-semibold flex items-center gap-0.5 text-xs">
                                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                                  <span>{p.rating}</span>
                                </span>
                              </div>

                              {/* WHY RECOMMENDED */}
                              <div className="p-2.5 rounded-lg bg-[#141520] border border-zinc-800 space-y-1">
                                <span className="text-[10px] font-semibold text-cyan-300 uppercase tracking-wider block">
                                  Why Recommended
                                </span>
                                <p className="text-[11px] text-zinc-300 leading-snug">
                                  {details.whyRecommended}
                                </p>
                              </div>

                              {/* STRENGTHS */}
                              {details.strengths && details.strengths.length > 0 && (
                                <div className="space-y-1 pt-1">
                                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                                    Key Strengths
                                  </span>
                                  <ul className="space-y-0.5 text-[11px] text-zinc-300">
                                    {details.strengths.map((str, sIdx) => (
                                      <li key={sIdx} className="flex items-start gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>{str}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* COMPROMISES / LIMITATIONS */}
                              {details.compromises && details.compromises.length > 0 && (
                                <div className="space-y-1 pt-1">
                                  <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                                    Compromises & Limitations
                                  </span>
                                  <ul className="space-y-0.5 text-[11px] text-zinc-300">
                                    {details.compromises.map((com, cIdx) => (
                                      <li key={cIdx} className="flex items-start gap-1">
                                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                                        <span>{com}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Actions inside Chat Card */}
                            <div className="pt-3 border-t border-zinc-800 mt-3 flex items-center gap-1.5">
                              <Link
                                href={`/product/${p.id}`}
                                className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-white hover:text-black text-zinc-200 border border-zinc-700 text-center font-bold transition-all flex items-center justify-center gap-1 text-[11px]"
                              >
                                <span>Inspect Specs</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </Link>

                              <button
                                onClick={() => addToCompare(p.id)}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  inComp
                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white border-zinc-700'
                                }`}
                                title={inComp ? 'Remove from compare' : 'Compare product'}
                              >
                                <Scale className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => toggleWishlist(p.id)}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  inWish
                                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white border-zinc-700'
                                }`}
                                title={inWish ? 'Remove from wishlist' : 'Save to wishlist'}
                              >
                                <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-rose-500' : ''}`} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up chips */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedFollowUps.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleUserSubmit(chip)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#141520]/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-750 hover:border-zinc-500 transition-colors"
                      >
                        → {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Avatar for User */}
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading / Nemotron 3 Ultra Reasoning indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 text-cyan-300 border border-zinc-700 flex items-center justify-center shrink-0">
              <BotMessageSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#10111a]/95 backdrop-blur-xl border border-zinc-800 rounded-bl-none flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-cyan-300">
                  NVIDIA Nemotron 3 Ultra (550B)
                </span>
                <span className="text-[11px] text-zinc-400">
                  Reasoning through specifications, trade-offs & conversation memory...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="shrink-0 pt-2 border-t border-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserSubmit(inputText);
          }}
          className="relative flex items-center rounded-2xl bg-[#0f1018]/90 backdrop-blur-xl border border-zinc-750 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-xl transition-all p-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Ask Nemotron 3 Ultra... e.g. 'I have ₹70,000 for programming' or 'Compare these three'"
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none px-3 py-2 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="shrink-0 p-2.5 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-white text-zinc-950 font-bold transition-all shadow-md"
            title="Send to Nemotron 3 Ultra"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 px-1">
          <span>AI Shopping Agent: <strong>nvidia/nemotron-3-ultra-550b-a55b</strong></span>
          <span>100% Grounded in Catalog Data</span>
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 h-[calc(100vh-4rem)] flex flex-col justify-between animate-pulse">
          <div className="h-12 w-72 bg-zinc-800 rounded-xl mb-6" />
          <div className="space-y-4 flex-1">
            <div className="h-24 w-full max-w-lg bg-zinc-900 rounded-2xl" />
            <div className="h-32 w-full max-w-md bg-zinc-800 rounded-2xl ml-auto" />
          </div>
          <div className="h-14 w-full bg-zinc-900 rounded-2xl" />
        </div>
      }
    >
      <AssistantContent />
    </Suspense>
  );
}
