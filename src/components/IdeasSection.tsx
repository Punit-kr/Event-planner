'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  Star,
  Plus,
  Utensils,
  PartyPopper,
  Paintbrush
} from 'lucide-react';
import { PersonalizedIdea } from '@/types/event';

interface IdeasSectionProps {
  ideas: PersonalizedIdea[];
  onUpdateIdeas: (updatedIdeas: PersonalizedIdea[]) => void;
}

export const IdeasSection: React.FC<IdeasSectionProps> = ({ ideas, onUpdateIdeas }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Activity' | 'Decor' | 'Food & Beverage'>('All');
  const [showAddIdea, setShowAddIdea] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Activity' | 'Decor' | 'Food & Beverage'>('Decor');

  const handleToggleFavorite = (index: number) => {
    const updated = [...ideas];
    updated[index] = {
      ...updated[index],
      isFavorite: !updated[index].isFavorite
    };
    onUpdateIdeas(updated);
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newIdea: PersonalizedIdea = {
      id: `idea-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      isFavorite: true
    };

    onUpdateIdeas([newIdea, ...ideas]);
    setNewTitle('');
    setNewDesc('');
    setShowAddIdea(false);
  };

  // Sort favorites first
  const sortedIdeas = [...ideas].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  const filteredIdeas = sortedIdeas.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Activity':
        return PartyPopper;
      case 'Food & Beverage':
        return Utensils;
      default:
        return Paintbrush;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Activity':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Food & Beverage':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold text-white">Personalized Themes, Decor & Itinerary Ideas</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Curated concepts tailored to your event aesthetic. Star your favorites to shortlist them.
          </p>
        </div>

        {/* Category Filter & Add Idea */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['All', 'Activity', 'Decor', 'Food & Beverage'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddIdea(!showAddIdea)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:bg-slate-800"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Add Custom Idea</span>
          </button>
        </div>
      </div>

      {/* Add Idea Form */}
      {showAddIdea && (
        <form onSubmit={handleAddIdea} className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Add Custom Idea</span>
            <button
              type="button"
              onClick={() => setShowAddIdea(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Title (e.g. Polaroid Wishing Tree)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 sm:col-span-2"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as typeof newCategory)}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="Activity">Activity</option>
              <option value="Decor">Decor</option>
              <option value="Food & Beverage">Food & Beverage</option>
            </select>
          </div>
          <textarea
            rows={2}
            placeholder="Detailed description of the experience, setup, or guest interaction..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            required
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
            >
              Save Idea
            </button>
          </div>
        </form>
      )}

      {/* Ideas Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.map((idea, idx) => {
          const Icon = getCategoryIcon(idea.category);
          const badgeClass = getCategoryBadge(idea.category);

          return (
            <div
              key={idea.id || idx}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group relative ${
                idea.isFavorite
                  ? 'bg-slate-900/90 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              <div className="space-y-3">
                {/* Category & Star Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badgeClass}`}>
                      <Icon className="w-3 h-3" />
                      {idea.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(idx)}
                    className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
                    title={idea.isFavorite ? 'Unfavorite' : 'Mark as Favorite'}
                  >
                    <Star
                      className={`w-4 h-4 transition-colors ${
                        idea.isFavorite
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Title */}
                <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-indigo-300 transition-colors">
                  {idea.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {idea.description}
                </p>
              </div>

              {/* Bottom tag indicator */}
              <div className="pt-4 mt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-500">
                <span>Tailored for your aesthetic</span>
                {idea.isFavorite && (
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    ★ Shortlisted
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
