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
  
  // NEW: Filter State
  const [filter, setFilter] = useState<Task['category'] | 'all'>('all');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId !== result.source.droppableId) {
       updateTaskStatus(draggableId, destination.droppableId as Task['status']);
    }
  };

  if (!isMounted) return null; 

  // 1. FILTER LOGIC
  const filteredTasks = tasks.filter(t => 
    filter === 'all' ? true : t.category === filter
  );

  // 2. COLUMN GROUPING (Using filtered tasks)
  const columns = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    done: filteredTasks.filter((t) => t.status === "done"),
  };

  // Filter Options for the UI
  const categories: { id: string, label: string}[] = [
    { id: 'all', label: 'All' },
    { id: 'work', label: 'Work' },
    { id: 'study', label: 'Study' },
    { id: 'career', label: 'Career' },
    { id: 'personal', label: 'Personal' },
    { id: 'health', label: 'Health' },
  ];

  return (
    <div>
        {/* NEW: FILTER BAR */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id as any)}
                    className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap",
                        filter === cat.id 
                            ? "bg-slate-800 text-white border-slate-800" 
                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    )}
                >
                    {cat.label}
                    <span className="ml-2 opacity-60">
                         {/* Show count of tasks in this category */}
                        {cat.id === 'all' 
                            ? tasks.length 
                            : tasks.filter(t => t.category === cat.id).length}
                    </span>
                </button>
            ))}
        </div>

        {/* BOARD */}
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
                
                {/* COLUMN 1: ON DECK */}
                <Column 
                    id="todo" 
                    title="On Deck" 
                    count={columns.todo.length} 
                    tasks={columns.todo} 
                />

                {/* COLUMN 2: IN FLOW */}
                <Column 
                    id="in-progress" 
                    title="In Flow" 
                    count={columns["in-progress"].length} 
                    tasks={columns["in-progress"]} 
                />

                {/* COLUMN 3: COMPLETED */}
                <Column 
                    id="done" 
                    title="Completed" 
                    count={columns.done.length} 
                    tasks={columns.done} 
                />
                
            </div>
        </DragDropContext>
    </div>
  );
};

// Helper Component for Columns
const Column = ({ id, title, count, tasks }: { id: string; title: string; count: number; tasks: Task[] }) => {
  return (
    <div className={cn(
        "flex flex-col rounded-xl p-4 transition-colors border h-full",
        id === "todo" && "bg-white border-slate-200 shadow-sm",
        id === "in-progress" && "bg-blue-50 border-blue-200 shadow-inner",
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