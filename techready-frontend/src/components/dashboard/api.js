// src/components/dashboard/api.js
export async function apiGet(path) {
  const res = await fetch(path, {
    method: "GET",
    credentials: "include", // keep existing auth cookies/session behavior
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, body = {}) {
  const res = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
