"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Loader2, Tag as TagIcon } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Task } from "@/types";
import { cn } from "@/lib/utils";

/**
 * TaskInput Component
 * Handles the capture of tasks using Natural Language Processing (NLP) 
 * with an optional manual category override.
 */
export const TaskInput = () => {
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Task['category'] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const addTask = useTaskStore((state) => state.addTask);

  const categories: Task['category'][] = ['work', 'study', 'personal', 'health'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);

    // Simulate a brief "thinking" state for UX
    await new Promise(resolve => setTimeout(resolve, 600));

    // Handle multiple tasks separated by 'and', 'then', or punctuation
    const segments = input.split(/\s+(?:and|then)\s+|,\s*|\s*;\s*/i).filter(s => s.trim().length > 0);

    segments.forEach(segment => {
        let titleToClean = segment.trim();
        const lowerSegment = titleToClean.toLowerCase();
        
        // Priority: Manual selection > AI detection
        let category: any = selectedCategory || 'Personal';
        let priority: Task['priority'] = 'medium';
        let estimatedTime = 30; 

        // 1. Time Extraction (e.g., "for 1h", "30m", "45 mins")
        const timeRegex = /(?:for\s+)?(\d+)\s*(min|m|mins|hour|h|hours)/i;
        const timeMatch = titleToClean.match(timeRegex);
        if (timeMatch) {
            const value = parseInt(timeMatch[1]);
            const unit = timeMatch[2].toLowerCase();
            estimatedTime = unit.startsWith('h') ? value * 60 : value;
            titleToClean = titleToClean.replace(timeMatch[0], "").trim();
        }

        // 2. AI Category detection (only if not manually selected)
        if (!selectedCategory) {
            if (lowerSegment.match(/study|read|exam|assignment|homework|class|lecture|paper|essay|project|lab|test|books|canvas|university/)) {
                category = 'study';
            }
            if (lowerSegment.match(/gym|workout|walk|run|health|meditate|yoga|doctor|dentist|appointment/)) {
                category = 'health';
            }
            if (lowerSegment.match(/mom|dad|call|groceries|shop|buy|clean|laundry|cook|dinner|lunch/)) {
                category = 'personal';
            }
            if (lowerSegment.match(/work|meeting|git|push|deadline|submit/)) {
                category = 'work';
            }
            if (lowerSegment.match(/apply|job|resume|interview|linkedin|recruiter|application|cover letter|portfolio|network/)) {
                category = 'career';
            }
        }

        // 3. Priority detection
        if (lowerSegment.match(/urgent|asap|deadline|important|high|fast|imp/)) {
            priority = 'high';
        }
        if (lowerSegment.match(/later|whenever|low|maybe|late|slow|eod/)) {
            priority = 'low';
        }

        // 4. Final Cleanup of the title
        titleToClean = titleToClean.replace(/\s+for\s*$/i, "");
        titleToClean = titleToClean.replace(/\s+/g, " ").replace(/[.,;]+$/, "").trim();

        if (titleToClean) {
            addTask({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                title: titleToClean, 
                status: 'todo',
                priority,
                estimatedTime,
                category,
                createdAt: new Date().toISOString()
            });
        }
    });

    // Reset input and selection
    setInput("");
    setSelectedCategory(null);
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-2xl relative z-20 flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="relative group">
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
            placeholder="Type 'Apply to job', 'Gym 1h', or 'Finish assignment'..."
            className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 h-10 text-base"
            disabled={isProcessing}
          />

          <button 
            type="submit" 
            disabled={!input.trim() || isProcessing} 
            className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Manual Category Selection Tags */}
      <div className="flex justify-center flex-wrap gap-2">
        {categories.map(cat => (
            <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={cn(
                    "text-[10px] px-3 py-1.5 rounded-full border transition-all uppercase tracking-wide font-black flex items-center gap-1.5",
                    selectedCategory === cat 
                        ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105" 
                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                )}
            >
                {selectedCategory === cat && <TagIcon className="h-3 w-3" />}
                {cat}
            </button>
        ))}
      </div>
    </div>
  );
};