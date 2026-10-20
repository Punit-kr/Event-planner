import { NextRequest, NextResponse } from 'next/server';
import { generateSmartEventPlan } from '@/lib/mockGenerator';
import { EventPlan, EventType } from '@/types/event';

const SYSTEM_PROMPT = `You are a world-class certified Master Event Planner, Financial Event Strategist, and Creative Director.
Your task is to generate a comprehensive, highly dynamic, hyper-personalized planning blueprint for an event.

You MUST respond strictly with valid JSON conforming exactly to this structure (no markdown fences, no explanatory text outside the JSON):
{
  "eventOverview": {
    "title": "String",
    "themeConcept": "String",
    "suggestedColorPalette": ["HexColorString1", "HexColorString2", "HexColorString3", "HexColorString4", "HexColorString5"],
    "summary": "String"
  },
  "budgetBreakdown": {
    "currency": "String",
    "totalBudget": 0,
    "categories": [
      {
        "category": "String (e.g. Venue & Facilities, Catering & Bar, Decor & Floral, Photography & Video, Entertainment & Music, Attire/Favors, Contingency)",
        "allocatedAmount": 0,
        "percentage": 0,
        "tipsToSave": "String"
      }
    ]
  },
  "timeline": [
    {
      "timeframe": "String (e.g. 6 Months Before, 3 Months Before, 1 Month Before, Week Of, Day of Event)",
      "tasks": ["String", "String", "String"]
    }
  ],
  "vendorChecklist": [
    {
      "vendorType": "String",
      "priority": "High | Medium | Low",
      "questionsToAsk": ["String", "String", "String"],
      "estimatedCost": "String"
    }
  ],
  "personalizedIdeas": [
    {
      "title": "String",
      "description": "String",
      "category": "Activity | Decor | Food & Beverage"
    }
  ]
}

Guidelines:
- Provide 5 to 7 realistic budget categories that sum to approximately the total budget.
- Provide 4 to 6 timeline phases ordered chronologically with concrete action items.
- Provide 5 to 7 critical vendors with sharp, probing questions to ask before hiring.
- Provide 6 creative personalized ideas split across Activity, Decor, and Food & Beverage.
- Ensure all suggestions are tailored deeply to the event type, budget, guest count, location cultural nuances, and custom vibe preferences.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventType,
      totalBudget,
      currency = '$',
      guestCount,
      eventDate,
      location,
      preferences,
      apiConfig
    } = body;

    if (!eventType || !totalBudget || !guestCount) {
      return NextResponse.json(
        { error: 'Missing required fields: eventType, totalBudget, and guestCount are required.' },
        { status: 400 }
      );
    }

    const provider = apiConfig?.provider || 'auto';
    const clientKey = apiConfig?.apiKey?.trim();

    // Check for OpenAI
    const openAiKey = clientKey && provider === 'openai' ? clientKey : process.env.OPENAI_API_KEY;
    // Check for Anthropic
    const anthropicKey = clientKey && provider === 'anthropic' ? clientKey : process.env.ANTHROPIC_API_KEY;
    // Check for Gemini
    const geminiKey = clientKey && provider === 'gemini' ? clientKey : process.env.GEMINI_API_KEY;

    let aiResult: Partial<EventPlan> | null = null;
    let usedProvider = 'Smart AI Engine';

    const userPrompt = `Generate a complete event plan with these specifications:
- Event Type: ${eventType}
- Total Budget: ${currency} ${Number(totalBudget).toLocaleString()}
- Currency: ${currency}
- Guest Count: ${guestCount} attendees
- Event Date / Target Timeline: ${eventDate || 'Flexible'}
- Location / City: ${location || 'Unspecified'}
- Specific Vibe & Preferences: ${preferences || 'Creative, memorable, and well-organized'}
`;

    // Try OpenAI if requested or if key exists
    if ((provider === 'openai' && openAiKey) || (provider === 'auto' && openAiKey)) {
      try {
        const model = apiConfig?.model || 'gpt-4o-mini';
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
            model: model,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            aiResult = JSON.parse(content);
            usedProvider = `OpenAI (${model})`;
          }
        }
      } catch (err) {
        console.warn('OpenAI call failed, falling back to smart engine', err);
      }
    }

    // Try Anthropic if requested or if key exists
    if (!aiResult && ((provider === 'anthropic' && anthropicKey) || (provider === 'auto' && anthropicKey))) {
      try {
        const model = apiConfig?.model || 'claude-3-5-sonnet-20241022';
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: model,
            max_tokens: 4000,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userPrompt }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const textBlock = data.content?.find((c: { type: string; text?: string }) => c.type === 'text');
          if (textBlock?.text) {
            // Clean any potential markdown wrapping
            let cleaned = textBlock.text.trim();
            if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
            aiResult = JSON.parse(cleaned);
            usedProvider = `Anthropic (${model})`;
          }
        }
      } catch (err) {
        console.warn('Anthropic call failed, falling back to smart engine', err);
      }
    }

    // Try Gemini if requested or if key exists
    if (!aiResult && ((provider === 'gemini' && geminiKey) || (provider === 'auto' && geminiKey))) {
      try {
        const model = apiConfig?.model || 'gemini-1.5-flash';
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            aiResult = JSON.parse(candidateText);
            usedProvider = `Google Gemini (${model})`;
          }
        }
      } catch (err) {
        console.warn('Gemini call failed, falling back to smart engine', err);
      }
    }

    // Fallback: If no AI key or API calls failed, use our smart generator
    if (!aiResult || !aiResult.eventOverview || !aiResult.budgetBreakdown) {
      const smartPlan = generateSmartEventPlan({
        eventType: eventType as EventType,
        totalBudget: Number(totalBudget),
        currency,
        guestCount: Number(guestCount),
        eventDate: eventDate || '',
        location: location || '',
        preferences: preferences || ''
      });
      return NextResponse.json({
        plan: smartPlan,
        isAiGenerated: false,
        provider: 'Precision Smart AI Engine (Zero-Key Mode)'
      });
    }

    // Ensure IDs and structure integrity
    const completePlan: EventPlan = {
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      inputs: {
        eventType: eventType as EventType,
        totalBudget: Number(totalBudget),
        currency,
        guestCount: Number(guestCount),
        eventDate: eventDate || '',
        location: location || '',
        preferences: preferences || ''
      },
      eventOverview: {
        title: aiResult.eventOverview?.title || `${eventType} Celebration`,
        themeConcept: aiResult.eventOverview?.themeConcept || '',
        suggestedColorPalette: aiResult.eventOverview?.suggestedColorPalette || ['#6366F1', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'],
        summary: aiResult.eventOverview?.summary || '',
        eventType: eventType as EventType,
        guestCount: Number(guestCount),
        location: location || '',
        eventDate: eventDate || ''
      },
      budgetBreakdown: {
        currency: aiResult.budgetBreakdown?.currency || currency,
        totalBudget: Number(aiResult.budgetBreakdown?.totalBudget || totalBudget),
        categories: (aiResult.budgetBreakdown?.categories || []).map((cat, idx) => ({
          id: `cat-${idx + 1}`,
          category: cat.category,
          allocatedAmount: Number(cat.allocatedAmount || 0),
          percentage: Number(cat.percentage || 0),
          tipsToSave: cat.tipsToSave || ''
        }))
      },
      timeline: (aiResult.timeline || []).map((item, idx) => ({
        id: `t-${idx + 1}`,
        timeframe: item.timeframe,
        tasks: item.tasks || [],
        completedTasks: []
      })),
      vendorChecklist: (aiResult.vendorChecklist || []).map((v, idx) => ({
        id: `v-${idx + 1}`,
        vendorType: v.vendorType,
        priority: (['High', 'Medium', 'Low'].includes(v.priority) ? v.priority : 'Medium') as 'High' | 'Medium' | 'Low',
        questionsToAsk: v.questionsToAsk || [],
        estimatedCost: v.estimatedCost || `${currency} 0`,
        status: 'Not Contacted' as const
      })),
      personalizedIdeas: (aiResult.personalizedIdeas || []).map((p, idx) => ({
        id: `idea-${idx + 1}`,
        title: p.title,
        description: p.description,
        category: (['Activity', 'Decor', 'Food & Beverage'].includes(p.category) ? p.category : 'Decor') as 'Activity' | 'Decor' | 'Food & Beverage',
        isFavorite: false
      }))
    };

    return NextResponse.json({
      plan: completePlan,
      isAiGenerated: true,
      provider: usedProvider
    });
  } catch (error) {
    console.error('Error generating event plan:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while generating the event plan.' },
      { status: 500 }
    );
  }
}
