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
  LuRotateCcw,
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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans p-1 sm:p-4 select-none overflow-hidden">
      {/* 1. PERINGATAN PUTAR LAYAR HP (HANYA MUNCUL JIKA HP DALAM POSISI PORTRAIT) */}
      <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6 text-center portrait:flex landscape:hidden">
        <LuRotateCcw className="w-12 h-12 text-sky-400 animate-spin mb-4" />
        <h3 className="text-xl font-black text-white mb-2">
          PUTAR LAYAR PONSEL KAMU
        </h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Game ini dirancang untuk dimainkan dalam mode horizontal (Landscape)
          agar kontrol lebih nyaman.
        </p>
      </div>

      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* CONTAINER UTAMA GAME */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">
        {/* HEADER ATAS (RAPI & RINGKAS) */}
        <div className="w-full flex justify-between items-center px-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-sky-400/90 uppercase flex items-center gap-1">
              <LuPlane className="w-3 h-3" /> AIR COMBAT SYSTEM
            </span>
          </div>

          {/* IKON SUARA & CREDITS DIPINDAHKAN KE HEADER ATAS AGAR TIDAK NABRAK D-PAD */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudioMute}
              title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-200 shadow-md"
            >
              {isMuted ? (
                <LuVolumeX className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <LuVolume2 className="w-3.5 h-3.5 text-sky-400" />
              )}
            </button>

            <button
              onClick={() => setShowCredits(true)}
              title="Credits"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-200 shadow-md"
            >
              <LuInfo className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>
        </div>

        {/* FRAME CANVAS ARCADE (PAKSA LANDSCAPE ASPECT RATIO 16:9) */}
        <div className="relative w-full aspect-video border border-slate-700/60 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(14,165,233,0.15)] bg-slate-900">
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            className="w-full h-full block object-contain"
          />

          {/* HUD PLAYING */}
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

          {/* VIRTUAL CONTROLS UNTUK MOBILE */}
          <MobileControls gameMode={gameMode} />

          {/* OVERLAY STATES */}
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
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4">
              <h2 className="text-3xl font-black text-sky-400 tracking-wider">
                GAME DIJEDA
              </h2>
              <button
                onClick={togglePause}
                className="px-6 py-2 bg-sky-500 text-slate-950 font-bold rounded-lg"
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

        {/* FOOTER DESKTOP */}
        <div className="hidden sm:flex mt-3 text-xs text-slate-400 items-center justify-center gap-6 bg-slate-900/60 px-6 py-2 rounded-full border border-slate-800">
          <span className="flex items-center gap-1.5">
            <LuGamepad2 className="w-4 h-4 text-sky-400" />
            <b>Gerak:</b> {controlType === "WASD" ? "W/A/S/D" : "Tombol Panah"}
          </span>
          <span className="flex items-center gap-1.5">
            <LuCrosshair className="w-4 h-4 text-yellow-400" />
            <b>Tembak:</b> Spasi / Touch Button
          </span>
        </div>
      </div>
    </div>
  );
}
