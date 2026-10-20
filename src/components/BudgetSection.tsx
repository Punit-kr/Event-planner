'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  PieChart,
  Lightbulb,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { BudgetBreakdown, BudgetCategory } from '@/types/event';

interface BudgetSectionProps {
  budget: BudgetBreakdown;
  onUpdateBudget: (updatedBudget: BudgetBreakdown) => void;
}

const CATEGORY_COLORS = [
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-cyan-500',
  'bg-rose-500',
  'bg-blue-500'
];

export const BudgetSection: React.FC<BudgetSectionProps> = ({ budget, onUpdateBudget }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryAmount, setNewCategoryAmount] = useState<number>(1000);
  const [newCategoryTip, setNewCategoryTip] = useState('');

  const totalAllocated = budget.categories.reduce((acc, cat) => acc + (Number(cat.allocatedAmount) || 0), 0);
  const diff = budget.totalBudget - totalAllocated;
  const isOverBudget = diff < 0;
  const isUnderBudget = diff > 0;

  const handleAmountChange = (index: number, newAmount: number) => {
    const validAmount = Math.max(0, newAmount);
    const updatedCats = [...budget.categories];
    updatedCats[index] = {
      ...updatedCats[index],
      allocatedAmount: validAmount,
      percentage: budget.totalBudget > 0 ? Math.round((validAmount / budget.totalBudget) * 100) : 0
    };

    onUpdateBudget({
      ...budget,
      categories: updatedCats
    });
  };

  const handleDeleteCategory = (index: number) => {
    const updatedCats = budget.categories.filter((_, idx) => idx !== index);
    onUpdateBudget({
      ...budget,
      categories: updatedCats
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCat: BudgetCategory = {
      id: `cat-${Date.now()}`,
      category: newCategoryName.trim(),
      allocatedAmount: Number(newCategoryAmount),
      percentage: budget.totalBudget > 0 ? Math.round((Number(newCategoryAmount) / budget.totalBudget) * 100) : 0,
      tipsToSave: newCategoryTip.trim() || 'Bundle with existing vendor contracts or compare quotes to optimize rates.'
    };

    onUpdateBudget({
      ...budget,
      categories: [...budget.categories, newCat]
    });

    setNewCategoryName('');
    setNewCategoryAmount(1000);
    setNewCategoryTip('');
    setShowAddForm(false);
  };

  const handleAutoRebalance = () => {
    if (totalAllocated === 0) return;
    const factor = budget.totalBudget / totalAllocated;
    const updatedCats = budget.categories.map((cat) => {
      const rebalanced = Math.round(cat.allocatedAmount * factor);
      return {
        ...cat,
        allocatedAmount: rebalanced,
        percentage: Math.round((rebalanced / budget.totalBudget) * 100)
      };
    });

    onUpdateBudget({
      ...budget,
      categories: updatedCats
    });
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PieChart className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold text-white">Interactive Budget Breakdown</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamically adjust category sliders, recalculate totals, and review cost-saving tips.
          </p>
        </div>

        {/* Status alert pill */}
        <div className="flex items-center gap-3">
          {isOverBudget ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Over Budget by {budget.currency} {Math.abs(diff).toLocaleString()}</span>
              <button
                onClick={handleAutoRebalance}
                className="underline hover:text-white ml-1 text-[11px]"
                title="Scale all categories to fit budget"
              >
                Auto-Fit
              </button>
            </div>
          ) : isUnderBudget ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{budget.currency} {diff.toLocaleString()} Unallocated Buffer</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>100% Perfectly Allocated</span>
            </div>
          )}

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:bg-slate-800"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Visual Proportional Multi-Segment Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Allocation Distribution</span>
          <span className="font-mono font-bold text-slate-300">
            {budget.currency} {totalAllocated.toLocaleString()} / {budget.currency} {budget.totalBudget.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 p-0.5">
          {budget.categories.map((cat, idx) => {
            const widthPct = budget.totalBudget > 0 ? (cat.allocatedAmount / budget.totalBudget) * 100 : 0;
            const colorClass = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            return (
              <div
                key={cat.id || idx}
                style={{ width: `${Math.min(100, Math.max(1, widthPct))}%` }}
                className={`h-full ${colorClass} transition-all duration-300 first:rounded-l-full last:rounded-r-full`}
                title={`${cat.category}: ${budget.currency} ${cat.allocatedAmount.toLocaleString()} (${cat.percentage}%)`}
              />
            );
          })}
        </div>
      </div>

      {/* Add Category Form (Collapsible) */}
      {showAddForm && (
        <form onSubmit={handleAddCategory} className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">New Budget Category</span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Category Name (e.g., Drone Videography)"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Amount"
              min="0"
              step="any"
              value={newCategoryAmount}
              onChange={(e) => setNewCategoryAmount(Number(e.target.value))}
              required
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Cost-Saving Tip (Optional)"
              value={newCategoryTip}
              onChange={(e) => setNewCategoryTip(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budget.categories.map((cat, idx) => {
          const colorClass = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
          const pctOfTotal = budget.totalBudget > 0 ? Math.round((cat.allocatedAmount / budget.totalBudget) * 100) : 0;

          return (
            <div
              key={cat.id || idx}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-3 relative group"
            >
              {/* Category Title & Amount */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                  <span className="font-bold text-white text-sm sm:text-base">{cat.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    {pctOfTotal}%
                  </span>
                  <button
                    onClick={() => handleDeleteCategory(idx)}
                    title="Remove Category"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Amount Input & Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">Allocated Amount:</span>
                  <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 px-2.5 py-1 focus-within:border-indigo-500">
                    <span className="text-xs font-bold text-indigo-400 mr-1">{budget.currency}</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={cat.allocatedAmount}
                      onChange={(e) => handleAmountChange(idx, Number(e.target.value))}
                      className="w-24 bg-transparent text-right text-sm font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="0"
                  max={Math.max(cat.allocatedAmount * 2, budget.totalBudget)}
                  step="100"
                  value={cat.allocatedAmount}
                  onChange={(e) => handleAmountChange(idx, Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Tips to Save */}
              {cat.tipsToSave && (
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs text-slate-300 flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-snug text-slate-300">
                    <strong className="text-amber-400/90 font-medium mr-1">Pro Tip:</strong>
                    {cat.tipsToSave}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
