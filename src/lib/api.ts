 
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://web-production-310c7c.up.railway.app";

export async function fetchFromAPI(
  endpoint: string,
  options: RequestInit = {}
) {
  const headers = {
    "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}
