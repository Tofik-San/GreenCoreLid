const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://web-production-310c7c.up.railway.app";

export async function fetchData(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Ошибка при запросе:", error);
    throw error;
  }
}
