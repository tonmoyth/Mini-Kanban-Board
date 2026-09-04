import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function BoardNotFound() {
  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Board not found</h2>
      <p className="mb-6 text-slate-500">
        The board you are looking for doesn't exist or you don't have access to it.
      </p>
      <Link href="/boards">
        <Button>Go back to Boards</Button>
      </Link>
    </div>
  );
}
