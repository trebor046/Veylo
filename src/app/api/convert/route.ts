import { NextResponse } from "next/server";

const COBALT_API = process.env.CONVERSION_API_URL || "https://api.cobalt.tools/api/json";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, format } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let payload: any = {
      url: url,
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
    } else if (format === "m4a") {
      payload.aFormat = "m4a";
      payload.isAudioOnly = true;
    }

    const res = await fetch(COBALT_API, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to convert" }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json({
      downloadUrl: data.url || data.downloadUrl,
      status: data.status,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
