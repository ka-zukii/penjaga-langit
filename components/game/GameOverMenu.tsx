"use client";

import { useState } from "react";
import { LuCheck, LuTrophy } from "react-icons/lu";

type GameOverMenuProps = {
  score: number;
  stage: number;
  onStartGame: () => void;
  onBackToMenu: () => void;
};

export function GameOverMenu({
  score,
  stage,
  onStartGame,
  onBackToMenu,
}: GameOverMenuProps) {
  const [username, setUsername] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, score, stage }),
      });

      if (res.ok) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Gagal menyimpan skor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 text-center p-6 z-20">
      <div>
        <span className="text-red-500 text-[10px] font-bold tracking-widest uppercase">
          MISI GAGAL
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
          PESAWAT JATUH!
        </h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl w-full max-w-xs flex justify-around items-center">
        <div>
          <p className="text-slate-400 text-[10px] font-semibold">
            STAGE TERTINGGI
          </p>
          <p className="text-lg font-black text-sky-400 mt-0.5">
            STAGE {stage}
          </p>
        </div>
        <div className="h-6 w-px bg-slate-800" />
        <div>
          <p className="text-slate-400 text-[10px] font-semibold">SKOR AKHIR</p>
          <p className="text-lg font-black text-yellow-400 mt-0.5">{score}</p>
        </div>
      </div>

      {!isSaved ? (
        <form
          onSubmit={handleSaveScore}
          className="flex flex-col gap-2 w-full max-w-xs"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan Nama..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={15}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-400"
            />
            <button
              type="submit"
              disabled={!username.trim() || isSubmitting}
              className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
            >
              <LuTrophy className="w-3.5 h-3.5" />
              Simpan
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-950/40 border border-green-800 px-3 py-1.5 rounded-xl">
          <LuCheck className="w-4 h-4" /> Skor Berhasil Disimpan!
        </div>
      )}

      <div className="flex gap-3 w-full max-w-xs mt-1">
        <button
          onClick={onStartGame}
          className="flex-1 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-xs transition-all active:scale-95 shadow-lg"
        >
          TERBANG LAGI
        </button>
        <button
          onClick={onBackToMenu}
          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-xl text-xs transition-all border border-slate-700"
        >
          MENU
        </button>
      </div>
    </div>
  );
}
