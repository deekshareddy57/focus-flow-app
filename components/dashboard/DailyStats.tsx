"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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
    { name: "Remaining", value: totalTasks - completedTasks, color: "#e2e8f0" } // Slate-200
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-slate-500 text-sm font-medium mb-4">Daily Focus</h3>

      <div className="flex items-center justify-between">
        
        {/* LEFT: The Donut Chart */}
        <div className="h-32 w-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Centered Text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-700">{progressPercentage}%</span>
          </div>
        </div>

        {/* RIGHT: The Metrics List */}
        <div className="space-y-4 flex-1 pl-4">
          
          {/* Metric 1: Tasks Done */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Target className="h-4 w-4 text-blue-400" />
              <span>Goal</span>
            </div>
            <span className="font-semibold text-slate-700">{completedTasks}/{totalTasks}</span>
          </div>

          {/* Metric 2: Streak (Gamification) */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Flame className="h-4 w-4 text-orange-400" />
              <span>Streak</span>
            </div>
            <span className="font-semibold text-slate-700">{stats.streakDays} days</span>
          </div>

          {/* Metric 3: Focus Time */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span>Focus</span>
            </div>
            <span className="font-semibold text-slate-700">
              {Math.round(stats.totalFocusTime / 60)}h
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};