import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Token is invalid or expired
    redirect("/login");
  }

  if (!res.ok) {
    let body;
    try {
      body = await res.json();
    } catch {
      body = {};
    }
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json();
  
  // If the backend wraps the response in a { data: ... } object, unwrap it
  if (body && typeof body === 'object' && 'data' in body) {
    return body.data as T;
  }
  
  return body as T;
}

export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    fetchApi<T>(path, { method: "GET", ...options }),

  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    fetchApi<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined, ...options }),

  patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
    fetchApi<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined, ...options }),

  delete: <T>(path: string, options?: RequestInit) =>
    fetchApi<T>(path, { method: "DELETE", ...options }),
};
