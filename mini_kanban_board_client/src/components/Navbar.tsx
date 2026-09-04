import Link from "next/link";
import { User } from "@/types/auth";
import LogoutButton from "./auth/LogoutButton";
import { LayoutDashboard } from "lucide-react";

export default function Navbar({ user }: { user: User }) {
  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8">
          <Link href="/boards" className="flex items-center space-x-2 text-slate-900 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">MiniKanban</span>
          </Link>
          <div className="hidden space-x-1 md:flex">
            <Link
              href="/boards"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Boards
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-medium text-slate-900">{user.name}</span>
            <span className="text-xs text-slate-500">{user.email}</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
