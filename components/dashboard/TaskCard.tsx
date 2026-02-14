"use client";

import { Task } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, GripVertical, Trash2, Play } from "lucide-react"; 
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore"; 

interface TaskCardProps {
  task: Task;
  index: number;
}

export const TaskCard = ({ task, index }: TaskCardProps) => {
  const { deleteTask, setIsFocusMode, setActiveTaskId } = useTaskStore(); 

  const priorityColor = {
    high: "bg-red-100 text-red-700 hover:bg-red-200",
    medium: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    low: "bg-green-100 text-green-700 hover:bg-green-200",
  };

  // Define colors for categories
  const categoryColor = {
    work: "text-slate-500",
    personal: "text-purple-500",
    study: "text-blue-500",
    health: "text-emerald-500",
    career: "text-pink-500 font-bold tracking-wide" // Make career pop!
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3 group" 
          style={{ ...provided.draggableProps.style }}
        >
          <Card 
            className={cn(
              "p-4 cursor-grab active:cursor-grabbing transition-all hover:shadow-md relative", 
              snapshot.isDragging ? "shadow-lg scale-105 rotate-2 ring-2 ring-primary/20" : "",
              task.status === 'done' ? "opacity-60 bg-slate-50" : "bg-white"
            )}
          >
            {/* BUTTON GROUP (Top Right) */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                
                {/* 1. FOCUS BUTTON */}
                {task.status !== 'done' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveTaskId(task.id); 
                            setIsFocusMode(true);     
                        }} 
                        className="p-1.5 rounded-md text-slate-300 hover:text-blue-500 hover:bg-blue-50"
                        title="Start Focus Mode"
                    >
                        <Play className="h-4 w-4" />
                    </button>
                )}

                {/* 2. DELETE BUTTON */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                    }} 
                    className="p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50"
                    title="Delete Task"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="flex items-start gap-3">
              {/* Drag Handle Icon */}
              <GripVertical className="h-5 w-5 text-slate-300 mt-0.5 flex-shrink-0" />
              
              <div className="flex-1 space-y-2 pr-6"> 
                <div className="flex justify-between items-start">
                    <p className={cn(
                        "font-medium text-sm text-slate-700 leading-tight",
                        task.status === 'done' && "line-through text-slate-400"
                    )}>
                        {task.title}
                    </p>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn("capitalize font-normal", priorityColor[task.priority])}>
                        {task.priority}
                    </Badge>
                    
                    {/* NEW: Show Category Tag */}
                    {task.category && task.category !== 'personal' && (
                        <span className={cn("text-[10px] uppercase", categoryColor[task.category] || "text-slate-400")}>
                            {task.category}
                        </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-slate-400 gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{task.estimatedTime}m</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};