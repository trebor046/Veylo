"use client";

import { ArrowDownToLine, Link2, Loader2 } from "lucide-react";
import { useState } from "react";

type Format = {
  key: string;
  label: string;
  type: "video" | "audio";
  quality?: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [formats, setFormats] = useState<Format[]>([]);
  const [error, setError] = useState("");

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFormats([]);

    if (!url.trim()) {
      setError("Cole um link para começar");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        throw new Error("Não foi possível extrair os formatos");
      }

      const data = await res.json();
      setFormats(data.formats || []);
    } catch (err) {
      setError("Ocorreu um erro ao processar o link. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: Format) => {
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), format: format.key }),
      });

      if (!res.ok) {
        throw new Error("Erro ao gerar download");
      }

      const data = await res.json();
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      }
    } catch (err) {
      setError("Não foi possível gerar o link de download.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <ArrowDownToLine className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">Veylo</span>
        </div>
        <span className="text-sm text-zinc-400">Conversor por link</span>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Baixe vídeos e áudios em
            <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"> qualquer formato</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Cole o link, escolha o formato e baixe. Simples, rápido e intuitivo.
          </p>
        </div>

        <form onSubmit={handleExtract} className="mt-10 w-full">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-black/40 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Link2 className="h-5 w-5 text-zinc-400" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Cole o link aqui (YouTube, TikTok, Instagram, etc.)"
                className="w-full bg-transparent py-2 text-base outline-none placeholder:text-zinc-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDownToLine className="h-4 w-4" />}
              {loading ? "Analisando..." : "Converter"}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {formats.length > 0 && (
          <section className="mt-10 w-full">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Formatos disponíveis</h2>
              <span className="text-sm text-zinc-400">Foco em MP4</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {formats.map((format) => (
                <button
                  key={format.key}
                  onClick={() => handleDownload(format)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-white/30 hover:bg-white/10"
                >
                  <div>
                    <p className="font-medium">{format.label}</p>
                    {format.quality && <p className="text-sm text-zinc-400">{format.quality}</p>}
                  </div>
                  <ArrowDownToLine className="h-4 w-4 text-zinc-400" />
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-sm text-zinc-500">
        <span>© {new Date().getFullYear()} Veylo</span>
        <span>Feito para ser simples e prático</span>
      </footer>
    </div>
  );
}
