"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const result = await loginAction(data);
    setIsLoading(false);

    if (result.success) {
      toast.success("Logged in successfully");
      router.push("/boards");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-xl border border-slate-100">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Enter your credentials to access your account</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            error={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
