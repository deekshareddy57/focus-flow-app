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
    await new Promise(resolve => setTimeout(resolve, 800));

    // ---------------------------------------------------------
    // 🧠 MULTI-TASK PARSING LOGIC (v2)
    // ---------------------------------------------------------
    
    // 1. Split by separators: "and", "then", ",", ";"
    // The Regex looks for:
    // \s+(?:and|then)\s+  -> " and " or " then " (with spaces)
    // ,\s* -> "," followed by optional space
    // \s*;\s* -> ";" with optional spaces
    const segments = input.split(/\s+(?:and|then)\s+|,\s*|\s*;\s*/i).filter(s => s.trim().length > 0);

    segments.forEach(segment => {
        let titleToClean = segment.trim();
        const lowerSegment = titleToClean.toLowerCase();
        
        // Defaults
        let category: Task['category'] = 'work';
        let priority: Task['priority'] = 'medium';
        let estimatedTime = 30; 

        // 2. Extract & Remove Time from Title
        // Regex matches: optional "for ", number, space, units (min/hour)
        const timeRegex = /(?:for\s+)?(\d+)\s*(min|m|mins|hour|h|hours)/i;
        const timeMatch = titleToClean.match(timeRegex);
        
        if (timeMatch) {
            const value = parseInt(timeMatch[1]);
            const unit = timeMatch[2].toLowerCase();
            
            // Convert to minutes
            if (unit.startsWith('h')) {
                estimatedTime = value * 60;
            } else {
                estimatedTime = value;
            }
            
            // Remove the matched time string from the title (e.g. remove "for 1 hour")
            titleToClean = titleToClean.replace(timeMatch[0], "").trim();
        }

        // 3. Category Logic
        if (lowerSegment.includes("study") || lowerSegment.includes("read") || lowerSegment.includes("exam")) category = 'study';
        if (lowerSegment.includes("gym") || lowerSegment.includes("workout") || lowerSegment.includes("walk")) category = 'health';
        if (lowerSegment.includes("mom") || lowerSegment.includes("call") || lowerSegment.includes("groceries")) category = 'personal';

        // 4. Priority Logic
        if (lowerSegment.includes("urgent") || lowerSegment.includes("asap") || lowerSegment.includes("deadline")) priority = 'high';
        if (lowerSegment.includes("later") || lowerSegment.includes("whenever")) priority = 'low';

        // 5. Final Cleanup
        // Remove trailing punctuation or double spaces
        titleToClean = titleToClean.replace(/\s+/g, " ").replace(/[.,;]+$/, "").trim();

        const newTask: Task = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: titleToClean, // Now clean!
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
        
        {/* The Glowing Background Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        
        <div className="relative flex items-center bg-white rounded-full shadow-lg border border-slate-100 p-2 transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transform focus-within:scale-[1.01]">
          
          <div className="pl-4 pr-3 text-slate-400">
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            ) : (
              <Sparkles className="h-5 w-5 text-blue-400" />
            )}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe tasks... (e.g. 'Gym for 1h then Study')"
            className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 h-10 text-base"
            disabled={isProcessing}
          />

          <button 
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="text-center mt-3 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Try: &quot;Email boss, then Gym for 90 mins, then Read for 1 hour&quot;
      </div>
    </div>
  );
};