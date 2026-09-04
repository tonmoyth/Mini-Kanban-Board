"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { MoveTaskPayload } from "@/types/task";

export async function moveTaskAction(boardId: string, taskId: string, payload: MoveTaskPayload) {
  try {
    await api.patch(`/tasks/${taskId}/move`, payload);
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to move task" };
  }
}

export async function createTaskAction(boardId: string, columnId: string, title: string, description?: string) {
  try {
    await api.post(`/columns/${columnId}/tasks`, { title, description });
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create task" };
  }
}

export async function updateTaskAction(boardId: string, taskId: string, title: string, description?: string) {
  try {
    await api.patch(`/tasks/${taskId}`, { title, description });
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update task" };
  }
}

export async function deleteTaskAction(boardId: string, taskId: string) {
  try {
    await api.delete(`/tasks/${taskId}`);
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete task" };
  }
}
