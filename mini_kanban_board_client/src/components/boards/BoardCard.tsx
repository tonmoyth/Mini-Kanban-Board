import Link from "next/link";
import { Board } from "@/types/board";

export function BoardCard({ board }: { board: Board }) {
  return (
    <Link
      href={`/boards/${board.id}`}
      className="group flex h-32 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
    >
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
          {board.name}
        </h3>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Owner: {board.ownerId ? "You" : "Someone"}</span>
        {/* We can refine the owner view if the backend returns owner details */}
      </div>
    </Link>
  );
}
