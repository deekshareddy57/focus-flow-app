"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { useEffect, useState } from "react";
import { X, CheckCircle, Pause, Play } from "lucide-react";

export const FocusMode = () => {
  const { isFocusMode, setIsFocusMode, activeTaskId, tasks, completeTask } = useTaskStore();
  
  // 1. FIND THE TASK FIRST
  const activeTask = tasks.find(t => t.id === activeTaskId);

  // 2. INITIALIZE STATE (Default to 25m if something goes wrong, but we'll update it instantly below)
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isActive, setIsActive] = useState(false);

  // 3. SYNC TIMER WITH TASK (The Fix) 🧠
  // When the active task changes, update the timer to match that task's estimated time
  useEffect(() => {
    if (activeTask) {
      setTimeLeft(activeTask.estimatedTime * 60);
      setIsActive(false); // Start paused so the user is ready
    }
  }, [activeTask]);

  // Timer Countdown Logic
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

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    if (activeTaskId) completeTask(activeTaskId);
    setIsFocusMode(false);
  };

  // If closed or invalid, don't render
  if (!isFocusMode || !activeTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-50/90 backdrop-blur-xl transition-all duration-700 animate-in fade-in zoom-in-95">
    {/* 1. EXIT BUTTON (Direct child of Fixed Container) */}
      <button 
        onClick={() => setIsFocusMode(false)}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/50 hover:bg-white text-slate-500 hover:text-red-500 transition-all shadow-sm border border-slate-200/50 z-50"
      ><X className="h-8 w-8" /></button>


      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl px-4">
        
        {/* Task Title */}
        <div className="space-y-2">
            <span className="text-slate-500 uppercase tracking-widest text-xs font-semibold">Now Focusing On</span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
                {activeTask.title}
            </h1>
        </div>

        {/* The Timer */}
        <div className="text-9xl font-light text-slate-700 font-mono tracking-tighter tabular-nums">
            {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
            <button 
                onClick={() => setIsActive(!isActive)}
                className="h-16 w-16 rounded-full bg-white border border-slate-200 shadow-xl flex items-center justify-center text-slate-700 hover:scale-110 transition-transform"
            >
                {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </button>
            
            <button 
                onClick={handleComplete}
                className="px-8 py-4 rounded-full bg-slate-900 text-white font-medium shadow-xl hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-2"
            >
                <CheckCircle className="h-5 w-5" />
                Mark Complete
            </button>
        </div>
      </div>
    </div>
  );
};