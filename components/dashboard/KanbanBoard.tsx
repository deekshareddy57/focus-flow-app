"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Task } from "@/types";

export const KanbanBoard = () => {
  const { tasks, updateTaskStatus } = useTaskStore();
  const [isMounted, setIsMounted] = useState(false);

  // Fix for hydration errors with Drag and Drop in Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;
    
    // If dropped in a different column, update status in the store
    if (destination.droppableId !== result.source.droppableId) {
       updateTaskStatus(draggableId, destination.droppableId as Task['status']);
    }
  };

  if (!isMounted) return null; // Prevent server-render mismatch

  // Filter tasks by status
  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
        
        {/* COLUMN 1: ON DECK */}
        <Column 
            id="todo" 
            title="On Deck" 
            count={columns.todo.length} 
            tasks={columns.todo} 
        />

        {/* COLUMN 2: IN FLOW (The Highlight) */}
        <Column 
            id="in-progress" 
            title="In Flow" 
            count={columns["in-progress"].length} 
            tasks={columns["in-progress"]} 
        />

        {/* COLUMN 3: DONE */}
        <Column 
            id="done" 
            title="Completed" 
            count={columns.done.length} 
            tasks={columns.done} 
        />
        
      </div>
    </DragDropContext>
  );
};

// Helper Component for Columns to keep code clean
// Helper Component for Columns
const Column = ({ id, title, count, tasks }: { id: string; title: string; count: number; tasks: Task[] }) => {
  return (
    <div className={cn(
        "flex flex-col rounded-xl p-4 transition-colors border h-full",
        // 1. "On Deck" -> Crisp White with Shadow
        id === "todo" && "bg-white border-slate-200 shadow-sm",
        
        // 2. "In Flow" -> Soft Blue (unchanged)
        id === "in-progress" && "bg-blue-50 border-blue-200 shadow-inner",
        
        // 3. "Completed" -> Very subtle Green/Slate tint
        id === "done" && "bg-emerald-50/50 border-emerald-100/50"
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn(
            "font-semibold text-sm", 
            id === "in-progress" ? "text-blue-700" : "text-slate-700"
        )}>
            {title}
        </h3>
        <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium shadow-sm border",
            id === "in-progress" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-600 border-slate-200"
        )}>
            {count}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
                "flex-1 rounded-lg transition-colors min-h-[150px]",
                // Add a subtle highlight when you drag OVER the column
                snapshot.isDraggingOver ? "bg-slate-50 ring-2 ring-slate-200" : ""
            )}
          >
            {tasks.map((task: Task, index: number) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};