const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function GET(path: string, accessToken?: string) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.totalItems ? [json.data, json.totalItems] : json.data;
  } catch {
    throw new Error(`Gagal fetch ${path}`);
  }
}

export async function PATCH(
  path: string,
  data?: FormData,
  accessToken?: string
) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
      body: data,
    });

    const json = await res.json();
    return json;
  } catch {
    throw new Error(`Gagal fetch ${path}`);
  }
}

export async function POST(path: string, data: FormData, accessToken?: string) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
      body: data,
    });

    const json = await res.json();
    return json;
  } catch {
    throw new Error(`Gagal fetch ${path}`);
  }
}

export async function DELETE(path: string, accessToken?: string) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    });

    const json = await res.json();
    return json;
  } catch {
    throw new Error(`Gagal fetch ${path}`);
  }
}
