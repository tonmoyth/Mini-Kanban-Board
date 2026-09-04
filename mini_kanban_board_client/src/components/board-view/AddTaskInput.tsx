"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createTaskAction } from "@/lib/actions/tasks";
import { toast } from "sonner";

interface AddTaskInputProps {
  boardId: string;
  columnId: string;
}

export function AddTaskInput({ boardId, columnId }: AddTaskInputProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setIsAdding(false);
      return;
    }

    setIsLoading(true);
    const result = await createTaskAction(boardId, columnId, title.trim());
    setIsLoading(false);

    if (result.success) {
      setTitle("");
      setIsAdding(false);
    } else {
      toast.error(result.error);
    }
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="mt-2 space-y-2">
        <Input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={isLoading}
          className="bg-white"
        />
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isLoading} disabled={!title.trim()}>
            Add
          </Button>
        </div>
      </form>
    );
  }

  return (
    <Button
      variant="ghost"
      className="mt-2 w-full justify-start text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
      onClick={() => setIsAdding(true)}
    >
      <Plus className="mr-2 h-4 w-4" /> Add a task
    </Button>
  );
}
