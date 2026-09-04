"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { logoutAction } from "@/lib/actions/auth";

export default function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-slate-600 hover:text-slate-900"
      onClick={() => logoutAction()}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
