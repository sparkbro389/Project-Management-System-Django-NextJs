// app/lib/api.ts

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  token?: string
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`http://localhost:8000/api${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed");
  }

  return response.json();
}
