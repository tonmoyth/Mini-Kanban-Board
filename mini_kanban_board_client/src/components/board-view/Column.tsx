"use client";

import { Droppable } from "@hello-pangea/dnd";
import { Column as ColumnType } from "@/types/column";
import { TaskCard } from "./TaskCard";
import { AddTaskInput } from "./AddTaskInput";
import { renameColumnAction, deleteColumnAction } from "@/lib/actions/columns";
import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface ColumnProps {
  column: ColumnType;
}

export function Column({ column }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(column.name);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === column.name) {
      setIsEditing(false);
      setName(column.name);
      return;
    }

    setIsLoading(true);
    const result = await renameColumnAction(column.boardId, column.id, name.trim());
    setIsLoading(false);

    if (result.success) {
      setIsEditing(false);
    } else {
      toast.error(result.error);
      setName(column.name); // Reset
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this column and all its tasks?")) return;
    
    setIsLoading(true);
    const result = await deleteColumnAction(column.boardId, column.id);
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex h-full w-80 shrink-0 flex-col rounded-xl bg-slate-100/80 p-3">
      <div className="mb-3 flex items-center justify-between px-1 relative">
        {isEditing ? (
          <form onSubmit={handleRename} className="flex-1 mr-2">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleRename}
              disabled={isLoading}
              className="h-7 text-sm font-semibold px-2 py-0"
            />
          </form>
        ) : (
          <h3 className="font-semibold text-slate-700 flex-1">{column.name}</h3>
        )}

        <div className="flex items-center space-x-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
            {column.tasks?.length || 0}
          </span>
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-1 hover:bg-slate-200 text-slate-500"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <Edit2 className="mr-2 h-4 w-4" /> Rename
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-1 flex-col gap-2 min-h-[150px] transition-colors rounded-lg p-1 ${
              snapshot.isDraggingOver ? "bg-slate-200/50" : ""
            }`}
          >
            {column.tasks?.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} boardId={column.boardId} />
            ))}
            {provided.placeholder}
            
            <AddTaskInput boardId={column.boardId} columnId={column.id} />
          </div>
        )}
      </Droppable>
    </div>
  );
}
