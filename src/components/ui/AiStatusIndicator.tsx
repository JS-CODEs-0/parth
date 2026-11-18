'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

export type AiStatus = 'connected' | 'unavailable' | 'unconfigured' | 'checking';

interface StatusData {
  status: AiStatus;
  model?: string;
  latencyMs?: number;
  message?: string;
  timestamp?: string;
}

interface AiStatusIndicatorProps {
  compact?: boolean;
}

export function AiStatusIndicator({ compact = false }: AiStatusIndicatorProps) {
  const [data, setData] = useState<StatusData>({ status: 'checking' });
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkStatus = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/status', { cache: 'no-store' });
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setData({
        status: 'unavailable',
        message: 'Unable to reach local API server',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Poll every 45 seconds to keep status strictly accurate
    const interval = setInterval(checkStatus, 45000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (data.status) {
      case 'connected':
        return 'bg-emerald-500 text-emerald-400 border-emerald-500/30';
      case 'unavailable':
        return 'bg-rose-500 text-rose-400 border-rose-500/30';
      case 'unconfigured':
        return 'bg-amber-500 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500 text-slate-400 border-slate-500/30';
    }
  };

  const getLabel = () => {
    switch (data.status) {
      case 'connected':
        return compact ? 'Nemotron Active' : 'Nemotron 3 Ultra Connected';
      case 'unavailable':
        return compact ? 'AI Offline' : 'Nemotron Service Unavailable';
      case 'unconfigured':
        return compact ? 'AI Key Missing' : 'API Key Unconfigured';
      default:
        return 'Checking AI Status...';
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md transition-all hover:bg-[#181a28] ${
          data.status === 'connected'
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            : data.status === 'unconfigured'
            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            : data.status === 'unavailable'
            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            : 'bg-slate-500/10 text-slate-300 border-slate-500/30'
        }`}
        title="Click to view AI system status"
      >
        <span className="relative flex h-2 w-2">
          {data.status === 'connected' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              data.status === 'connected'
                ? 'bg-emerald-400'
                : data.status === 'unconfigured'
                ? 'bg-amber-400'
                : data.status === 'unavailable'
                ? 'bg-rose-400'
                : 'bg-slate-400'
            }`}
          />
        </span>

        <span className="truncate max-w-[150px]">{getLabel()}</span>

        {data.latencyMs && (
          <span className="text-[10px] opacity-75 font-mono hidden sm:inline">
            {data.latencyMs}ms
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#12131e] border border-[#232637] p-4 shadow-2xl z-50 text-xs text-slate-300 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#212435]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-xs">AI System Status</span>
            </div>
            <button
              onClick={checkStatus}
              disabled={isRefreshing}
              className="text-slate-400 hover:text-white p-1 rounded-md"
              title="Refresh connection status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">State:</span>
              <span
                className={`font-semibold capitalize px-2 py-0.5 rounded text-[10px] ${
                  data.status === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : data.status === 'unconfigured'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {data.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Model:</span>
              <span className="text-white font-mono text-[10px]">
                nemotron-3-ultra-550b-a55b
              </span>
            </div>

            {data.latencyMs && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Probe Latency:</span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  {data.latencyMs} ms
                </span>
              </div>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-[#171926] border border-[#222538] text-[11px] leading-relaxed">
            {data.status === 'connected' && (
              <p className="text-emerald-300">
                ✓ NVIDIA Nemotron 3 Ultra is actively connected and processing catalog shopping requests.
              </p>
            )}
            {data.status === 'unconfigured' && (
              <p className="text-amber-300">
                ⚠️ API key is missing. Add <code className="text-white bg-black/40 px-1 rounded">NVIDIA_API_KEY</code> in Vercel Project Settings → Environment Variables (or <code className="text-white bg-black/40 px-1 rounded">.env.local</code> locally).
              </p>
            )}
            {data.status === 'unavailable' && (
              <p className="text-rose-300">
                ✕ Service unreachable. {data.message || 'Check network connection or API quota.'}
              </p>
            )}
          </div>

          <div className="text-[10px] text-slate-500 text-center">
            Zero simulated status • Verified live against NVIDIA API
          </div>
        </div>
      )}
    </div>
  );
}
