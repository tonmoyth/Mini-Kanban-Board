import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { User } from "@/types/auth";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | null = null;
  try {
    user = await api.get<User>("/auth/me");
  } catch (error) {
    // Usually means unauthorized
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
