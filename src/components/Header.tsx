'use client';

import React from 'react';
import { Sparkles, Calendar, Key, BookmarkCheck, PlusCircle } from 'lucide-react';
import { ApiKeyConfig } from '@/types/event';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenSaved: () => void;
  onNewPlan: () => void;
  apiConfig: ApiKeyConfig;
  savedCount: number;
  hasActivePlan: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenSaved,
  onNewPlan,
  apiConfig,
  savedCount,
  hasActivePlan
}) => {
  const getProviderBadge = () => {
    switch (apiConfig.provider) {
      case 'openai':
        return { label: 'OpenAI (Active)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'anthropic':
        return { label: 'Claude (Active)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'gemini':
        return { label: 'Gemini (Active)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      default:
        return { label: 'Precision AI (Zero-Key)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
    }
  };

  const badge = getProviderBadge();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewPlan}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                PlanVibe<span className="text-indigo-400">.ai</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Generative AI Event Intelligence & Planning Suite
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Provider Indicator */}
          <button
            onClick={onOpenSettings}
            title="Configure AI Provider & API Keys"
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:brightness-110 ${badge.color}`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </button>

          {/* Saved Plans */}
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs sm:text-sm font-medium transition-all hover:bg-slate-800/60"
          >
            <BookmarkCheck className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Saved Plans</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Event Button */}
          {hasActivePlan && (
            <button
              onClick={onNewPlan}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Event</span>
            </button>
          )}

          {/* Small screen settings button */}
          <button
            onClick={onOpenSettings}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="AI Settings"
          >
            <Key className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
