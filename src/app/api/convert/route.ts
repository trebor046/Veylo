import { NextResponse } from "next/server";

const COBALT_API = process.env.CONVERSION_API_URL || "https://api.cobalt.tools/api/json";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, format } = body;

    if (!url) {
      return NextResponse.json({ error: "URL necessária" }, { status: 400 });
    }

    let payload: any = {
      url,
      filenameStyle: "basic",
    };

    if (format === "mp3") {
      payload.aFormat = "mp3";
      payload.isAudioOnly = true;
    } else if (format === "mp4") {
      payload.vCodec = "h264";
      payload.vQuality = "max";
    } else if (format === "webm") {
      payload.vCodec = "vp9";
      payload.vQuality = "max";
    } else if (format === "m4a") {
      payload.aFormat = "m4a";
      payload.isAudioOnly = true;
    }

    const res = await fetch(COBALT_API, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Veylo/1.0 (+https://github.com/trebor046/Veylo)",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      console.error("Cobalt convert error:", res.status, data);
      return NextResponse.json(
        { error: "Não foi possível gerar o link de download" },
        { status: 500 }
      );
    }

    const downloadUrl = data.url || data.downloadUrl || (Array.isArray(data.url) ? data.url[0] : null);

    if (!downloadUrl) {
      console.error("Cobalt convert missing url:", data);
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
