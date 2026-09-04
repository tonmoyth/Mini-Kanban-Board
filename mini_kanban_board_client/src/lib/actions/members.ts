"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

export async function inviteMemberAction(boardId: string, email: string) {
  try {
    await api.post(`/boards/${boardId}/members`, { email, role: "MEMBER" });
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to invite member" };
  }
}

export async function removeMemberAction(boardId: string, userId: string) {
  try {
    await api.delete(`/boards/${boardId}/members/${userId}`);
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to remove member" };
  }
}
