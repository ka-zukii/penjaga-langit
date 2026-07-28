"use client";

import { useEffect, useState } from "react";
import {
  LuTrophy,
  LuX,
  LuCrown,
  LuMedal,
  LuSparkles,
  LuFlame,
  LuChevronRight,
  LuAward,
  LuShieldAlert,
} from "react-icons/lu";
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

  const renderGroupHeader = (
    title: string,
    colorStyle: string,
    icon: React.ReactNode,
  ) => (
    <div
      className={`my-2 px-3 py-1.5 rounded-lg border text-xs font-black tracking-widest uppercase flex items-center gap-2 backdrop-blur-md shadow-md ${colorStyle}`}
    >
      {icon}
      <span>{title}</span>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 flex items-center justify-center p-3 sm:p-5 overflow-hidden animate-fade-in text-white select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* CARD MODAL PROPORSIONAL (TIDAK TERLALU LEBAR) */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xs">
        {/* 1. HEADER MODAL */}
        <div className="flex justify-between items-center border-b border-sky-400/30 pb-3 bg-slate-950/30 px-3.5 py-2 rounded-xl backdrop-blur-md border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                <LuTrophy className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-widest text-white uppercase flex items-center gap-1.5">
                Papan Peringkat{" "}
                <LuSparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-[10px] sm:text-xs text-sky-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
                Top 100 Pilot Penjaga Langit{" "}
                <LuFlame className="w-3.5 h-3.5 text-orange-400" />
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-red-500/30 border border-slate-700/80 hover:border-red-400 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95 shadow-md"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        {/* 2. AREA LIST LEADERBOARD */}
        <div className="flex-1 flex flex-col min-h-0 my-3">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 gap-2.5 text-slate-200 bg-slate-950/20 backdrop-blur-xs rounded-xl border border-slate-800/40">
              <div className="w-7 h-7 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-black uppercase tracking-widest">
                Memuat Data Top 100...
              </p>
            </div>
          ) : scores.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-12 text-xs text-slate-300 font-bold uppercase bg-slate-950/20 backdrop-blur-xs rounded-xl border border-slate-800/40">
              Belum ada data skor tersimpan.
            </div>
          ) : (
            <div className="flex-1 bg-slate-950/30 border border-slate-800/60 rounded-xl flex flex-col overflow-hidden backdrop-blur-xs">
              {/* Table Header */}
              <div className="grid grid-cols-12 px-3 py-2 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-950/70 border-b border-slate-800/80 shrink-0 backdrop-blur-md">
                <span className="col-span-2 text-center">RANK</span>
                <span className="col-span-5">PILOT</span>
                <span className="col-span-2 text-center">STAGE</span>
                <span className="col-span-3 text-right">SKOR</span>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 scrollbar-thin scrollbar-thumb-sky-500/50 scrollbar-track-transparent">
                {scores.map((item, index) => {
                  const rank = index + 1;
                  const isTop3 = rank <= 3;
                  const isTop10 = rank <= 10;

                  return (
                    <div key={item.id} className="flex flex-col">
                      {/* COLORFUL DIVISION HEADERS */}
                      {rank === 1 &&
                        renderGroupHeader(
                          "TOP 3 PILOTS",
                          "bg-gradient-to-r from-amber-500/80 via-yellow-500/70 to-orange-500/60 border-amber-300/80 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]",
                          <LuCrown className="w-4 h-4 text-yellow-200" />,
                        )}

                      {rank === 4 &&
                        renderGroupHeader(
                          "TOP 10 PILOTS",
                          "bg-gradient-to-r from-cyan-500/80 via-sky-500/70 to-blue-600/60 border-cyan-300/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]",
                          <LuAward className="w-4 h-4 text-cyan-200" />,
                        )}

                      {rank === 11 &&
                        renderGroupHeader(
                          "TOP 50 PILOTS",
                          "bg-gradient-to-r from-fuchsia-600/80 via-purple-600/70 to-pink-600/60 border-fuchsia-300/80 text-white shadow-[0_0_15px_rgba(192,38,211,0.3)]",
                          <LuSparkles className="w-4 h-4 text-fuchsia-200" />,
                        )}

                      {rank === 51 &&
                        renderGroupHeader(
                          "TOP 100 PILOTS",
                          "bg-gradient-to-r from-emerald-500/80 via-teal-600/70 to-green-600/60 border-emerald-300/80 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]",
                          <LuShieldAlert className="w-4 h-4 text-emerald-200" />,
                        )}

                      {/* ITEM ROW */}
                      <div
                        className={`grid grid-cols-12 items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all backdrop-blur-xs ${
                          isTop3
                            ? "bg-amber-500/15 border border-amber-400/40 text-amber-100"
                            : isTop10
                              ? "bg-sky-500/15 border border-sky-400/40 text-sky-100"
                              : "bg-slate-950/25 border border-slate-800/40 text-slate-200 hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="col-span-2 text-center font-black text-xs sm:text-sm">
                          {rank === 1 ? (
                            <span className="text-yellow-400 flex items-center justify-center gap-1">
                              <LuCrown className="w-3.5 h-3.5" /> #1
                            </span>
                          ) : rank === 2 ? (
                            <span className="text-slate-200 flex items-center justify-center gap-1">
                              <LuMedal className="w-3.5 h-3.5" /> #2
                            </span>
                          ) : rank === 3 ? (
                            <span className="text-amber-400 flex items-center justify-center gap-1">
                              <LuMedal className="w-3.5 h-3.5" /> #3
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold">
                              #{rank}
                            </span>
                          )}
                        </div>

                        <div className="col-span-5 font-black text-xs sm:text-sm truncate pr-2 flex items-center gap-1 tracking-wide">
                          <span className="truncate text-white">
                            {item.username}
                          </span>
                          {isTop10 && (
                            <LuChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          )}
                        </div>

                        <div className="col-span-2 text-center">
                          <span className="text-[10px] font-black text-sky-300 bg-sky-950/70 px-2 py-0.5 rounded-md border border-sky-700/60">
                            STG {item.stage}
                          </span>
                        </div>

                        <div className="col-span-3 text-right font-black text-amber-300 text-xs sm:text-sm tracking-wider">
                          {item.score.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. FOOTER BUTTON */}
        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-linear-to-r from-sky-500 via-blue-600 to-sky-500 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] active:scale-98 text-xs uppercase"
          >
            Kembali Ke Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
}
