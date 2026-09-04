"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createColumnAction } from "@/lib/actions/columns";
import { toast } from "sonner";

interface AddColumnButtonProps {
  boardId: string;
}

export function AddColumnButton({ boardId }: AddColumnButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setIsAdding(false);
      return;
    }

    setIsLoading(true);
    const result = await createColumnAction(boardId, name.trim());
    setIsLoading(false);

    if (result.success) {
      setName("");
      setIsAdding(false);
    } else {
      toast.error(result.error);
    }
  };

  if (isAdding) {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex h-fit w-80 shrink-0 flex-col gap-2 rounded-xl bg-slate-100/80 p-3"
      >
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter column name..."
          disabled={isLoading}
          className="bg-white"
        />
        <div className="flex justify-start space-x-2">
          <Button type="submit" size="sm" isLoading={isLoading} disabled={!name.trim()}>
            Add Column
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <Button
      variant="outline"
      className="h-12 w-80 shrink-0 border-dashed bg-white/50 justify-start px-4 text-slate-500 hover:text-slate-800"
      onClick={() => setIsAdding(true)}
    >
      <Plus className="mr-2 h-4 w-4" /> Add another column
    </Button>
  );
}
