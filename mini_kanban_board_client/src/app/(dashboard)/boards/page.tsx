import { Metadata } from "next";
import { api } from "@/lib/api";
import { Board } from "@/types/board";
import { BoardCard } from "@/components/boards/BoardCard";
import { CreateBoardModal } from "@/components/boards/CreateBoardModal";

export const metadata: Metadata = {
  title: "Boards | Mini Kanban Board",
};

export default async function BoardsPage() {
  const boards = await api.get<Board[]>("/boards");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your Boards</h1>
        <CreateBoardModal />
      </div>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-3 text-slate-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900">No boards yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Get started by creating a new board to track your tasks and collaborate with your team.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </div>
  );
}
