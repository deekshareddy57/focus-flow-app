// app/page.tsx
"use client";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { TaskInput } from "@/components/dashboard/TaskInput";
import { DailyStats } from "@/components/dashboard/DailyStats";
import { Negotiator } from "@/components/negotiation/Negotiator";
import { FocusMode } from "@/components/dashboard/FocusMode";

import { useState } from "react";
// We will import our components here later
// import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      {/* 1. THE HEADER (Input Area) */}
      <header className="mx-auto max-w-5xl mb-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            FocusFlow
          </h1>
          <p className="text-slate-500">What is on your mind?</p>
          
          {/* Placeholder for the AI Input Component */}
          <TaskInput />
        </div>
      </header>

      {/* 2. THE MAIN WORKSPACE (Grid Layout) */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left: Kanban Board (Takes up 3 columns) */}
        <div className="lg:col-span-3 space-y-6">
        <KanbanBoard />
        </div>

        {/* Right: Analytics Sidebar (Takes up 1 column) */}
        <div className="space-y-6">
          {/* <div className="h-64 w-full rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-400">
            Daily Stats Placeholder
          </div>
          
          <div className="h-40 w-full rounded-xl border border-orange-100 bg-orange-50 flex items-center justify-center text-orange-400">
            Negotiator Alert Placeholder
          </div>*/}
          <DailyStats />
          <Negotiator />
          {/* Future Component: Analytics Panel */}
          {/* <AnalyticsPanel /> */}
        </div>
      </div>
      <FocusMode />
    </main>
  );
}