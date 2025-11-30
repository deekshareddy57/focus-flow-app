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

    // ---------------------------------------------------------
    // 🧠 MOCK AI LOGIC (will replace this with OpenAI later)
    // This allows me to test the UX immediately without an API Key.
    // ---------------------------------------------------------
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple keyword detection to simulate "Intelligence"
    const lowerInput = input.toLowerCase();
    let category: Task['category'] = 'work';
    let priority: Task['priority'] = 'medium';
    let estimatedTime = 30; //default 30 mins

    const minMatch = lowerInput.match(/(\d+)\s*(min|mins|m|mi)/);
    if (minMatch) {
        estimatedTime = parseInt(minMatch[1]);
    }

    const hourMatch = lowerInput.match(/(\d+)\s*(hour|hours|h)/);
    if (hourMatch) {
        estimatedTime = parseInt(hourMatch[1]) * 60;
    }

    if (lowerInput.includes("study") || lowerInput.includes("read")) category = 'study';
    if (lowerInput.includes("gym") || lowerInput.includes("walk")) category = 'health';
    if (lowerInput.includes("mom") || lowerInput.includes("call") || lowerInput.includes("groceries")) category = 'personal';
    if (lowerInput.includes("work") || lowerInput.includes("project") || lowerInput.includes("meeting")) category = 'work';

    if (lowerInput.includes("urgent") || lowerInput.includes("asap")) priority = 'high';
    if (lowerInput.includes("later") || lowerInput.includes("whenever")) priority = 'low';
    if (lowerInput.includes("quick")) estimatedTime = 15;

    const newTask: Task = {
      //id: crypto.randomUUID(), // Generates a unique ID
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Simple unique ID to make it accessible in all environments
      title: input, // In the real AI version, this would be cleaned up
      status: 'todo',
      priority: priority,
      estimatedTime: estimatedTime,
      category: category,
      createdAt: new Date().toISOString()
    };

    addTask(newTask);
    setInput("");
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-2xl relative z-20">
      <form onSubmit={handleSubmit} className="relative group">
        
        {/* The Glowing Background Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        
        <div className="relative flex items-center bg-white rounded-full shadow-lg border border-slate-100 p-2 transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transform focus-within:scale-[1.01]">
          
          {/* Icon */}
          <div className="pl-4 pr-3 text-slate-400">
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            ) : (
              <Sparkles className="h-5 w-5 text-blue-400" />
            )}
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your tasks... (e.g. 'Study HCI for 45 mins')"
            className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 h-10 text-base"
            disabled={isProcessing}
          />

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

        {/* Helper Text */}
        <div className="text-center mt-3 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Try typing: &quot;Review Project asap&quot; or &quot;Gym for 1 hour&quot;
        </div>
    </div>
  );
};