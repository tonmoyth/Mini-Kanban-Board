"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export async function loginAction(payload: LoginPayload) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return { success: false, error: error.message || "Invalid credentials" };
    }

    const body = await res.json();
    console.log("login response", body)
    
    // The backend wraps the response in a "data" object
    const data: AuthResponse = body.data || body;

    // Store in HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function registerAction(payload: RegisterPayload) {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return { success: false, error: error.message || "Registration failed" };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (token) {
    // Optionally notify backend if required
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    }).catch(() => { });
  }

  cookieStore.delete("accessToken");
  redirect("/login");
}
