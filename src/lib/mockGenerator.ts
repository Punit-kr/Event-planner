import { EventPlan, EventType } from '@/types/event';

interface GeneratorInputs {
  eventType: EventType;
  totalBudget: number;
  currency: string;
  guestCount: number;
  eventDate: string;
  location: string;
  preferences: string;
}

export function generateSmartEventPlan(inputs: GeneratorInputs): EventPlan {
  const { eventType, totalBudget, currency, guestCount, eventDate, location, preferences } = inputs;
  const prefLower = (preferences || '').toLowerCase();
  const locLower = (location || '').toLowerCase();

  // Color palettes tailored by vibe/type
  let colorPalette: string[] = ['#4F46E5', '#9333EA', '#F43F5E', '#F59E0B', '#10B981'];
  let themeTitle = '';
  let themeConcept = '';
  let summary = '';

  if (eventType === 'Wedding') {
    if (prefLower.includes('boho') || prefLower.includes('rustic') || prefLower.includes('garden')) {
      themeTitle = `Enchanted Botanical Wedding in ${location || 'Paradise'}`;
      themeConcept = 'Earthy elegance featuring pampas grass, cascading eucalyptus, warm fairy lighting, and antique brass accents.';
      colorPalette = ['#786452', '#A3B18A', '#DDA15E', '#FEFAE0', '#606C38'];
      summary = `An intimate, ethereal celebration designed for ${guestCount} guests, harmonizing botanical beauty with cozy acoustic warmth within a budget of ${currency} ${totalBudget.toLocaleString()}.`;
    } else if (prefLower.includes('modern') || prefLower.includes('minimal') || prefLower.includes('black tie')) {
      themeTitle = `Modern Luxe & Monochromatic Glamour`;
      themeConcept = 'Sleek architectural lines, mirrored surfaces, deep obsidian velvet, and sculptural white florals with champagne accents.';
      colorPalette = ['#1E1E24', '#F7F7F9', '#C5A880', '#6C757D', '#E2D4C9'];
      summary = `A high-end, sophisticated evening affair for ${guestCount} attendees in ${location || 'the city'}, blending refined dining with timeless modern luxury.`;
    } else if (prefLower.includes('royal') || locLower.includes('india') || prefLower.includes('traditional')) {
      themeTitle = `Regal Heritage & Marigold Splendor`;
      themeConcept = 'Opulent festive drapery, fresh jasmine and marigold florals, royal brass lanterns, and handcrafted artisanal decor.';
      colorPalette = ['#C81D25', '#F4A261', '#E76F51', '#2A9D8F', '#E9C46A'];
      summary = `A majestic cultural celebration for ${guestCount} cherished guests celebrating traditions, grand feasts, and vibrant live music in ${location || 'grand style'}.`;
    } else {
      themeTitle = `Golden Hour Romance Wedding`;
      themeConcept = 'Warm sunset tones, soft chiffon runners, amber candlelight, and lush garden roses reflecting timeless joy.';
      colorPalette = ['#D4A373', '#FAEDCD', '#E9D8A6', '#EE9B00', '#9B2226'];
      summary = `A heart-warming, unforgettable wedding crafted for ${guestCount} guests in ${location || 'your chosen destination'}, maximizing ambiance and joyful connection.`;
    }
  } else if (eventType === 'Birthday') {
    if (prefLower.includes('cyber') || prefLower.includes('neon') || prefLower.includes('retro')) {
      themeTitle = `Neon Horizon & Cyberpunk Glow 30th`;
      themeConcept = 'Electrifying neon light tubes, iridescent cocktail glassware, synthwave beats, and futuristic photo installations.';
      colorPalette = ['#FF007F', '#00F0FF', '#7928CA', '#111827', '#FBBF24'];
      summary = `An adrenaline-charged, ultra-photogenic bash for ${guestCount} friends in ${location || 'town'}, packed with glowing interactive stations and signature mocktails/cocktails.`;
    } else if (prefLower.includes('kid') || prefLower.includes('child') || prefLower.includes('play')) {
      themeTitle = `Carnival Wonder & Adventure Safari`;
      themeConcept = 'Playful pastel balloons, interactive craft stations, face-painting kiosks, and delicious custom sweet treats.';
      colorPalette = ['#38BDF8', '#F472B6', '#FBBF24', '#4ADE80', '#A78BFA'];
      summary = `A high-energy, memorable birthday bash tailored for ${guestCount} guests with safe, engaging activities and custom themed party favors.`;
    } else {
      themeTitle = `Milestone Champagne & Starlit Soirée`;
      themeConcept = 'Midnight sapphire backdrop, starlit canopy fairy lights, artisan grazing tables, and a bespoke acoustic lounge.';
      colorPalette = ['#1E293B', '#F59E0B', '#F1F5F9', '#818CF8', '#10B981'];
      summary = `A chic birthday celebration for ${guestCount} guests, elevating your special year with gourmet culinary pairings and magnetic entertainment.`;
    }
  } else {
    // Community Event
    if (prefLower.includes('green') || prefLower.includes('eco') || prefLower.includes('sustain')) {
      themeTitle = `${location || 'Community'} Eco-Roots & Harvest Fair`;
      themeConcept = 'Zero-waste artisan stalls, seed-paper signage, upcycled wooden displays, and locally grown food tastings.';
      colorPalette = ['#2D6A4F', '#52B788', '#D8F3DC', '#B7E4C7', '#74C69D'];
      summary = `A lively, purpose-driven sustainability gathering bringing together ${guestCount} neighbors with workshops, local vendors, and family fun.`;
    } else {
      themeTitle = `${location || 'Metro'} Community Unity & Arts Festival`;
      themeConcept = 'Open-air cultural stages, community collaborative mural walls, local artisan pop-ups, and interactive rhythm circles.';
      colorPalette = ['#4361EE', '#3A0CA3', '#7209B7', '#F72585', '#4CC9F0'];
      summary = `A high-impact community festival for ${guestCount} attendees celebrating local culture, neighborhood connections, and civic pride.`;
    }
  }

  // Budget category formulas
  const budgetCategories = [
    {
      category: 'Venue & Facilities',
      pct: 0.35,
      tips: `Negotiate weekday or off-peak hours in ${location || 'your area'}, or ask for complimentary AV equipment.`
    },
    {
      category: 'Catering & Beverages',
      pct: 0.28,
      tips: `Opt for curated tasting stations or family-style platters over plated 4-course dinners to save 15-20%.`
    },
    {
      category: 'Decor, Florals & Ambience',
      pct: 0.15,
      tips: `Repurpose ceremony florals into the reception or main hall, and prioritize mood lighting over single-use props.`
    },
    {
      category: 'Photography & Videography',
      pct: 0.10,
      tips: `Book a 6-hour package capturing key moments instead of all-day coverage, or hire a rising local talent.`
    },
    {
      category: 'Entertainment & Music',
      pct: 0.07,
      tips: `Combine a solo live acoustic musician for arrivals with a curated DJ playlist for the party segment.`
    },
    {
      category: 'Contingency & Miscellaneous',
      pct: 0.05,
      tips: `Keep 5% reserved for unexpected permits, last-minute guest additions, or weather contingency tents.`
    }
  ];

  const categories = budgetCategories.map((b, idx) => {
    const allocated = Math.round(totalBudget * b.pct);
    return {
      id: `cat-${idx + 1}`,
      category: b.category,
      allocatedAmount: allocated,
      percentage: Math.round(b.pct * 100),
      tipsToSave: b.tips
    };
  });

  // Timeline Milestones
  const timeline = [
    {
      id: 't-1',
      timeframe: '4-6 Months Before (Foundation)',
      tasks: [
        `Lock down the primary venue in ${location || 'your chosen city'} that accommodates ${guestCount} guests.`,
        `Finalize overall aesthetic, theme board, and color palette (${colorPalette.slice(0, 3).join(', ')}).`,
        `Send Save-the-Date notices to all ${guestCount} attendees.`,
        'Interview and shortlist core vendors (Catering, Lead Photographer).'
      ],
      completedTasks: []
    },
    {
      id: 't-2',
      timeframe: '2-3 Months Before (Vendors & Details)',
      tasks: [
        'Conduct menu tasting session with caterer and confirm dietary options (vegan, gluten-free).',
        'Book entertainment / DJ / Sound technician and provide music ' + (prefLower.includes('acoustic') ? 'acoustic playlist' : 'must-play list') + '.',
        'Design and order invitations, signage, and personalized party favors.',
        'Review permits or neighborhood noise clearance ordinances for ' + (location || 'venue') + '.'
      ],
      completedTasks: []
    },
    {
      id: 't-3',
      timeframe: '3-4 Weeks Before (Final Count)',
      tasks: [
        'Collect final RSVPs and lock in exact head count with the catering team.',
        'Finalize day-of master itinerary down to 15-minute increments.',
        'Order remaining decor accents, string lights, and seating cards.',
        'Confirm arrival and setup windows with all vendors.'
      ],
      completedTasks: []
    },
    {
      id: 't-4',
      timeframe: 'Week of Event (Final Run)',
      tasks: [
        'Pack the Event Day Emergency Kit (tapes, scissors, chargers, stain remover, safety pins).',
        'Do a tech run (mic checks, slide presentations, playlist cues).',
        'Prepare vendor cash tips/balance envelopes.',
        'Send logistical reminders (parking, dress code) to guests.'
      ],
      completedTasks: []
    },
    {
      id: 't-5',
      timeframe: 'Day of Event (Showtime!)',
      tasks: [
        'Morning venue walkthrough and decor inspection.',
        'Coordinate vendor arrival staggered schedule.',
        'Welcome guests and initiate opening activities.',
        'Relax and celebrate your unforgettable event!'
      ],
      completedTasks: []
    }
  ];

  // Dynamic Vendor Checklist
  const vendorChecklist = [
    {
      id: 'v-1',
      vendorType: 'Venue Coordinator / Manager',
      priority: 'High' as const,
      estimatedCost: `${currency} ${Math.round(totalBudget * 0.35).toLocaleString()}`,
      status: 'In Discussion' as const,
      questionsToAsk: [
        'What is the maximum curfew and sound limit regulation?',
        'Are outside caterers and decorators permitted without penalty fees?',
        `How many parking spaces are reserved for ${guestCount} guests?`,
        'What is your rain or inclement weather contingency plan?'
      ]
    },
    {
      id: 'v-2',
      vendorType: 'Head Chef / Catering Lead',
      priority: 'High' as const,
      estimatedCost: `${currency} ${Math.round(totalBudget * 0.28).toLocaleString()}`,
      status: 'Not Contacted' as const,
      questionsToAsk: [
        `What service styles work best for ${guestCount} guests within our budget?`,
        'Can you accommodate severe allergies and dietary restrictions?',
        'Do you provide service staff, bartenders, and table linens or just food?',
        'What is the policy on leftover food and vendor meals?'
      ]
    },
    {
      id: 'v-3',
      vendorType: 'Lead Photographer & Visuals',
      priority: 'High' as const,
      estimatedCost: `${currency} ${Math.round(totalBudget * 0.10).toLocaleString()}`,
      status: 'Not Contacted' as const,
      questionsToAsk: [
        'Have you shot events at this venue or in similar ambient lighting before?',
        'What is the turnaround time for sneak peeks vs full edited gallery?',
        'Do you bring backup cameras and secondary memory card writing?',
        'Can we provide a specific shot list of VIP guests and milestone moments?'
      ]
    },
    {
      id: 'v-4',
      vendorType: 'Floral & Decor Artisan',
      priority: 'Medium' as const,
      estimatedCost: `${currency} ${Math.round(totalBudget * 0.15).toLocaleString()}`,
      status: 'Not Contacted' as const,
      questionsToAsk: [
        'Which seasonal flowers align with our color palette to maximize volume and budget?',
        'Do you handle delivery, setup, and end-of-night strike down?',
        'Are candle flames allowed or do we need LED flameless candles?',
        'Can centerpieces be repurposed as take-home guest gifts?'
      ]
    },
    {
      id: 'v-5',
      vendorType: 'DJ / Live Music Entertainment',
      priority: 'Medium' as const,
      estimatedCost: `${currency} ${Math.round(totalBudget * 0.07).toLocaleString()}`,
      status: 'Not Contacted' as const,
      questionsToAsk: [
        'Do you provide your own sound equipment, wireless mics, and lighting rig?',
        'Can we submit a strict "Do Not Play" playlist?',
        'How do you read the room to manage dancefloor energy?',
        'Will you act as the master of ceremonies (MC) for announcements?'
      ]
    },
    {
      id: 'v-6',
      vendorType: 'Bespoke Baker / Cake & Dessert Studio',
      priority: 'Low' as const,
      estimatedCost: `${currency} ${Math.round(totalBudget * 0.03).toLocaleString()}`,
      status: 'Not Contacted' as const,
      questionsToAsk: [
        `How many servings are ideal for ${guestCount} guests alongside other desserts?`,
        'Do you offer tasting boxes prior to booking?',
        'Can you provide a sturdy cake stand or dessert riser props?'
      ]
    }
  ];

  // Personalized Ideas (categorized)
  const personalizedIdeas = [
    {
      id: 'idea-1',
      title: 'Interactive Audio Guestbook or Polarized Wall',
      category: 'Activity' as const,
      description: `Set up a vintage rotary telephone where guests leave audio voice messages, or an instant camera station where photos are clipped to a backlit grid with handwritten notes.`,
      isFavorite: true
    },
    {
      id: 'idea-2',
      title: 'Signature Welcome Cocktail & Mocktail Pairing',
      category: 'Food & Beverage' as const,
      description: `Craft two custom drinks named after significant memories or inside jokes, featuring edible glitter and fresh rosemary sprigs matching your color theme.`,
      isFavorite: false
    },
    {
      id: 'idea-3',
      title: 'Suspended Fairy Light & Botanical Chandelier',
      category: 'Decor' as const,
      description: `Draw eyes upward by draping warm micro-LED copper fairy lights intertwined with dried foliage and hanging glass orbs directly over the central gathering area.`,
      isFavorite: true
    },
    {
      id: 'idea-4',
      title: 'Late Night Gourmet Comfort Snack Bar',
      category: 'Food & Beverage' as const,
      description: `Surprise guests 1 hour before conclusion with mini artisanal sliders, warm churro bites, or gourmet truffle fries in branded paper cones.`,
      isFavorite: false
    },
    {
      id: 'idea-5',
      title: 'Live Acoustic Sunset Interlude',
      category: 'Activity' as const,
      description: `Transition the mood from daylight to evening with a 30-minute stripped-down acoustic guitar or cello rendition of modern favorite tunes.`,
      isFavorite: false
    },
    {
      id: 'idea-6',
      title: 'Personalized Wax-Sealed Place Cards',
      category: 'Decor' as const,
      description: `Individual handmade cardstock with calligraphy and customized wax seals in your primary palette shade, doubling as keepsake bookmarks.`,
      isFavorite: false
    }
  ];

  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    inputs,
    eventOverview: {
      title: themeTitle,
      themeConcept,
      suggestedColorPalette: colorPalette,
      summary,
      eventType,
      guestCount,
      location,
      eventDate
    },
    budgetBreakdown: {
      currency,
      totalBudget,
      categories
    },
    timeline,
    vendorChecklist,
    personalizedIdeas
  };
}
