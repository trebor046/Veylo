"use client";

import { ArrowDownToLine, ExternalLink, Link2, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Não foi possível extrair os formatos");
      }

      setFormats(data.formats || []);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao processar o link. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: Format) => {
    setError("");

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), format: format.key }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar download");
      }

      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      }
    } catch (err: any) {
      setError(err.message || "Não foi possível gerar o link de download.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-60 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.25)_0%,rgba(59,130,246,0.12)_35%,transparent_70%)] blur-[140px]" />
        <div className="absolute top-40 -left-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.18)_0%,transparent_70%)] blur-[150px]" />
        <div className="absolute -bottom-80 right-[-10%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16)_0%,transparent_72%)] blur-[150px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-400/80 via-fuchsia-400/70 to-cyan-300/70 blur-sm" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl">
              <ArrowDownToLine className="h-5 w-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight">Veylo</span>
            <span className="text-xs text-white/40">Conversor por link</span>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 backdrop-blur-xl sm:flex">
          <Sparkles className="h-3.5 w-3.5" />
          Feito para ser rápido e direto
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-20 pt-6 sm:pt-10">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_0_6px_rgba(34,211,238,0.12)]" />
            Cole o link • Escolha o formato • Baixe
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Converta qualquer link
            <span className="bg-gradient-to-r from-white via-white/90 to-white/40 bg-clip-text text-transparent"> em segundos</span>
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-lg text-white/60 sm:text-xl">
            Interface minimalista com efeito glass. Suporte a diversos sites e formatos, com foco inicial em MP4.
          </p>
        </div>

        <form onSubmit={handleExtract} className="mt-10 w-full max-w-3xl">
          <div className="relative group">
            <div className="absolute -inset-px rounded-[1.6rem] bg-gradient-to-r from-violet-400/40 via-fuchsia-400/30 to-cyan-300/40 opacity-70 blur-sm transition duration-700 group-hover:opacity-100" />
            <div className="relative flex flex-col gap-3 rounded-[1.5rem] border border-white/15 bg-white/5 p-2 shadow-[0_60px_120px_-80px_rgba(139,92,246,0.9)] backdrop-blur-2xl sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 px-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10">
                  <Link2 className="h-4 w-4 text-white/80" />
                </div>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Cole o link aqui (YouTube, TikTok, Instagram, Twitter/X, etc.)"
                  className="w-full bg-transparent py-2.5 text-base text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-7 py-2.5 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-white/90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent)]" />
                <span className="relative flex items-center gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDownToLine className="h-4 w-4" />}
                  {loading ? "Analisando link..." : "Extrair formatos"}
                </span>
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-6 w-full max-w-3xl rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-center text-sm text-rose-100 backdrop-blur-xl">
            {error}
          </div>
        )}

        {formats.length > 0 && (
          <section className="mt-12 w-full max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-medium tracking-tight">Formatos disponíveis</h2>
                <p className="text-sm text-white/50">Selecione o formato desejado para gerar o download</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 backdrop-blur-xl">
                Foco em MP4
              </div>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {formats.map((format) => (
                <button
                  key={format.key}
                  onClick={() => handleDownload(format)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:-translate-y-0.5 hover:border-white/25"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="text-base font-medium">{format.label}</p>
                      {format.quality && <p className="mt-1 text-sm text-white/50">{format.quality}</p>}
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 transition group-hover:scale-105">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-white/40">
              Ao clicar, abrimos o arquivo em uma nova aba para download direto
            </p>
          </section>
        )}
      </main>

      <footer className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-white/40 sm:flex-row">
        <span>© {year ?? 2026} Veylo • Todos os direitos reservados</span>
        <span>Design glass • Minimalista • Rápido</span>
      </footer>
    </div>
  );
}
