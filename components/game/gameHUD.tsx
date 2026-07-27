"use client";

import {
  LuArrowLeft,
  LuHeart,
  LuPause,
  LuPlay,
  LuZap,
  LuSkull,
} from "react-icons/lu";

type GameHUDProps = {
  score: number;
  playerHp: number;
  stage: number;
  stageProgress: number;
  isBossStage: boolean;
  gameMode: string;
  onBackToMenu: () => void;
  onTogglePause: () => void;
};

export function GameHUD({
  score,
  playerHp,
  stage,
  stageProgress,
  isBossStage,
  gameMode,
  onBackToMenu,
  onTogglePause,
}: GameHUDProps) {
  if (gameMode !== "PLAYING" && gameMode !== "PAUSED") return null;

  return (
    <>
      {/* POJOK KIRI ATAS: PAUSE & KEMBALI */}
      <div className="absolute top-3 left-3 flex gap-2 z-30">
        <button
          onClick={onBackToMenu}
          title="Kembali ke Menu Utama"
          className="w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-slate-200 transition-all hover:scale-110 active:scale-95 shadow-lg"
        >
          <LuArrowLeft className="w-5 h-5 text-sky-400" />
        </button>
        <button
          onClick={onTogglePause}
          title={gameMode === "PAUSED" ? "Lanjutkan" : "Jeda"}
          className="w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-slate-200 transition-all hover:scale-110 active:scale-95 shadow-lg"
        >
          {gameMode === "PAUSED" ? (
            <LuPlay className="w-5 h-5 text-green-400 fill-green-400" />
          ) : (
            <LuPause className="w-5 h-5 text-yellow-400" />
          )}
        </button>
      </div>

      {/* TENGAH ATAS: STAGE INDICATOR & PROGRESS BAR (DIBUAT SANGAT CLEAR & EMBOSSED) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-30 w-60">
        <div className="bg-slate-950/90 backdrop-blur-md px-4 py-1 rounded-full border border-sky-500/40 shadow-xl shadow-sky-950/50 flex items-center gap-1.5">
          {isBossStage ? (
            <span className="text-sm font-black tracking-widest text-red-500 flex items-center gap-1.5 animate-pulse drop-shadow-[0_2px_4px_rgba(239,68,68,0.8)]">
              <LuSkull className="w-4 h-4 text-red-400" /> BOSS STAGE {stage}
            </span>
          ) : (
            <span className="text-sm font-black tracking-widest text-sky-200 flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              <LuZap className="w-4 h-4 text-yellow-400 fill-yellow-400" />{" "}
              STAGE {stage}
            </span>
          )}
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-950/90 backdrop-blur border border-slate-700/90 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isBossStage
                ? "bg-linear-to-r from-red-600 via-orange-500 to-amber-400 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                : "bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
            }`}
            style={{ width: `${isBossStage ? 100 : stageProgress}%` }}
          />
        </div>
      </div>

      {/* POJOK KANAN ATAS: SKOR & HP */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-30">
        <div className="bg-slate-950/90 backdrop-blur-md px-3.5 py-1 rounded-xl border border-slate-700/80 font-black text-sky-300 text-sm shadow-lg">
          SKOR: <span className="text-yellow-400">{score}</span>
        </div>
        <div className="flex gap-1.5 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/80 shadow-lg">
          {[...Array(3)].map((_, i) => (
            <LuHeart
              key={i}
              className={`w-4 h-4 transition-all ${
                i < playerHp
                  ? "text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]"
                  : "text-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
