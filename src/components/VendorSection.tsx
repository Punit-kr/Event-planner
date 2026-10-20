'use client';

import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Plus,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { VendorItem } from '@/types/event';

interface VendorSectionProps {
  vendors: VendorItem[];
  onUpdateVendors: (updatedVendors: VendorItem[]) => void;
}

export const VendorSection: React.FC<VendorSectionProps> = ({ vendors, onUpdateVendors }) => {
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [copiedVendorId, setCopiedVendorId] = useState<string | null>(null);
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(vendors[0]?.id || null);
  const [showAddVendor, setShowAddVendor] = useState(false);

  // New vendor form state
  const [newType, setNewType] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newCost, setNewCost] = useState('');
  const [newQuestions, setNewQuestions] = useState('');

  const handleCopyQuestions = (vendor: VendorItem) => {
    const text = `Hi ${vendor.vendorType} Team,\n\nI am planning our upcoming event and would love to inquire about your availability and services. Before proceeding, could you please clarify the following questions:\n\n` +
      vendor.questionsToAsk.map((q, idx) => `${idx + 1}. ${q}`).join('\n') +
      `\n\nThank you, and I look forward to your response!`;

    navigator.clipboard.writeText(text);
    setCopiedVendorId(vendor.id || vendor.vendorType);
    setTimeout(() => setCopiedVendorId(null), 2000);
  };

  const handleStatusChange = (vendorIndex: number, newStatus: VendorItem['status']) => {
    const updated = [...vendors];
    updated[vendorIndex] = {
      ...updated[vendorIndex],
      status: newStatus
    };
    onUpdateVendors(updated);
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newType.trim()) return;

    const questionsArray = newQuestions
      .split('\n')
      .map((q) => q.trim())
      .filter(Boolean);

    const newVendor: VendorItem = {
      id: `v-${Date.now()}`,
      vendorType: newType.trim(),
      priority: newPriority,
      estimatedCost: newCost.trim() || 'Variable',
      status: 'Not Contacted',
      questionsToAsk:
        questionsArray.length > 0
          ? questionsArray
          : [
              'What is your cancellation and deposit policy?',
              'Do you provide insurance and required licenses?'
            ]
    };

    onUpdateVendors([...vendors, newVendor]);
    setNewType('');
    setNewCost('');
    setNewQuestions('');
    setShowAddVendor(false);
  };

  const filteredVendors = vendors.filter((v) => {
    if (priorityFilter === 'All') return true;
    return v.priority === priorityFilter;
  });

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold text-white">Dynamic Vendor Checklist & Briefings</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Categorized by hiring urgency with ready-to-copy interview questions and status tracking.
          </p>
        </div>

        {/* Priority Filter & Add */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  priorityFilter === p
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddVendor(!showAddVendor)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:bg-slate-800"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Add Vendor Form */}
      {showAddVendor && (
        <form onSubmit={handleAddVendor} className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Add New Vendor</span>
            <button
              type="button"
              onClick={() => setShowAddVendor(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Vendor Title (e.g., Live Drone Videographer)"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              required
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as 'High' | 'Medium' | 'Low')}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <input
              type="text"
              placeholder="Estimated Cost (e.g., $1,800)"
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <textarea
            rows={2}
            placeholder="Questions to ask (enter one question per line)"
            value={newQuestions}
            onChange={(e) => setNewQuestions(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
            >
              Save Vendor
            </button>
          </div>
        </form>
      )}

      {/* Vendor List */}
      <div className="space-y-3">
        {filteredVendors.map((vendor, idx) => {
          const isExpanded = expandedVendorId === (vendor.id || `${idx}`);
          const isCopied = copiedVendorId === (vendor.id || vendor.vendorType);

          const priorityBadge =
            vendor.priority === 'High'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              : vendor.priority === 'Medium'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

          return (
            <div
              key={vendor.id || idx}
              className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden transition-all hover:border-slate-700/80"
            >
              {/* Header row */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => setExpandedVendorId(isExpanded ? null : (vendor.id || `${idx}`))}
                >
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${priorityBadge}`}>
                    {vendor.priority} Priority
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">{vendor.vendorType}</h4>
                    <span className="text-xs text-slate-400 font-mono">
                      Est. Cost: {vendor.estimatedCost}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Status Dropdown */}
                  <select
                    value={vendor.status || 'Not Contacted'}
                    onChange={(e) => handleStatusChange(idx, e.target.value as VendorItem['status'])}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                      vendor.status === 'Booked'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : vendor.status === 'In Discussion'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <option value="Not Contacted">⚪ Not Contacted</option>
                    <option value="In Discussion">🔵 In Discussion</option>
                    <option value="Booked">🟢 Booked</option>
                  </select>

                  {/* Copy questions button */}
                  <button
                    onClick={() => handleCopyQuestions(vendor)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all hover:bg-slate-800"
                    title="Copy interview email questions"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied Email Draft!' : 'Copy Questions'}</span>
                  </button>

                  {/* Expand / Collapse toggle */}
                  <button
                    onClick={() => setExpandedVendorId(isExpanded ? null : (vendor.id || `${idx}`))}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Probing Questions */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 bg-slate-900/40 border-t border-slate-800/60 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                    Crucial Vetting Questions to Ask:
                  </div>
                  <ul className="space-y-1.5">
                    {vendor.questionsToAsk.map((q, qIdx) => (
                      <li key={qIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-indigo-400 font-bold shrink-0">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
