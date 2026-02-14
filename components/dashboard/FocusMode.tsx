"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { useEffect, useState } from "react";
import { X, CheckCircle, Pause, Play, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const FocusMode = () => {
  const { isFocusMode, setIsFocusMode, activeTaskId, tasks, completeTask } = useTaskStore();
  
  const activeTask = tasks.find(t => t.id === activeTaskId);
  
  // Local state for the timer
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isActive, setIsActive] = useState(false);

  // Sync timer when task changes
  useEffect(() => {
    if (activeTask) {
      // Only reset if we are starting fresh (optional optimization could be added here)
      // For now, simple sync:
      if (!isActive) setTimeLeft(activeTask.estimatedTime * 60);
    }
  }, [activeTask, isActive]); // Added isActive to dependency to prevent reset while running

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    if (activeTaskId) completeTask(activeTaskId);
    setIsFocusMode(false);
    setIsActive(false);
  };

  if (!activeTask) return null;

  // --- MINI PLAYER VIEW (When Focus Mode is OFF but Task is Selected) ---
  if (!isFocusMode) {
    return (
        <div className="fixed bottom-6 right-6 z-40 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 w-80 animate-in slide-in-from-bottom-10 fade-in duration-300 flex items-center gap-4">
            <button 
                onClick={() => setIsActive(!isActive)}
                className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-all",
                    isActive ? "bg-slate-100 text-slate-600" : "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                )}
            >
                {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>

            <div className="flex-1 min-w-0" onClick={() => setIsFocusMode(true)}>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Focusing</p>
                <p className="text-sm font-semibold text-slate-700 truncate cursor-pointer hover:text-blue-600 transition-colors">
                    {activeTask.title}
                </p>
            </div>

            <div className="text-right">
                <p className="text-lg font-mono font-medium text-slate-900 tabular-nums leading-none">{formatTime(timeLeft)}</p>
            </div>

            <button onClick={() => setIsFocusMode(true)} className="text-slate-300 hover:text-blue-500 transition-colors">
                <Maximize2 className="h-4 w-4" />
            </button>
        </div>
    );
  }

  // --- FULL SCREEN VIEW ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-xl transition-all duration-700 animate-in fade-in zoom-in-95">
      
      <button 
        onClick={() => setIsFocusMode(false)}
        className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all z-50"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl px-4">
        <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wider uppercase">
                Deep Work Session
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
                {activeTask.title}
            </h1>
        </div>

        <div className="text-[120px] font-light text-slate-900 font-mono tracking-tighter tabular-nums leading-none">
            {formatTime(timeLeft)}
        </div>

        <div className="flex items-center gap-6">
            <button 
                onClick={() => setIsActive(!isActive)}
                className="h-20 w-20 rounded-full bg-slate-900 text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
            >
                {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </button>
            
            <button 
                onClick={handleComplete}
                className="h-20 px-8 rounded-full bg-white border border-slate-200 text-slate-700 font-medium shadow-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-3"
            >
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-lg">Done</span>
            </button>
        </div>
      </div>
    </div>
  );
};