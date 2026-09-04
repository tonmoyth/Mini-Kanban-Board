import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { api } from "@/lib/api";
import { BoardDetail, BoardMember } from "@/types/board";
import { User } from "@/types/auth";
import { KanbanBoard } from "@/components/board-view/KanbanBoard";
import { BoardHeader } from "@/components/board-view/BoardHeader";

export const metadata: Metadata = {
  title: "Board | Mini Kanban Board",
};

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  let board: BoardDetail;
  let members: BoardMember[] = [];
  let currentUser: User;

  try {
    const [boardData, membersData, userData] = await Promise.all([
      api.get<BoardDetail>(`/boards/${boardId}`),
      api.get<BoardMember[]>(`/boards/${boardId}/members`),
      api.get<User>("/auth/me")
    ]);
    board = boardData;
    members = membersData;
    currentUser = userData;
  } catch (error: any) {
    if (error.message.includes("404")) {
      notFound();
    }
    if (error.message.includes("403") || error.message.includes("401")) {
      redirect("/boards");
    }
    throw error;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <BoardHeader board={board} currentUser={currentUser} members={members} />

      {/* Board Content */}
      <KanbanBoard initialBoard={board} />
    </div>
  );
}
