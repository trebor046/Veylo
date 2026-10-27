import { NextResponse } from "next/server";

const COBALT_API = process.env.CONVERSION_API_URL || "https://api.cobalt.tools/api/json";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Usando Cobalt API para extrair formatos
    const res = await fetch(COBALT_API, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        vCodec: "h264",
        vQuality: "max",
        aFormat: "mp3",
        filenameStyle: "basic",
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to extract" }, { status: 500 });
    }

    const data = await res.json();

    // Formatar resposta para o frontend
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

    return NextResponse.json({ formats, raw: data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
