const API_BASE = "/api";

async function apiGet(url, token = null)
{
  const res = await fetch(API_BASE + url,
  {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok)
  {
    return await res.json().catch(() => ({ message: "Request failed" }));
  }
  return await res.json();
}

async function apiPost(url, data, token = null)
{
  const res = await fetch(API_BASE + url,
  {
    method: "POST",
    headers:
    {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok)
  {
    return await res.json().catch(() => ({ message: "Request failed" }));
  }
  return await res.json();
}

