import { NextResponse } from "next/server";

const COBALT_API = process.env.CONVERSION_API_URL || "https://api.cobalt.tools/api/json";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL necessária" }, { status: 400 });
    }

    const res = await fetch(COBALT_API, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Veylo/1.0 (+https://github.com/trebor046/Veylo)",
      },
      body: JSON.stringify({
        url,
        filenameStyle: "basic",
      }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      console.error("Cobalt extract error:", res.status, data);
      return NextResponse.json(
        { error: "Não foi possível extrair os formatos deste link" },
        { status: 500 }
      );
    }

    const formats = [
      {
        key: "mp4",
        label: "MP4",
        type: "video",
        quality: "Melhor disponível",
      },
      {
        key: "mp3",
        label: "MP3",
        type: "audio",
        quality: "Áudio",
      },
      {
        key: "webm",
        label: "WEBM",
        type: "video",
        quality: "Disponível",
      },
      {
        key: "m4a",
        label: "M4A",
        type: "audio",
        quality: "Áudio",
      },
    ];

    return NextResponse.json({ formats });
  } catch (error) {
    console.error("Extract route error:", error);
    return NextResponse.json({ error: "Erro interno ao processar o link" }, { status: 500 });
  }
}
