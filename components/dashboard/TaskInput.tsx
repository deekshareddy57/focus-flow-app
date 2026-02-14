"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Task } from "@/types";

export const TaskInput = () => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // 🧠 SMART PARSER LOGIC v5
    const segments = input.split(/\s+(?:and|then)\s+|,\s*|\s*;\s*/i).filter(s => s.trim().length > 0);

    segments.forEach(segment => {
        let titleToClean = segment.trim();
        const lowerSegment = titleToClean.toLowerCase();
        
        // Defaults
        // FIX: Using 'any' here temporarily to prevent TS errors if types/index.ts is lagging
        let category: any = 'work';
        let priority: Task['priority'] = 'medium';
        let estimatedTime = 30; 

        // 1. Check for "Quick" keyword (15 mins)
        if (lowerSegment.includes("quick") || lowerSegment.includes("short")) {
            estimatedTime = 15;
            titleToClean = titleToClean.replace(/quick|short/i, "").trim();
        }

        // 2. Extract & Remove Time patterns
        const timeRegex = /(?:for\s+)?(\d+)\s*(min|m|mins|hour|h|hours)/i;
        const timeMatch = titleToClean.match(timeRegex);
        
        if (timeMatch) {
            const value = parseInt(timeMatch[1]);
            const unit = timeMatch[2].toLowerCase();
            if (unit.startsWith('h')) estimatedTime = value * 60;
            else estimatedTime = value;
            titleToClean = titleToClean.replace(timeMatch[0], "").trim();
        }

        // 3. ENHANCED CATEGORY LOGIC 🧠
        
        // STUDY Words
        if (lowerSegment.match(/study|read|exam|test|assignment|homework|class|lecture|paper|essay|project|lab/)) {
            category = 'study';
        }
        
        // HEALTH Words
        if (lowerSegment.match(/gym|workout|walk|run|health|meditate|yoga|doctor|dentist|appointment/)) {
            category = 'health';
        }
        
        // PERSONAL Words
        if (lowerSegment.match(/mom|dad|call|groceries|shop|buy|clean|laundry|cook|dinner|lunch/)) {
            category = 'personal';
        }

        // WORK Words
        if (lowerSegment.match(/work|meeting|Git|Push|deadline|submit/)) {
            category = 'work';
        }
        
        
        // CAREER Words 
        if (lowerSegment.match(/apply|job|resume|interview|linkedin|recruiter|application|cover letter|portfolio|network/)) {
            category = 'career';
        }

        // 4. Priority Logic
        if (lowerSegment.match(/urgent|asap|deadline|important|high|fast|imp|/)) priority = 'high';
        if (lowerSegment.match(/later|whenever|low|maybe|late|slow|eod/)) priority = 'low';

        // 5. Final Cleanup
        titleToClean = titleToClean.replace(/\s+for\s*$/i, "");
        titleToClean = titleToClean.replace(/\s+/g, " ").replace(/[.,;]+$/, "").trim();

        const newTask: Task = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: titleToClean, 
            status: 'todo',
            priority: priority,
            estimatedTime: estimatedTime,
            category: category,
            createdAt: new Date().toISOString()
        };

        addTask(newTask);
    });

    setInput("");
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-2xl relative z-20">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative flex items-center bg-white rounded-full shadow-lg border border-slate-100 p-2 transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transform focus-within:scale-[1.01]">
          <div className="pl-4 pr-3 text-slate-400">
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin text-blue-500" /> : <Sparkles className="h-5 w-5 text-blue-400" />}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'Apply to job', 'Finish assignment', or 'Gym 1h'..."
            className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 h-10 text-base"
            disabled={isProcessing}
          />
          <button type="submit" disabled={!input.trim() || isProcessing} className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};