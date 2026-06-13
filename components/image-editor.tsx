'use client';

export default function ImageEditor({ before, after, loading }: { before: string | null; after: string | null; loading: boolean; }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel title="Before" src={before} empty="Upload foto untuk melihat before" />
      <Panel title="After" src={after} empty={loading ? 'Sedang memproses...' : 'Hasil muncul di sini'} />
    </div>
  );
}

function Panel({ title, src, empty }: { title: string; src: string | null; empty: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <div className="border-b border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">{title}</div>
      {src ? <img src={src} alt={title} className="h-80 w-full object-cover" /> : <div className="flex h-80 items-center justify-center p-6 text-center text-sm text-slate-400">{empty}</div>}
    </div>
  );
}
