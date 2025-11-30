"use client";

import { Task } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, GripVertical, Trash2 } from "lucide-react"; // 
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore"; // Import Store


interface TaskCardProps {
  task: Task;
  index: number;
}

export const TaskCard = ({ task, index }: TaskCardProps) => {
  const deleteTask = useTaskStore((state) => state.deleteTask); // Get the action
  const setIsFocusMode = useTaskStore((state) => state.setIsFocusMode); // To toggle Focus Mode
  const setActiveTaskId = useTaskStore((state) => state.setActiveTaskId); // To set the active task

  const priorityColor = {
    high: "bg-red-100 text-red-700 hover:bg-red-200",
    medium: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    low: "bg-green-100 text-green-700 hover:bg-green-200",
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3 group" // Added 'group' for hover effects
          style={{ ...provided.draggableProps.style }}
        >
          <Card 
            className={cn(
              "p-4 cursor-grab active:cursor-grabbing transition-all hover:shadow-md relative", // Added 'relative'
              snapshot.isDragging ? "shadow-lg scale-105 rotate-2 ring-2 ring-primary/20" : "",
              task.status === 'done' ? "opacity-60 bg-slate-50" : "bg-white"
            )}
          >
            {/* DELETE BUTTON (Hidden by default, shows on hover) 
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent drag interference
                    deleteTask(task.id);
                }} 
                className="absolute top-2 right-2 p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete Task"
            >
                <Trash2 className="h-4 w-4" />
            </button> */}
            {/* BUTTON GROUP (Top Right) */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                
                {/* 1. FOCUS BUTTON */}
                {task.status !== 'done' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveTaskId(task.id); // Set this task as active
                            setIsFocusMode(true);     // Turn on the overlay
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
              
              <div className="flex-1 space-y-2 pr-6"> {/* Added pr-6 to prevent text overlap with delete button */}
                <div className="flex justify-between items-start">
                    <p className={cn(
                        "font-medium text-sm text-slate-700 leading-tight",
                        task.status === 'done' && "line-through text-slate-400"
                    )}>
                        {task.title}
                    </p>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="secondary" className={cn("capitalize font-normal", priorityColor[task.priority])}>
                    {task.priority}
                  </Badge>
                  
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