"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Task } from "@/types/task";
import { updateTaskAction, deleteTaskAction } from "@/lib/actions/tasks";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface TaskDetailModalProps {
  boardId: string;
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailModal({ boardId, task, isOpen, onClose }: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    const result = await updateTaskAction(boardId, task.id, title.trim(), description.trim());
    setIsLoading(false);

    if (result.success) {
      toast.success("Task updated");
      onClose();
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    setIsDeleting(true);
    const result = await deleteTaskAction(boardId, task.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success("Task deleted");
      onClose();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading || isDeleting}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading || isDeleting}
            rows={4}
            className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Add a more detailed description..."
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Task
          </Button>
          <div className="flex space-x-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading || isDeleting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isDeleting || !title.trim()}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
