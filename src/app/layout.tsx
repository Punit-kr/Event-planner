import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'PlanVibe AI — Generative Event Planning & Execution Suite',
  description:
    'AI-powered event planning assistant generating dynamic budgets, chronological timelines, vendor checklists, and bespoke decor concepts for weddings, birthdays, and community events.',
  keywords: [
    'event planning',
    'wedding planner',
    'ai event assistant',
    'birthday planning',
    'community event management',
    'event budget calculator',
    'vendor checklist'
  ],
  authors: [{ name: 'PlanVibe AI' }]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
