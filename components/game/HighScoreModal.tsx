"use client";

import { useEffect, useState } from "react";
import { LuTrophy, LuX, LuCrown, LuMedal, LuSparkles } from "react-icons/lu";
import { ScoreEntry } from "@/types/game";

type HighScoreModalProps = {
  onClose: () => void;
};

export function HighScoreModal({ onClose }: HighScoreModalProps) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setScores(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-40 flex flex-col items-center justify-center p-4 overflow-hidden animate-fade-in">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-112.5 h-112.5 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-slate-900/80 border border-slate-700/80 p-5 sm:p-6 rounded-3xl w-full max-w-md flex flex-col gap-4 shadow-[0_0_50px_rgba(14,165,233,0.25)] max-h-[85vh] z-10 backdrop-blur-xl">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              <LuTrophy className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-wider text-white flex items-center gap-1.5">
                PAPAN PERINGKAT{" "}
                <LuSparkles className="w-4 h-4 text-yellow-400" />
              </h3>
              <p className="text-[10px] text-sky-400 font-semibold tracking-wide">
                TOP PILOT PENJAGA LANGIT
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all active:scale-95"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-64 pr-1 flex flex-col gap-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium">Memuat Skor Terbaik...</p>
            </div>
          ) : scores.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-10">
              Belum ada data skor. Jadilah yang pertama!
            </p>
          ) : (
            scores.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-xs font-semibold transition-all backdrop-blur-md ${
                  index === 0
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : index === 1
                      ? "bg-slate-400/20 border-slate-400/50 text-slate-200"
                      : index === 2
                        ? "bg-amber-700/20 border-amber-700/50 text-amber-300"
                        : "bg-slate-950/50 border-slate-800/80 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-black w-5 text-center flex justify-center">
                    {index === 0 ? (
                      <LuCrown className="w-4 h-4 text-yellow-400" />
                    ) : index === 1 || index === 2 ? (
                      <LuMedal className="w-4 h-4 text-slate-300" />
                    ) : (
                      <span className="text-slate-500">#{index + 1}</span>
                    )}
                  </span>
                  <span className="font-bold truncate max-w-25 sm:max-w-32.5">
                    {item.username}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-sky-300 font-bold bg-sky-950/80 px-2 py-0.5 rounded-lg border border-sky-800/80">
                    STAGE {item.stage}
                  </span>
                  <span className="font-black text-yellow-400 w-16 text-right text-sm tracking-wide">
                    {item.score.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] active:scale-95 text-xs uppercase mt-1"
        >
          KEMBALI KE MENU
        </button>
      </div>
    </div>
  );
}
