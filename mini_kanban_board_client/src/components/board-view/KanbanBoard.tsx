"use client";

import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { BoardDetail } from "@/types/board";
import { Column } from "./Column";
import { AddColumnButton } from "./AddColumnButton";
import { moveTaskAction } from "@/lib/actions/tasks";
import { toast } from "sonner";

interface KanbanBoardProps {
  initialBoard: BoardDetail;
}

export function KanbanBoard({ initialBoard }: KanbanBoardProps) {
  const [board, setBoard] = useState<BoardDetail>(initialBoard);

  // Sync state if initialBoard changes (e.g. from server revalidation)
  useEffect(() => {
    setBoard(initialBoard);
  }, [initialBoard]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // 1. Optimistically update local board state
    const sourceColumn = board.columns.find((c) => c.id === source.droppableId);
    const destColumn = board.columns.find((c) => c.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const sourceTasks = Array.from(sourceColumn.tasks || []);
    const destTasks = source.droppableId === destination.droppableId
      ? sourceTasks
      : Array.from(destColumn.tasks || []);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    
    // Update task's columnId and position optimistically
    movedTask.columnId = destination.droppableId;
    destTasks.splice(destination.index, 0, movedTask);

    const newColumns = board.columns.map((col) => {
      if (col.id === source.droppableId) {
        return { ...col, tasks: sourceTasks };
      }
      if (col.id === destination.droppableId) {
        return { ...col, tasks: destTasks };
      }
      return col;
    });

    const previousBoard = board;
    setBoard({ ...board, columns: newColumns });

    // 2. Persist to backend
    const res = await moveTaskAction(board.id, draggableId, {
      targetColumnId: destination.droppableId,
      position: destination.index,
    });

    if (!res.success) {
      toast.error(res.error || "Failed to move task");
      setBoard(previousBoard); // Rollback
    }
  };

  return (
    <div className="flex flex-1 overflow-x-auto p-4 sm:p-6 lg:p-8">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full items-start gap-6">
          {board.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
          <AddColumnButton boardId={board.id} />
        </div>
      </DragDropContext>
    </div>
  );
}
