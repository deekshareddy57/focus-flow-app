"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Trophy, Flame, Target } from "lucide-react";

export const DailyStats = () => {
  const { stats, tasks } = useTaskStore();

  // 1. Calculate Real Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
  // Data for the Donut Chart
  const data = [
    { name: "Completed", value: completedTasks, color: "#3b82f6" }, // Blue-500
    { name: "Remaining", value: Math.max(totalTasks - completedTasks, 0), color: "#e2e8f0" } // Slate-200
  ];

  // Prevent empty chart if 0 tasks
  if (totalTasks === 0) {
      data[1].value = 1; // Show empty grey ring
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
      <h3 className="text-slate-500 text-sm font-medium mb-2">Daily Focus</h3>

      <div className="flex items-center gap-4">
        
        {/* LEFT: The Donut Chart */}
        <div className="relative flex-shrink-0">
            <div className="h-28 w-28 relative flex items-center justify-center">
                <PieChart width={112} height={112}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip cursor={false} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
            
                {/* Centered Text inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-slate-700">{progressPercentage}%</span>
                </div>
            </div>
        </div>

        {/* RIGHT: The Metrics List */}
        <div className="flex-1 space-y-3 min-w-0">
          
          {/* Metric 1: Goal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Target className="h-4 w-4 text-blue-500" />
              <span>Goal</span>
            </div>
            <span className="font-semibold text-slate-700 text-sm">{completedTasks}/{totalTasks}</span>
          </div>

          {/* Metric 2: Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>Streak</span>
            </div>
            <span className="font-semibold text-slate-700 text-sm flex items-baseline gap-0.5">
                {stats.streakDays} <span className="text-[10px] text-slate-400 font-normal">days</span>
            </span>
          </div>

          {/* Metric 3: Focus Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Focus</span>
            </div>
            <span className="font-semibold text-slate-700 text-sm flex items-baseline gap-0.5">
                {Math.round(stats.totalFocusTime / 60)} <span className="text-[10px] text-slate-400 font-normal">h</span>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};