"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Negotiator = () => {
  const { tasks } = useTaskStore();

  // 1. Calculate Total Estimated Time of "Active" tasks (Todo + In Progress)
  const activeTasks = tasks.filter(t => t.status !== 'done');
  const totalMinutes = activeTasks.reduce((acc, task) => acc + task.estimatedTime, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

  // 2. The Logic: Are we overloaded? (Threshold: > 5 hours for this demo)
  const isOverloaded = totalHours > 5;

  if (activeTasks.length === 0) return null; // Don't show if empty

  return (
    <div className={cn(
      "rounded-xl border p-5 transition-all",
      isOverloaded 
        ? "bg-orange-50 border-orange-100" // Warning State
        : "bg-green-50 border-green-100"   // Good State
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
            "p-2 rounded-full",
            isOverloaded ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
        )}>
           {isOverloaded ? <AlertTriangle className="h-5 w-5" /> : <div className="h-5 w-5 rounded-full border-2 border-current" />}
        </div>

        <div className="flex-1">
          <h4 className={cn(
              "font-semibold text-sm mb-1",
              isOverloaded ? "text-orange-800" : "text-green-800"
          )}>
            {isOverloaded ? "Workload High" : "On Track"}
          </h4>
          
          <p className={cn(
              "text-xs mb-3 leading-relaxed",
              isOverloaded ? "text-orange-600" : "text-green-600"
          )}>
            {isOverloaded 
              ? `You have ${totalHours} hours planned. That's a lot! Consider moving some tasks to tomorrow.` 
              : `You have ${totalHours} hours planned. A perfectly balanced day.`}
          </p>

          {isOverloaded && (
            <button className="text-xs font-medium bg-white border border-orange-200 text-orange-700 px-3 py-1.5 rounded-lg shadow-sm hover:bg-orange-50 flex items-center gap-1 transition-colors">
              Auto-Reschedule <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};