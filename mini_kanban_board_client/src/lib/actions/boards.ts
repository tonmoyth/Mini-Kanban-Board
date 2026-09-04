"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

export async function createBoardAction(name: string) {
  try {
    await api.post("/boards", { name });
    revalidatePath("/boards");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create board" };
  }
}
