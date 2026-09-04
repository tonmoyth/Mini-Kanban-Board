import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Mini Kanban Board",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <LoginForm />
    </div>
  );
}
