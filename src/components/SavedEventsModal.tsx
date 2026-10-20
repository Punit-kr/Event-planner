'use client';

import React from 'react';
import { X, Calendar, DollarSign, Users, MapPin, Trash2, ArrowRight, Download, Sparkles } from 'lucide-react';
import { EventPlan } from '@/types/event';
import { exportEventPlanToPdf } from '@/lib/pdfExport';

interface SavedEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: EventPlan[];
  activePlanId: string | null;
  onSelectPlan: (plan: EventPlan) => void;
  onDeletePlan: (id: string) => void;
}

export const SavedEventsModal: React.FC<SavedEventsModalProps> = ({
  isOpen,
  onClose,
  savedPlans,
  activePlanId,
  onSelectPlan,
  onDeletePlan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Your Saved Event Blueprints</h3>
              <p className="text-xs text-slate-400">
                {savedPlans.length} {savedPlans.length === 1 ? 'event plan' : 'event plans'} saved in browser storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="mt-4 overflow-y-auto space-y-3 flex-1 pr-1">
          {savedPlans.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Sparkles className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">No saved event plans yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the event generator form to create and save your first plan!
              </p>
            </div>
          ) : (
            savedPlans.map((plan) => {
              const isActive = plan.id === activePlanId;
              const dateCreated = new Date(plan.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-100 text-sm sm:text-base">
                          {plan.eventOverview.title}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            plan.inputs.eventType === 'Wedding'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : plan.inputs.eventType === 'Birthday'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {plan.inputs.eventType}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                          {plan.budgetBreakdown.currency} {plan.budgetBreakdown.totalBudget.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-400" />
                          {plan.inputs.guestCount} guests
                        </span>
                        {plan.inputs.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                            {plan.inputs.location}
                          </span>
                        )}
                        <span className="text-slate-500">Created: {dateCreated}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => exportEventPlanToPdf(plan)}
                        title="Download PDF Brief"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeletePlan(plan.id)}
                        title="Delete Plan"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          onSelectPlan(plan);
                          onClose();
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-slate-800 text-slate-400 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                        }`}
                      >
                        <span>{isActive ? 'Loaded' : 'Load Plan'}</span>
                        {!isActive && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
