export type EventType = 'Wedding' | 'Birthday' | 'Community Event';

export interface BudgetCategory {
  id?: string;
  category: string;
  allocatedAmount: number;
  percentage: number;
  tipsToSave: string;
}

export interface BudgetBreakdown {
  currency: string;
  totalBudget: number;
  categories: BudgetCategory[];
}

export interface TimelineMilestone {
  id?: string;
  timeframe: string;
  tasks: string[];
  completedTasks?: string[];
}

export interface VendorItem {
  id?: string;
  vendorType: string;
  priority: 'High' | 'Medium' | 'Low';
  questionsToAsk: string[];
  estimatedCost: string;
  status?: 'Not Contacted' | 'In Discussion' | 'Booked';
  notes?: string;
}

export interface PersonalizedIdea {
  id?: string;
  title: string;
  description: string;
  category: 'Activity' | 'Decor' | 'Food & Beverage';
  isFavorite?: boolean;
}

export interface EventOverview {
  title: string;
  themeConcept: string;
  suggestedColorPalette: string[];
  summary: string;
  eventType?: EventType;
  guestCount?: number;
  location?: string;
  eventDate?: string;
}

export interface EventPlan {
  id: string;
  createdAt: string;
  inputs: {
    eventType: EventType;
    totalBudget: number;
    currency: string;
    guestCount: number;
    eventDate: string;
    location: string;
    preferences: string;
  };
  eventOverview: EventOverview;
  budgetBreakdown: BudgetBreakdown;
  timeline: TimelineMilestone[];
  vendorChecklist: VendorItem[];
  personalizedIdeas: PersonalizedIdea[];
}

export interface ApiKeyConfig {
  provider: 'mock' | 'openai' | 'anthropic' | 'gemini';
  apiKey?: string;
  model?: string;
}
