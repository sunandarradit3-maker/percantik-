'use client';

import { useMemo, useRef, useState } from 'react';
import { UploadCloud, Wand2, Download, SlidersHorizontal, Sparkles } from 'lucide-react';
import ImageEditor from '@/components/image-editor';
import { applyBeautify } from '@/lib/image-utils';

type Mode = 'manual' | 'smart';

type Controls = {
  intensity: number;
  smoothness: number;
  brightness: number;
  warmth: number;
  clarity: number;
};

const defaultControls: Controls = {
  intensity: 70,
  smoothness: 45,
  brightness: 6,
  warmth: 4,
  clarity: 12,
};

export default function Page() {
  const [mode, setMode] = useState<Mode>('smart');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [controls, setControls] = useState<Controls>(defaultControls);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const desc = useMemo(() => {
    return mode === 'smart'
      ? 'Smart Mode menerapkan preset natural otomatis agar wajah tetap realistis.'
      : 'Manual Mode memberi kontrol granular untuk hasil yang presisi.';
  }, [mode]);

  const onUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const output = await applyBeautify(image, mode, controls, canvasRef.current);
      setResult(output);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = 'ditz-store-beautified.png';
    a.click();
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#182235,_#050816_50%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                <Sparkles className="h-4 w-4" />
                DiTz Store • Percantik Wajah 2026
              </div>
              <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
                Hasil cantik natural, cepat, dan jalan langsung di browser.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Versi ini tidak memakai API AI eksternal. Semua edit dilakukan secara lokal agar lebih simpel, aman, dan mudah dideploy ke Vercel.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.01]">
                  <UploadCloud className="h-4 w-4" />
                  Upload Foto
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
                </label>
                <button onClick={processImage} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15">
                  <Wand2 className="h-4 w-4" />
                  Proses Lokal
                </button>
                <button onClick={download} disabled={!result} className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">
                  <Download className="h-4 w-4" />
                  Download Hasil
                </button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['No API', 'Semua proses lokal di browser'],
                  ['Natural Look', 'Filter lembut, tidak berlebihan'],
                  ['Vercel Ready', 'Deploy cepat tanpa backend AI'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-sm font-medium text-white">{title}</div>
                    <div className="mt-1 text-sm text-slate-400">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-4 shadow-xl">
              <div className="mb-4 grid grid-cols-2 gap-3 rounded-2xl bg-white/5 p-2">
                <button onClick={() => setMode('smart')} className={`rounded-xl px-4 py-3 text-sm font-medium ${mode === 'smart' ? 'bg-white text-slate-950' : 'text-slate-300'}`}>
                  Smart Mode
                </button>
                <button onClick={() => setMode('manual')} className={`rounded-xl px-4 py-3 text-sm font-medium ${mode === 'manual' ? 'bg-white text-slate-950' : 'text-slate-300'}`}>
                  Manual Mode
                </button>
              </div>

              <ImageEditor before={image} after={result} loading={loading} />
              <p className="mt-4 text-sm text-slate-400">{desc}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-white">
              <SlidersHorizontal className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Kontrol Percantik</h2>
            </div>

            <div className="space-y-5">
              {Object.entries(controls).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span className="capitalize">{key}</span>
                    <span>{value}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={value}
                    onChange={(e) => setControls((prev) => ({ ...prev, [key]: Number(e.target.value) } as Controls))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              ))}
            </div>

            <button onClick={processImage} className="mt-6 w-full rounded-2xl bg-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:brightness-110">
              Terapkan Perubahan
            </button>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Catatan Teknis</h2>
            </div>
            <div className="space-y-3 text-sm leading-7 text-slate-300">
              <p>Smart Mode di sini bukan model AI server-side, tetapi preset otomatis berbasis filter natural.</p>
              <p>Kalau nanti kamu mau versi benar-benar AI, kita bisa sambungkan ke model lokal terpisah atau service khusus.</p>
              <p>Versi ini paling cocok untuk cepat launch, hemat biaya, dan bebas dependensi API.</p>
            </div>
          </div>
        </div>
      </section>
      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}
