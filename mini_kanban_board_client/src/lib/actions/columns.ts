"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

export async function createColumnAction(boardId: string, name: string) {
  try {
    await api.post(`/boards/${boardId}/columns`, { name });
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create column" };
  }
}

export async function renameColumnAction(boardId: string, columnId: string, name: string) {
  try {
    await api.patch(`/columns/${columnId}`, { name });
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to rename column" };
  }
}

export async function deleteColumnAction(boardId: string, columnId: string) {
  try {
    await api.delete(`/columns/${columnId}`);
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete column" };
  }
}
