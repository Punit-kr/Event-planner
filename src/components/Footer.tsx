'use client';

import React from 'react';
import { Sparkles, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/90 py-8 px-4 text-center text-xs text-slate-500 no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-300">PlanVibe AI</span>
          <span>— Production Generative AI Event Planning Suite</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Data Retention • Client Privacy Protected</span>
          </span>
          <span className="text-slate-600">•</span>
          <span>Weddings • Birthdays • Community Events</span>
        </div>
      </div>
    </footer>
  );
};
