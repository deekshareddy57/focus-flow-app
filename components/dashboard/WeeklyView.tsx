"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, setHours, setMinutes } from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/types";

export const WeeklyView = () => {
    const { tasks, addTask } = useTaskStore();
    const [currentDate, setCurrentDate] = useState(new Date());

    // 1. Calculate the Week's Range
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });

    // 2. Metrics Logic
    const weekTasks = tasks.filter(t => {
        const taskDate = new Date(t.createdAt);
        return taskDate >= start && taskDate <= end;
    });

    const totalEstMinutes = weekTasks.reduce((acc, t) => acc + t.estimatedTime, 0);
    const totalEstHours = Math.round(totalEstMinutes / 60);

    const tasksPerDay = days.map(day => ({
        day,
        count: weekTasks.filter(t => isSameDay(new Date(t.createdAt), day)).length
    }));
    const busiestDayObj = tasksPerDay.reduce((max, current) => (current.count > max.count ? current : max), tasksPerDay[0]);
    const busiestDayName = busiestDayObj.count > 0 ? format(busiestDayObj.day, 'EEEE') : "-";
    const freeDays = tasksPerDay.filter(d => d.count === 0).length;

    // 3. HANDLER: Add Task to Specific Day
    const handleAddTaskToDay = (date: Date) => {
        const title = window.prompt(`Add task for ${format(date, 'EEEE, MMM d')}:`);

        if (title) {
            const specificDate = setHours(setMinutes(date, 0), 9);

            const newTask: Task = {
                // FIX: Replaced crypto.randomUUID() with a universal ID generator
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                title: title,
                status: 'todo',
                priority: 'medium',
                estimatedTime: 30,
                category: 'work',
                createdAt: specificDate.toISOString()
            };
            addTask(newTask);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* HEADER */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ChevronLeft className="h-5 w-5 text-slate-500" />
                </button>

                <div className="text-center">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {format(start, "MMMM d")} - {format(end, "MMMM d, yyyy")}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">This Week</p>
                </div>

                <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ChevronRight className="h-5 w-5 text-slate-500" />
                </button>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-7 gap-4 h-[400px]">
                {days.map((day, i) => {
                    const isToday = isSameDay(day, new Date());
                    const dayTasks = tasks.filter(t => isSameDay(new Date(t.createdAt), day));

                    return (
                        <div key={i} className={cn(
                            "flex flex-col bg-white rounded-xl border p-3 transition-all hover:shadow-md group/day",
                            isToday ? "border-blue-400 ring-1 ring-blue-100" : "border-slate-200"
                        )}>
                            {/* Day Header */}
                            <div className="mb-4 pb-2 border-b border-slate-50 flex justify-between items-start">
                                <div>
                                    <span className="text-xs text-slate-500 block mb-0.5">{format(day, "EEE")}</span>
                                    <span className={cn(
                                        "text-xl font-bold",
                                        isToday ? "text-blue-600" : "text-slate-700"
                                    )}>
                                        {format(day, "d")}
                                    </span>
                                </div>

                                {/* PLUS BUTTON */}
                                <button
                                    onClick={() => handleAddTaskToDay(day)}
                                    className="opacity-0 group-hover/day:opacity-100 p-1 hover:bg-blue-50 text-blue-500 rounded transition-opacity"
                                    title="Add task to this day"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Tasks List */}
                            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                {dayTasks.length > 0 ? (
                                    dayTasks.map(task => (
                                        <div key={task.id} className="text-xs p-2 bg-slate-50 rounded border border-slate-100 truncate group">
                                            <span className="font-medium text-slate-700 block truncate" title={task.title}>{task.title}</span>
                                            <span className="text-[10px] text-slate-400">{task.estimatedTime}m</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex items-center justify-center cursor-pointer" onClick={() => handleAddTaskToDay(day)}>
                                        <span className="text-xs text-slate-300 italic hover:text-blue-400 transition-colors">Empty</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 grid grid-cols-4 gap-8">
                <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Tasks</span>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{weekTasks.length}</p>
                </div>
                <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Hours</span>
                    <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-5 w-5 text-blue-400" />
                        <p className="text-3xl font-bold text-slate-800">{totalEstHours}h</p>
                    </div>
                </div>
                <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Busiest Day</span>
                    <p className="text-xl font-bold text-slate-700 mt-2 truncate">{busiestDayName}</p>
                </div>
                <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Free Days</span>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{freeDays}</p>
                </div>
            </div>

        </div>
    );
};