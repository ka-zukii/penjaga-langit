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
      {/* POJOK KIRI ATAS: KONTROL & STAGE INDICATOR COMPACT */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-2 z-30">
        <button
          onClick={onBackToMenu}
          title="Kembali ke Menu Utama"
          className="w-8 h-8 rounded-xl bg-slate-950/40 hover:bg-slate-800/80 backdrop-blur-xs border border-slate-700/50 flex items-center justify-center text-slate-200 transition-all active:scale-90 shadow-sm"
        >
          <LuArrowLeft className="w-4 h-4 text-sky-400" />
        </button>

        <button
          onClick={onTogglePause}
          title={gameMode === "PAUSED" ? "Lanjutkan" : "Jeda"}
          className="w-8 h-8 rounded-xl bg-slate-950/40 hover:bg-slate-800/80 backdrop-blur-xs border border-slate-700/50 flex items-center justify-center text-slate-200 transition-all active:scale-90 shadow-sm"
        >
          {gameMode === "PAUSED" ? (
            <LuPlay className="w-4 h-4 text-green-400 fill-green-400" />
          ) : (
            <LuPause className="w-4 h-4 text-yellow-400" />
          )}
        </button>

        {/* STAGE & PROGRESS MINI CONTAINER */}
        <div className="flex flex-col gap-0.5 bg-slate-950/40 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-slate-800/80 w-28 sm:w-36">
          <div className="flex items-center justify-between text-[10px] font-black tracking-wider">
            {isBossStage ? (
              <span className="text-red-400 flex items-center gap-1 animate-pulse">
                <LuSkull className="w-3 h-3 text-red-400" /> BOSS
              </span>
            ) : (
              <span className="text-sky-200 flex items-center gap-1">
                <LuZap className="w-3 h-3 text-yellow-400 fill-yellow-400" />{" "}
                STG {stage}
              </span>
            )}
            <span className="text-[9px] text-sky-400 font-extrabold">
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

      {/* AREA TENGAH ATAS: KOSONG TOTAL UNTUK PANDANGAN ARENA PERTEMPURAN */}

      {/* POJOK KANAN ATAS: SKOR & DARA/HP */}
      <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5 z-30">
        <div className="bg-slate-950/40 backdrop-blur-xs px-3 py-1 rounded-xl border border-slate-800/80 font-black text-sky-300 text-xs shadow-sm tracking-wider">
          SKOR:{" "}
          <span className="text-yellow-400">{score.toLocaleString()}</span>
        </div>
        <div className="flex gap-1.5 bg-slate-950/40 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-slate-800/80 shadow-sm">
          {[...Array(3)].map((_, i) => (
            <LuHeart
              key={i}
              className={`w-3.5 h-3.5 transition-all ${
                i < playerHp
                  ? "text-red-500 fill-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]"
                  : "text-slate-700/80"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
