"use client";

import { useState, useEffect } from "react";
import { usePenjagaLangit } from "@/hooks/usePenjagaLangit";
import {
  LuVolume2,
  LuVolumeX,
  LuInfo,
  LuPlane,
  LuRotateCcw,
  LuMaximize,
  LuMinimize,
} from "react-icons/lu";

import { GameHUD } from "./game/gameHUD";
import { MainMenu } from "./game/MainMenu";
import { SettingsMenu } from "./game/SettingsMenu";
import { GameOverMenu } from "./game/GameOverMenu";
import { CreditsModal } from "./game/CreditsModal";
import { MobileControls } from "./game/MobileControls";
import { HighScoreModal } from "./game/HighScoreModal";

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
    openHighScore,
    stage,
    stageProgress,
    isBossStage,
  } = usePenjagaLangit(800, 450);

  const [showCredits, setShowCredits] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Gagal masuk mode Fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="relative w-screen h-dvh bg-slate-950 text-white font-sans p-1 sm:p-3 select-none overflow-hidden flex flex-col justify-between items-center">
      <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6 text-center portrait:flex landscape:hidden">
        <LuRotateCcw className="w-12 h-12 text-sky-400 animate-spin mb-4" />
        <h3 className="text-xl font-black text-white mb-2">
          PUTAR LAYAR PONSEL
        </h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Game ini dirancang untuk dimainkan dalam mode horizontal (Landscape).
        </p>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-5xl flex justify-between items-center px-2 z-10 shrink-0 h-8">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold tracking-widest text-sky-400/90 uppercase flex items-center gap-1">
            <LuPlane className="w-3.5 h-3.5" /> AIR COMBAT SYSTEM
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleAudioMute}
            title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
            className="w-7 h-7 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-200 shadow-md active:scale-90 transition-all"
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
            className="w-7 h-7 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-slate-200 shadow-md active:scale-90 transition-all"
          >
            <LuInfo className="w-3.5 h-3.5 text-sky-400" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
            className="w-7 h-7 rounded-full bg-sky-950/80 hover:bg-sky-800/90 backdrop-blur-md border border-sky-500/60 flex items-center justify-center text-sky-300 shadow-md active:scale-90 transition-all"
          >
            {isFullscreen ? (
              <LuMinimize className="w-3.5 h-3.5" />
            ) : (
              <LuMaximize className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center min-h-0 z-10 my-1">
        <div className="relative w-full h-full max-h-full aspect-[16/9] border border-slate-700/60 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(14,165,233,0.15)] bg-slate-900 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            className="w-full h-full block object-contain"
          />

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

          <MobileControls gameMode={gameMode} />

          {gameMode === "MENU" && (
            <MainMenu
              onStartGame={startGame}
              onOpenSettings={openSettings}
              onOpenHighScore={openHighScore}
            />
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

          {gameMode === "HIGHSCORE" && <HighScoreModal onClose={backToMenu} />}

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
              stage={stage}
              onStartGame={startGame}
              onBackToMenu={backToMenu}
            />
          )}
        </div>
      </div>
    </div>
  );
}
