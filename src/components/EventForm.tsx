'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Heart,
  Cake,
  Globe,
  Sliders,
  Flame,
  ArrowRight,
  Loader2,
  Check
} from 'lucide-react';
import { EventType } from '@/types/event';

interface EventFormProps {
  onSubmit: (formData: {
    eventType: EventType;
    totalBudget: number;
    currency: string;
    guestCount: number;
    eventDate: string;
    location: string;
    preferences: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const PRESET_TEMPLATES = [
  {
    title: '✨ Tuscan Sunset Wedding',
    eventType: 'Wedding' as EventType,
    currency: '$',
    totalBudget: 35000,
    guestCount: 120,
    eventDate: 'In 6 months',
    location: 'Florence, Italy',
    preferences: 'Golden hour outdoor terrace, warm fairy lights, olive foliage, live string quartet, organic farm-to-table dinner, rustic chic vibes.'
  },
  {
    title: '🎉 Neon Horizon 30th Birthday',
    eventType: 'Birthday' as EventType,
    currency: '$',
    totalBudget: 6500,
    guestCount: 45,
    eventDate: 'Next month',
    location: 'Austin, Texas',
    preferences: 'Synthwave / Cyberpunk neon lighting, signature iridescent cocktails, custom DJ synth set, late-night gourmet food truck sliders, retro photo booth.'
  },
  {
    title: '🌱 Eco-Roots Community Fair',
    eventType: 'Community Event' as EventType,
    currency: '₹',
    totalBudget: 450000,
    guestCount: 350,
    eventDate: 'In 2 months',
    location: 'Bangalore, India',
    preferences: 'Zero-waste policy, local organic artisan stalls, solar-powered acoustic stage, kid-friendly seed-planting workshops, compostable serveware.'
  }
];

const VIBE_PILLS = [
  'Boho Chic & Pampas',
  'Modern Minimalist',
  'Black Tie Glamour',
  'Neon Cyberpunk',
  'Eco-Friendly Zero Waste',
  'Rustic Garden Romance',
  'Royal Heritage & Marigold',
  'Live Acoustic Lounge',
  'Gourmet Tasting Menu',
  'Interactive Photo Booths'
];

export const EventForm: React.FC<EventFormProps> = ({ onSubmit, isLoading }) => {
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [currency, setCurrency] = useState('$');
  const [totalBudget, setTotalBudget] = useState<number>(20000);
  const [guestCount, setGuestCount] = useState<number>(80);
  const [eventDate, setEventDate] = useState('In 4 months');
  const [location, setLocation] = useState('San Francisco, CA');
  const [preferences, setPreferences] = useState(
    'Warm sunset ambience, acoustic background melodies, seasonal locally sourced dinner, elegant floral arch.'
  );

  const applyPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    setEventType(preset.eventType);
    setCurrency(preset.currency);
    setTotalBudget(preset.totalBudget);
    setGuestCount(preset.guestCount);
    setEventDate(preset.eventDate);
    setLocation(preset.location);
    setPreferences(preset.preferences);
  };

  const toggleVibePill = (pill: string) => {
    if (preferences.includes(pill)) {
      // Remove it
      setPreferences(preferences.replace(pill, '').replace(/,\s*,/g, ',').trim());
    } else {
      // Append it
      const updated = preferences.trim() ? `${preferences.trim()}, ${pill}` : pill;
      setPreferences(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      eventType,
      totalBudget: Number(totalBudget),
      currency,
      guestCount: Number(guestCount),
      eventDate,
      location,
      preferences
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hero Welcome */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generative AI Event Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Design Your Perfect Event in Seconds
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          From budget math and chronological timelines to vendor questions and custom aesthetic ideas—crafted instantly by AI.
        </p>

        {/* 1-Click Quick Presets */}
        <div className="pt-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 mb-2.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Try 1-Click Starter Presets:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PRESET_TEMPLATES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-sm"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Glass Form Card */}
      <form
        onSubmit={handleSubmit}
        className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden space-y-6"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Event Type Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            1. Select Event Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: 'Wedding' as EventType, icon: Heart, label: 'Wedding', desc: 'Nuance & Romance', color: 'from-pink-500 to-rose-600' },
              { type: 'Birthday' as EventType, icon: Cake, label: 'Birthday', desc: 'Milestones & Vibes', color: 'from-amber-500 to-orange-600' },
              { type: 'Community Event' as EventType, icon: Globe, label: 'Community', desc: 'Festivals & Causes', color: 'from-emerald-500 to-teal-600' }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = eventType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setEventType(item.type)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/15'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {isSelected && (
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isSelected
                          ? `bg-gradient-to-tr ${item.color} text-white shadow-md`
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-sm sm:text-base text-white">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Budget & Guest Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Budget */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              2. Total Budget
            </label>
            <div className="flex rounded-xl bg-slate-950 border border-slate-800 overflow-hidden focus-within:border-indigo-500">
              {/* Currency selector */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-900 px-3 py-3 text-sm font-bold text-indigo-400 border-r border-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₹">INR (₹)</option>
                <option value="A$">AUD (A$)</option>
                <option value="C$">CAD (C$)</option>
                <option value="¥">JPY (¥)</option>
              </select>
              <input
                type="number"
                min="0"
                step="any"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                required
                className="w-full px-4 py-3 bg-transparent text-white text-base font-bold focus:outline-none placeholder-slate-600"
                placeholder="20,000"
              />
            </div>
            {/* Quick budget increments */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              <span className="text-[11px] text-slate-500">Quick:</span>
              {[5000, 15000, 30000, 60000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTotalBudget(amt)}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                >
                  {currency}{amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>
          </div>

          {/* Guest Count */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Estimated Guest Count
              </label>
              <span className="text-sm font-bold text-indigo-400">{guestCount} Guests</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="1000"
                step="5"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <input
                type="number"
                min="1"
                step="1"
                max="10000"
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
                className="w-20 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-center text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Intimate (10-30)</span>
              <span>Medium (50-150)</span>
              <span>Grand (200+)</span>
            </div>
          </div>
        </div>

        {/* 3. Date & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date / Timeline */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              4. Event Date / Timeline
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="e.g. In 4 months or 2026-12-15"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm font-medium"
              />
            </div>
            <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
              {['Next Month', 'In 3 Months', 'In 6 Months', 'Next Year'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEventDate(t)}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Location / City */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              5. Location / City & Country
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Paris, France or Mumbai, India"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Used for localized pricing, climate recommendations, and vendor standards.
            </p>
          </div>
        </div>

        {/* 4. Preferences & Vibe */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              6. Preferences, Aesthetic Vibe & Special Notes
            </label>
            <span className="text-[11px] text-slate-500">Click chips to append</span>
          </div>

          {/* Vibe Chips */}
          <div className="flex flex-wrap gap-1.5">
            {VIBE_PILLS.map((pill) => {
              const active = preferences.includes(pill);
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => toggleVibePill(pill)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    active
                      ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {active ? `✓ ${pill}` : `+ ${pill}`}
                </button>
              );
            })}
          </div>

          {/* Free text area */}
          <textarea
            rows={3}
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Share specific dreams, dietary restrictions, indoor/outdoor preferences, color palettes, or cultural rituals..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm leading-relaxed"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Crafting Your Comprehensive Event Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Generate Complete AI Event Plan</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
