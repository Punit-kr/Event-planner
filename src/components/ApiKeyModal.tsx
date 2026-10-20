'use client';

import React, { useState } from 'react';
import { X, Key, CheckCircle2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { ApiKeyConfig } from '@/types/event';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiKeyConfig;
  onSaveConfig: (config: ApiKeyConfig) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [provider, setProvider] = useState<'mock' | 'openai' | 'anthropic' | 'gemini'>(config.provider || 'mock');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [model, setModel] = useState(config.model || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      provider,
      apiKey: apiKey.trim(),
      model: model.trim() || undefined
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Engine & Provider Settings</h3>
              <p className="text-xs text-slate-400">Configure your generative LLM backend</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Select AI Engine
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'mock', name: 'Built-in Precision AI', badge: 'Zero Setup', desc: 'Instant & Realistic' },
                { id: 'openai', name: 'OpenAI', badge: 'GPT-4o', desc: 'Requires API key' },
                { id: 'anthropic', name: 'Anthropic Claude', badge: '3.5 Sonnet', desc: 'Requires API key' },
                { id: 'gemini', name: 'Google Gemini', badge: '1.5 Flash', desc: 'Requires API key' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setProvider(item.id as typeof provider)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    provider === item.id
                      ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs sm:text-sm text-slate-200">{item.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional API Key Input */}
          {provider !== 'mock' && (
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {provider === 'openai' ? 'OpenAI Secret Key' : provider === 'anthropic' ? 'Anthropic API Key' : 'Gemini API Key'}
                  </label>
                  <span className="text-[11px] text-indigo-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Stored locally in browser
                  </span>
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={
                    provider === 'openai' ? 'sk-...' : provider === 'anthropic' ? 'sk-ant-...' : 'AIzaSy...'
                  }
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Model Override (Optional)
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={
                    provider === 'openai' ? 'gpt-4o-mini (default)' : provider === 'anthropic' ? 'claude-3-5-sonnet-20241022' : 'gemini-1.5-flash'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm font-mono"
                />
              </div>
            </div>
          )}

          {provider === 'mock' && (
            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
              <div>
                <strong className="text-white block mb-0.5">Zero-Key Precision AI Engine Enabled</strong>
                Generates comprehensive, tailored, location-aware event blueprints instantaneously with budget math, timelines, and dynamic checklists without requiring external paid API tokens.
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs sm:text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
