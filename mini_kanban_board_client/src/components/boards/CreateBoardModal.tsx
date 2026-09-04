"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createBoardAction } from "@/lib/actions/boards";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function CreateBoardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    const result = await createBoardAction(name.trim());
    setIsLoading(false);

    if (result.success) {
      toast.success("Board created successfully");
      setIsOpen(false);
      setName("");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Create Board
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create new board">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Board Name</label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Project Alpha"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={!name.trim()}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
