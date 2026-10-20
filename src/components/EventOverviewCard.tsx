'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Printer,
  Copy,
  Check,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Palette
} from 'lucide-react';
import { EventPlan } from '@/types/event';
import { exportEventPlanToPdf } from '@/lib/pdfExport';

interface EventOverviewCardProps {
  plan: EventPlan;
  providerInfo?: string;
}

export const EventOverviewCard: React.FC<EventOverviewCardProps> = ({ plan, providerInfo }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleCopySummary = () => {
    const text = `🎉 ${plan.eventOverview.title}\n\n` +
      `📅 Timeline: ${plan.inputs.eventDate || 'TBA'} | 📍 Location: ${plan.inputs.location || 'TBA'}\n` +
      `👥 Guests: ${plan.inputs.guestCount} | 💰 Budget: ${plan.budgetBreakdown.currency} ${plan.budgetBreakdown.totalBudget.toLocaleString()}\n\n` +
      `✨ Theme Concept:\n${plan.eventOverview.themeConcept}\n\n` +
      `📝 Summary:\n${plan.eventOverview.summary}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden space-y-6">
      {/* Decorative gradient flare */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Top Meta Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              plan.inputs.eventType === 'Wedding'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : plan.inputs.eventType === 'Birthday'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {plan.inputs.eventType}
          </span>
          {providerInfo && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {providerInfo}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold transition-all hover:bg-slate-800"
            title="Copy Executive Summary"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold transition-all hover:bg-slate-800"
            title="Print View"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={() => exportEventPlanToPdf(plan)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            title="Download PDF Executive Brief"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Brief</span>
          </button>
        </div>
      </div>

      {/* Hero Title & Summary */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          {plan.eventOverview.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
          {plan.eventOverview.summary}
        </p>
      </div>

      {/* Theme Concept Box */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Aesthetic Direction & Theme Concept</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          {plan.eventOverview.themeConcept}
        </p>
      </div>

      {/* Color Palette & Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Color Palette */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              Suggested Color Palette
            </span>
            <span className="text-[11px] text-slate-500">Click swatch to copy hex</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {plan.eventOverview.suggestedColorPalette.map((hex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleCopyHex(hex)}
                className="group relative flex flex-col items-center focus:outline-none"
              >
                <div
                  className="w-10 h-10 rounded-xl shadow-md border border-white/20 transition-transform group-hover:scale-110 group-active:scale-95 flex items-center justify-center"
                  style={{ backgroundColor: hex }}
                >
                  {copiedHex === hex && (
                    <Check className="w-4 h-4 text-white drop-shadow stroke-[3]" />
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase">
                  {copiedHex === hex ? 'Copied!' : hex}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Budget</div>
              <div className="text-sm font-extrabold text-white">
                {plan.budgetBreakdown.currency} {plan.budgetBreakdown.totalBudget.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Guest Count</div>
              <div className="text-sm font-extrabold text-white">
                {plan.inputs.guestCount} Attendees
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Timeline</div>
              <div className="text-sm font-extrabold text-white truncate max-w-[120px]">
                {plan.inputs.eventDate || 'Flexible'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Location</div>
              <div className="text-sm font-extrabold text-white truncate max-w-[120px]">
                {plan.inputs.location || 'Location TBA'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
