# PlanVibe AI — Generative AI Event Planning Assistant 🥂✨

**PlanVibe AI** is a production-ready, full-stack Generative AI-powered Event Planning web application built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **TypeScript**. It empowers organizers to plan three distinct types of events seamlessly:
1. 💍 **Weddings** (Intimate, Modern Luxe, Boho Chic, Royal Heritage, Destination)
2. 🎂 **Birthdays** (Milestone Soirées, Neon/Cyberpunk, Kids Safaris, Themed Bashes)
3. 🌍 **Community Events** (Sustainability Fairs, Arts Festivals, Civic Celebrations)

---

## 🌟 Key Features

### 1. 📥 Intuitive & Adaptive Event Form
- **Event Type Selection**: Wedding, Birthday, or Community Event with custom aesthetic badges.
- **Dynamic Currency & Budget**: Multi-currency selector (USD `$`, EUR `€`, GBP `£`, INR `₹`, AUD `A$`, CAD `C$`, JPY `¥`) with quick budget increments.
- **Guest Count Gauge**: Interactive range slider and numerical input from intimate gatherings (5+) to grand festivals (1,000+).
- **Target Timeline & Location**: Context-aware inputs for localized pricing and cultural nuances.
- **1-Click Starter Presets**: Instant load presets (e.g., *✨ Tuscan Sunset Wedding*, *🎉 Neon Horizon 30th*, *🌱 Eco-Roots Community Fair*).
- **Interactive Vibe Chips**: 1-click aesthetic tags to easily customize theme and ambiance.

### 2. 🧠 Hybrid Generative AI Engine
- **Multi-Provider Architecture**: Supports **OpenAI** (`gpt-4o`, `gpt-4o-mini`), **Anthropic** (`claude-3-5-sonnet`), and **Google Gemini** (`gemini-1.5-flash`).
- **Zero-Key Precision AI Mode**: Built-in intelligent engine generating realistic, localized, schema-compliant event plans out-of-the-box without requiring an external paid key.
- **Strict JSON Output Guarantee**: Enforces structured schemas for guaranteed data consistency.

### 3. 📊 Interactive & Categorized Budget Breakdown
- **Real-Time Sliders**: Adjust category allocations live with instant recalculation of percentage shares.
- **Visual Distribution Bar**: Multi-colored stacked progress bar showing proportional category spending.
- **Over/Under Budget Alerts & Auto-Fit**: Alerts when spending exceeds budget with 1-click auto-rebalance.
- **Pro Cost-Saving Tips**: Tailored advice for each category.
- **Custom Category Creation**: Add or remove custom budget line items on the fly.

### 4. ⏱️ Chronological Timelines & Milestones
- **Phase-Grouped Roadmaps**: Ordered from 4-6 months before down to the Day of Event.
- **Interactive Checklists**: Check off completed tasks to update phase and overall readiness progress bars.
- **Celebration Effects**: Confetti burst on completing milestones.
- **Custom Task Insertion**: Add custom action items to any phase.

### 5. 📋 Dynamic Vendor Checklist & Briefings
- **Urgency Filtering**: Filter vendors by `High`, `Medium`, or `Low` priority.
- **Status Tracking**: Track vendors as `Not Contacted`, `In Discussion`, or `Booked`.
- **1-Click Interview Email Generator**: Copies a professionally drafted inquiry email with critical vetting questions to the clipboard.
- **Custom Vendor Management**: Add your own specialty vendors with custom questions and cost estimates.

### 6. 💡 Curated Themes, Decor & Itinerary Ideas
- **Category Filter**: Activity, Decor, and Food & Beverage.
- **Shortlisting**: Star favorite concepts to pin them to the top.
- **Color Palette Swatches**: Visual color swatches with 1-click HEX code copying.
- **Custom Idea Insertion**: Add personalized touches directly to the idea board.

### 7. 📄 Executive PDF Export & Print Brief
- **PDF Generation**: Generates clean, formatted multi-page event briefs via `jspdf`.
- **Browser Print View**: Custom `@media print` stylesheets for paper/PDF printing.

### 8. 💾 Local State & Plan Management
- **Persistent Plans**: All generated and customized plans save locally to `localStorage`.
- **Plan Manager**: Switch between saved events, duplicate, or delete anytime.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
\`\`\`bash
cd event-planner
npm install
\`\`\`

### Running the Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
\`\`\`bash
npm run build
npm run start
\`\`\`

---

## 🔑 AI Configuration (Optional)
PlanVibe AI works completely out of the box using its **Zero-Key Precision AI Engine**. If you wish to connect your own LLM provider:
1. Click the **Key icon / Provider Badge** in the top navigation.
2. Select your provider (**OpenAI**, **Anthropic**, or **Google Gemini**).
3. Enter your API key and save. Keys are stored locally in your browser and never sent to third parties.
