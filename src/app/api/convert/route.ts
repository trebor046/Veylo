import { NextResponse } from "next/server";

const CONVERSION_API = process.env.CONVERSION_API_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, format } = body;

    if (!url) {
      return NextResponse.json({ error: "URL necessária" }, { status: 400 });
    }

    if (!CONVERSION_API) {
      return NextResponse.json(
        { error: "API de conversão não configurada. Adicione CONVERSION_API_URL nas variáveis da Vercel." },
        { status: 500 }
      );
    }

    const baseUrl = CONVERSION_API.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/convert`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        format,
      }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      console.error("Convert API error:", res.status, data);
      return NextResponse.json(
        { error: "Não foi possível gerar o link de download" },
        { status: 500 }
      );
    }

    const downloadUrl = data.url || data.downloadUrl || data.link || (Array.isArray(data.urls) ? data.urls[0] : null);

    if (!downloadUrl) {
      console.error("Convert API missing url:", data);
      return NextResponse.json(
        { error: "Não foi possível obter o link de download" },
        { status: 500 }
      );
    }

    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error("Convert route error:", error);
    return NextResponse.json({ error: "Erro interno ao converter" }, { status: 500 });
  }
}
