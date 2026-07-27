"use client";

import { LuX } from "react-icons/lu";

export function CreditsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm flex flex-col items-center gap-3 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <LuX className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
          INFORMASI GAME
        </span>
        <h3 className="text-2xl font-black text-white">CREDITS</h3>
        <div className="text-sm text-slate-300 flex flex-col gap-1 my-2">
          <p>
            <b>Pengembang:</b> Tim Penjaga Langit
          </p>
          <p>
            <b>Engine:</b> Next.js & HTML5 Canvas
          </p>
          <p>
            <b>Aset Visual:</b> Custom 2D Sprites
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition-all"
        >
          TUTUP
        </button>
      </div>
    </div>
  );
}
