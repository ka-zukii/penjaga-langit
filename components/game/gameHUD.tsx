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
    <div className="absolute inset-0 pointer-events-none z-30 p-2 sm:p-3 flex justify-between items-start select-none">
      {/* SISI KIRI: NAVIGASI & STAGE INDICATOR COMPACT */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onBackToMenu}
          title="Kembali ke Menu Utama"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-200 transition-all active:scale-90 shadow-sm"
        >
          <LuArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
        </button>

        <button
          onClick={onTogglePause}
          title={gameMode === "PAUSED" ? "Lanjutkan" : "Jeda"}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-200 transition-all active:scale-90 shadow-sm"
        >
          {gameMode === "PAUSED" ? (
            <LuPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 fill-green-400" />
          ) : (
            <LuPause className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
          )}
        </button>

        {/* STAGE & PROGRESS (TERKUNCI PRESISI) */}
        <div className="flex flex-col gap-0.5 bg-slate-950/60 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-800/80 w-24 sm:w-32 shadow-sm">
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-black tracking-wider">
            {isBossStage ? (
              <span className="text-red-400 flex items-center gap-0.5 animate-pulse">
                <LuSkull className="w-2.5 h-2.5 text-red-400" /> BOSS
              </span>
            ) : (
              <span className="text-sky-200 flex items-center gap-0.5">
                <LuZap className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />{" "}
                STG {stage}
              </span>
            )}
            <span className="text-[8px] sm:text-[9px] text-sky-400 font-bold">
              {stageProgress}%
            </span>
          </div>

          <div className="w-full bg-slate-900/90 h-1 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isBossStage ? "bg-red-500 animate-pulse" : "bg-sky-400"
              }`}
              style={{ width: `${isBossStage ? 100 : stageProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* SISI KANAN: SKOR & DARAH/HP */}
      <div className="pointer-events-auto flex flex-col items-end gap-1">
        <div className="bg-slate-950/60 backdrop-blur-md px-2.5 py-0.5 sm:py-1 rounded-lg border border-slate-800/80 font-black text-sky-300 text-[10px] sm:text-xs shadow-sm">
          SKOR:{" "}
          <span className="text-yellow-400">{score.toLocaleString()}</span>
        </div>

        <div className="flex gap-1 bg-slate-950/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-800/80 shadow-sm">
          {[...Array(3)].map((_, i) => (
            <LuHeart
              key={i}
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all ${
                i < playerHp
                  ? "text-red-500 fill-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]"
                  : "text-slate-700/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
