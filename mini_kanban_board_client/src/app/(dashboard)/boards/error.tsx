"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function BoardsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-4 text-red-600">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Something went wrong!</h2>
      <p className="mb-6 max-w-md text-slate-500">
        We couldn't load your boards. Please try again or contact support if the problem persists.
      </p>
      <Button onClick={() => reset()} variant="secondary">
        Try again
      </Button>
    </div>
  );
}
