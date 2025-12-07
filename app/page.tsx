"use client";

import { useState } from "react";
import { TaskInput } from "@/components/dashboard/TaskInput";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { DailyStats } from "@/components/dashboard/DailyStats";
import { Negotiator } from "@/components/negotiation/Negotiator";
import { FocusMode } from "@/components/dashboard/FocusMode";
import { WeeklyView } from "@/components/dashboard/WeeklyView";
import { LayoutGrid, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// REMOVED: import { SignInButton... } from '@clerk/nextjs'; (We don't need this yet)

export default function Home() {
  const [view, setView] = useState<'planner' | 'weekly'>('planner');

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">

      {/* TOP NAVIGATION BAR */}
      <div className="mx-auto max-w-7xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          {/* Logo placeholder */}
        </div>

        {/* VIEW SWITCHER */}
        <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1">
          <button
            onClick={() => setView('planner')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              view === 'planner' ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Planner
          </button>
          <button
            onClick={() => setView('weekly')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              view === 'weekly' ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            Weekly
          </button>
        </div>
      </div>

      {/* HEADER (Input Area) */}
      <header className="mx-auto max-w-5xl mb-12 relative">
        {/* REMOVED: Login Buttons Section */}

        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            FocusFlow
          </h1>
          <p className="text-slate-500">What is on your mind?</p>
          <TaskInput />
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* LEFT: Main Content (Switches between Kanban and Weekly) */}
        <div className="lg:col-span-3 space-y-6">
          {view === 'planner' ? (
            <KanbanBoard />
          ) : (
            <WeeklyView />
          )}
        </div>

        {/* RIGHT: Analytics Sidebar (Always visible) */}
        <div className="space-y-6">
          <DailyStats />
          <Negotiator />
        </div>

      </div>

      <FocusMode />
    </main>
  );
}