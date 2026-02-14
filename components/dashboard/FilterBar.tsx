"use client";

import { Task } from "@/types";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  filter: Task['category'] | 'all';
  setFilter: (filter: Task['category'] | 'all') => void;
  tasks: Task[];
}

export const FilterBar = ({ filter, setFilter, tasks }: FilterBarProps) => {
  const categories: { id: any, label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'work', label: 'Work' },
    { id: 'study', label: 'Study' },
    { id: 'career', label: 'Career' },
    { id: 'personal', label: 'Personal' },
    { id: 'health', label: 'Health' },
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
            <button
                key={cat.id}
                onClick={() => setFilter(cat.id as any)}
                className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-2",
                    filter === cat.id 
                        ? "bg-slate-800 text-white border-slate-800" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                )}
            >
                {cat.label}
                <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    filter === cat.id ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-400"
                )}>
                        {cat.id === 'all' 
                        ? tasks.length 
                        : tasks.filter(t => t.category === cat.id).length}
                </span>
            </button>
        ))}
    </div>
  );
};