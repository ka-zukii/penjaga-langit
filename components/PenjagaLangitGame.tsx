"use client";

import { useState } from "react";
import { usePenjagaLangit } from "@/hooks/usePenjagaLangit";
import {
  LuVolume2,
  LuVolumeX,
  LuInfo,
  LuGamepad2,
  LuCrosshair,
  LuPlane,
  LuSparkles,
} from "react-icons/lu";

import { GameHUD } from "./game/gameHUD";
import { MainMenu } from "./game/MainMenu";
import { SettingsMenu } from "./game/SettingsMenu";
import { GameOverMenu } from "./game/GameOverMenu";
import { CreditsModal } from "./game/CreditsModal";
import { MobileControls } from "./game/MobileControls";

export default function PenjagaLangitGame() {
  const {
    canvasRef,
    score,
    playerHp,
    gameMode,
    isMuted,
    bgmVolume,
    controlType,
    parallaxEnabled,
    setBgmVolume,
    updateControlType,
    updateParallaxEnabled,
    startGame,
    togglePause,
    toggleAudioMute,
    backToMenu,
    openSettings,
    stage,
    stageProgress,
    isBossStage,
  } = usePenjagaLangit(800, 450);

  const [showCredits, setShowCredits] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans p-2 sm:p-4 select-none overflow-hidden">
      {/* 1. EFEK BACKGROUND LUAR (AMBIENT GLOW & GRID) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* LIGHT ORBS DEKORATIF */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* CONTAINER UTAMA GAME */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
        {/* HEADER ATAS CANVAS */}
        <div className="w-full flex justify-between items-center px-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-sky-400/90 uppercase flex items-center gap-1.5">
              <LuPlane className="w-3.5 h-3.5" /> AIR COMBAT SYSTEM
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-slate-400 bg-slate-900/60 backdrop-blur px-2.5 py-1 rounded-full border border-slate-800">
            <LuSparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>v1.3 — Mobile Support</span>
          </div>
        </div>

        {/* 2. FRAME CANVAS GAMING ARCADE (ASPECT-RATIO RESPONSIF) */}
        <div className="relative w-full aspect-video border-2 border-slate-700/60 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(14,165,233,0.15)] bg-slate-900/90 backdrop-blur-xl">
          {/* ORNAMEN SUDUT HIASAN NEON */}
          <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-sky-400 z-30" />
          <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-sky-400 z-30" />
          <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-sky-400 z-30" />
          <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-sky-400 z-30" />

          {/* CANVAS GAME ENGINE */}
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            className="w-full h-full block object-contain"
          />

          {/* OVERLAY GAMEPLAY HUD */}
          <GameHUD
            score={score}
            playerHp={playerHp}
            gameMode={gameMode}
            onBackToMenu={backToMenu}
            onTogglePause={togglePause}
            stage={stage}
            stageProgress={stageProgress}
            isBossStage={isBossStage}
          />

          {/* CONTROL D-PAD & SHOOT UNTUK PERANGKAT MOBILE */}
          <MobileControls gameMode={gameMode} />

          {/* IKON BULAT DUA POJOK KIRI BAWAH */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex gap-2 sm:gap-2.5 z-30">
            <button
              onClick={toggleAudioMute}
              title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-200 transition-all hover:scale-110 active:scale-95 shadow-md"
            >
              {isMuted ? (
                <LuVolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              ) : (
                <LuVolume2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
              )}
            </button>

            <button
              onClick={() => setShowCredits(true)}
              title="Credits / Pembuat"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-200 transition-all hover:scale-110 active:scale-95 shadow-md"
            >
              <LuInfo className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
            </button>
          </div>

          {/* MODAL / OVERLAY STATES */}
          {gameMode === "MENU" && (
            <MainMenu onStartGame={startGame} onOpenSettings={openSettings} />
          )}

          {gameMode === "SETTINGS" && (
            <SettingsMenu
              bgmVolume={bgmVolume}
              controlType={controlType}
              parallaxEnabled={parallaxEnabled}
              onSetBgmVolume={setBgmVolume}
              onUpdateControlType={updateControlType}
              onUpdateParallaxEnabled={updateParallaxEnabled}
              onBackToMenu={backToMenu}
            />
          )}

          {gameMode === "PAUSED" && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
              <h2 className="text-3xl sm:text-4xl font-black text-sky-400 tracking-wider">
                GAME DIJEDA
              </h2>
              <button
                onClick={togglePause}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition-all"
              >
                LANJUTKAN
              </button>
            </div>
          )}

          {showCredits && (
            <CreditsModal onClose={() => setShowCredits(false)} />
          )}

          {gameMode === "GAMEOVER" && (
            <GameOverMenu
              score={score}
              onStartGame={startGame}
              onBackToMenu={backToMenu}
            />
          )}
        </div>

        {/* 3. FOOTER KONTROL BADGE LENGKAP */}
        <div className="mt-3 sm:mt-5 text-[11px] sm:text-xs text-slate-300 flex items-center justify-center gap-4 sm:gap-8 bg-slate-900/80 backdrop-blur-xl px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-800 shadow-xl w-full">
          <div className="flex items-center gap-2">
            <LuGamepad2 className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-400 hidden sm:inline">
              Navigasi:
            </span>
            {controlType === "WASD" ? (
              <div className="flex gap-1 font-mono font-bold text-sky-300">
                <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">
                  W
                </span>
                <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">
                  A
                </span>
                <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">
                  S
                </span>
                <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">
                  D
                </span>
              </div>
            ) : (
              <span className="font-semibold text-sky-300">
                Tombol Panah (⬆️ ⬇️ ⬅️ ➡️)
              </span>
            )}
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <LuCrosshair className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold text-slate-400 hidden sm:inline">
              Tembak:
            </span>
            <span className="px-2 py-0.5 bg-slate-800 font-mono font-bold text-yellow-300 rounded border border-slate-700">
              SPACE / Touch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
