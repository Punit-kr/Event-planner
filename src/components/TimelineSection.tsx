'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Filter,
  CheckCheck,
  Sparkles
} from 'lucide-react';
import { TimelineMilestone } from '@/types/event';
import confetti from 'canvas-confetti';

interface TimelineSectionProps {
  timeline: TimelineMilestone[];
  onUpdateTimeline: (updatedTimeline: TimelineMilestone[]) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline, onUpdateTimeline }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [addingTaskForId, setAddingTaskForId] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState('');

  // Overall completion stats
  const totalTasks = timeline.reduce((acc, m) => acc + (m.tasks?.length || 0), 0);
  const totalCompleted = timeline.reduce((acc, m) => acc + (m.completedTasks?.length || 0), 0);
  const overallProgress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const handleToggleTask = (milestoneIndex: number, task: string) => {
    const updated = [...timeline];
    const milestone = updated[milestoneIndex];
    const completed = new Set(milestone.completedTasks || []);

    if (completed.has(task)) {
      completed.delete(task);
    } else {
      completed.add(task);
      // Small celebratory burst if milestone hits 100%
      if (completed.size === milestone.tasks.length) {
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {
          // ignore
        }
      }
    }

    milestone.completedTasks = Array.from(completed);
    onUpdateTimeline(updated);
  };

  const handleAddTask = (milestoneIndex: number) => {
    if (!newTaskText.trim()) return;
    const updated = [...timeline];
    updated[milestoneIndex].tasks.push(newTaskText.trim());
    onUpdateTimeline(updated);
    setNewTaskText('');
    setAddingTaskForId(null);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold text-white">Chronological Timeline & Milestones</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track execution phase-by-phase. Click tasks as you complete them to track your event readiness.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'pending', 'completed'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                  filter === t
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Progress Gauge */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-slate-400">Overall Planning Progress</span>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              {totalCompleted} of {totalTasks} Completed
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {overallProgress === 100
              ? '🎉 All milestones finished! You are 100% ready for showtime.'
              : 'Keep checking off milestones as your event date draws closer.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-36 sm:w-48 h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-sm font-extrabold text-white min-w-[40px] text-right font-mono">
            {overallProgress}%
          </span>
        </div>
      </div>

      {/* Chronological Phases */}
      <div className="space-y-4">
        {timeline.map((milestone, mIdx) => {
          const completedSet = new Set(milestone.completedTasks || []);
          const phaseTotal = milestone.tasks.length;
          const phaseDone = completedSet.size;
          const isPhaseDone = phaseTotal > 0 && phaseDone === phaseTotal;

          const visibleTasks = milestone.tasks.filter((task) => {
            if (filter === 'completed') return completedSet.has(task);
            if (filter === 'pending') return !completedSet.has(task);
            return true;
          });

          return (
            <div
              key={milestone.id || mIdx}
              className={`p-5 rounded-2xl border transition-all ${
                isPhaseDone
                  ? 'bg-slate-950/40 border-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              {/* Phase Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                    {mIdx + 1}
                  </span>
                  <h4 className="font-bold text-white text-sm sm:text-base">{milestone.timeframe}</h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">
                    {phaseDone}/{phaseTotal} Tasks
                  </span>
                  <button
                    onClick={() => setAddingTaskForId(milestone.id || `${mIdx}`)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Add custom task to this milestone"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2">
                {visibleTasks.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-1">No tasks matching current filter.</p>
                ) : (
                  visibleTasks.map((task, tIdx) => {
                    const isChecked = completedSet.has(task);
                    return (
                      <div
                        key={tIdx}
                        onClick={() => handleToggleTask(mIdx, task)}
                        className={`p-2.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-400'
                            : 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-900 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 hover:text-indigo-400" />
                          )}
                        </div>
                        <span
                          className={`text-xs sm:text-sm leading-relaxed ${
                            isChecked ? 'line-through text-slate-400' : 'text-slate-200'
                          }`}
                        >
                          {task}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add Custom Task Input */}
              {addingTaskForId === (milestone.id || `${mIdx}`) && (
                <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-2">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Type custom task description..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask(mIdx)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddTask(mIdx)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setAddingTaskForId(null)}
                    className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
