'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { EventForm } from '@/components/EventForm';
import { EventOverviewCard } from '@/components/EventOverviewCard';
import { BudgetSection } from '@/components/BudgetSection';
import { TimelineSection } from '@/components/TimelineSection';
import { VendorSection } from '@/components/VendorSection';
import { IdeasSection } from '@/components/IdeasSection';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { SavedEventsModal } from '@/components/SavedEventsModal';
import { Footer } from '@/components/Footer';
import { EventPlan, ApiKeyConfig, BudgetBreakdown, TimelineMilestone, VendorItem, PersonalizedIdea } from '@/types/event';
import confetti from 'canvas-confetti';
import { PieChart, Clock, Briefcase, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';

export default function Home() {
  const [activePlan, setActivePlan] = useState<EventPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<EventPlan[]>([]);
  const [apiConfig, setApiConfig] = useState<ApiKeyConfig>({ provider: 'mock' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [providerInfo, setProviderInfo] = useState<string>('Built-in Precision AI');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Active section tab
  const [activeSection, setActiveSection] = useState<'all' | 'budget' | 'timeline' | 'vendors' | 'ideas'>('all');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem('planvibe_api_config');
      if (storedConfig) {
        setApiConfig(JSON.parse(storedConfig));
      }

      const storedPlans = localStorage.getItem('planvibe_saved_plans');
      if (storedPlans) {
        const parsed = JSON.parse(storedPlans);
        setSavedPlans(parsed);
        if (parsed.length > 0 && !activePlan) {
          setActivePlan(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load local storage state:', e);
    }
  }, []);

  // Save plans to localStorage
  const persistPlans = (plans: EventPlan[]) => {
    setSavedPlans(plans);
    try {
      localStorage.setItem('planvibe_saved_plans', JSON.stringify(plans));
    } catch (e) {
      console.warn('Failed to save plans to localStorage:', e);
    }
  };

  const handleSaveApiConfig = (newConfig: ApiKeyConfig) => {
    setApiConfig(newConfig);
    try {
      localStorage.setItem('planvibe_api_config', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Failed to save API config:', e);
    }
  };

  const handleGeneratePlan = async (formData: {
    eventType: EventPlan['inputs']['eventType'];
    totalBudget: number;
    currency: string;
    guestCount: number;
    eventDate: string;
    location: string;
    preferences: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          apiConfig
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate event plan.');
      }

      const generatedPlan: EventPlan = data.plan;
      setActivePlan(generatedPlan);
      setProviderInfo(data.provider || 'Smart AI Engine');

      // Auto-save plan to list
      const updatedList = [generatedPlan, ...savedPlans.filter((p) => p.id !== generatedPlan.id)];
      persistPlans(updatedList);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      // Smooth scroll to top of overview
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Section update handlers to maintain local interactive state
  const handleUpdateBudget = (newBudget: BudgetBreakdown) => {
    if (!activePlan) return;
    const updated = { ...activePlan, budgetBreakdown: newBudget };
    setActivePlan(updated);
    const updatedList = savedPlans.map((p) => (p.id === updated.id ? updated : p));
    persistPlans(updatedList);
  };

  const handleUpdateTimeline = (newTimeline: TimelineMilestone[]) => {
    if (!activePlan) return;
    const updated = { ...activePlan, timeline: newTimeline };
    setActivePlan(updated);
    const updatedList = savedPlans.map((p) => (p.id === updated.id ? updated : p));
    persistPlans(updatedList);
  };

  const handleUpdateVendors = (newVendors: VendorItem[]) => {
    if (!activePlan) return;
    const updated = { ...activePlan, vendorChecklist: newVendors };
    setActivePlan(updated);
    const updatedList = savedPlans.map((p) => (p.id === updated.id ? updated : p));
    persistPlans(updatedList);
  };

  const handleUpdateIdeas = (newIdeas: PersonalizedIdea[]) => {
    if (!activePlan) return;
    const updated = { ...activePlan, personalizedIdeas: newIdeas };
    setActivePlan(updated);
    const updatedList = savedPlans.map((p) => (p.id === updated.id ? updated : p));
    persistPlans(updatedList);
  };

  const handleDeletePlan = (id: string) => {
    const remaining = savedPlans.filter((p) => p.id !== id);
    persistPlans(remaining);
    if (activePlan?.id === id) {
      setActivePlan(remaining[0] || null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onNewPlan={() => setActivePlan(null)}
        apiConfig={apiConfig}
        savedCount={savedPlans.length}
        hasActivePlan={!!activePlan}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between gap-3 text-sm animate-fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs uppercase font-bold px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switching: Form View vs Generated Plan View */}
        {!activePlan ? (
          <EventForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Back to New Event Bar */}
            <div className="flex items-center justify-between no-print">
              <button
                onClick={() => setActivePlan(null)}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Create New or Edit Event Parameters</span>
              </button>

              {/* Section Quick Navigation Tabs */}
              <div className="hidden md:flex bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
                {[
                  { id: 'all', label: 'All Modules' },
                  { id: 'budget', label: '📊 Budget' },
                  { id: 'timeline', label: '⏱️ Timeline' },
                  { id: 'vendors', label: '📋 Vendors' },
                  { id: 'ideas', label: '💡 Ideas & Decor' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as typeof activeSection)}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      activeSection === tab.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Hero Card */}
            <EventOverviewCard plan={activePlan} providerInfo={providerInfo} />

            {/* Budget Section */}
            {(activeSection === 'all' || activeSection === 'budget') && (
              <BudgetSection budget={activePlan.budgetBreakdown} onUpdateBudget={handleUpdateBudget} />
            )}

            {/* Timeline Section */}
            {(activeSection === 'all' || activeSection === 'timeline') && (
              <TimelineSection timeline={activePlan.timeline} onUpdateTimeline={handleUpdateTimeline} />
            )}

            {/* Vendor Checklist Section */}
            {(activeSection === 'all' || activeSection === 'vendors') && (
              <VendorSection vendors={activePlan.vendorChecklist} onUpdateVendors={handleUpdateVendors} />
            )}

            {/* Personalized Ideas Section */}
            {(activeSection === 'all' || activeSection === 'ideas') && (
              <IdeasSection ideas={activePlan.personalizedIdeas} onUpdateIdeas={handleUpdateIdeas} />
            )}
          </div>
        )}
      </main>

      {/* Global Modals */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={apiConfig}
        onSaveConfig={handleSaveApiConfig}
      />

      <SavedEventsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedPlans={savedPlans}
        activePlanId={activePlan?.id || null}
        onSelectPlan={(plan) => setActivePlan(plan)}
        onDeletePlan={handleDeletePlan}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
