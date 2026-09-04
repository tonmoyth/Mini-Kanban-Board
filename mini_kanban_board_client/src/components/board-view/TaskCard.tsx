"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import { TaskDetailModal } from "./TaskDetailModal";

interface TaskCardProps {
  task: Task;
  index: number;
  boardId: string;
}

export function TaskCard({ task, index, boardId }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "group relative flex cursor-grab flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-slate-300",
            snapshot.isDragging && "z-10 rotate-2 scale-105 border-blue-400 shadow-xl ring-2 ring-blue-400/20",
            !snapshot.isDragging && "hover:shadow-md"
          )}
          style={{ ...provided.draggableProps.style }}
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium leading-5 text-slate-900">{task.title}</h4>
          </div>
          {task.description && (
            <p className="line-clamp-2 text-xs text-slate-500">{task.description}</p>
          )}
        </div>
      )}
    </Draggable>
    <TaskDetailModal 
      boardId={boardId} 
      task={task} 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
    />
    </>
  );
}
