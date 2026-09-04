import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Mini Kanban Board",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <RegisterForm />
    </div>
  );
}
