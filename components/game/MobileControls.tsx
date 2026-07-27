"use client";

import { useEffect, useState } from "react";
import {
  LuArrowUp,
  LuArrowDown,
  LuArrowLeft,
  LuArrowRight,
  LuCrosshair,
} from "react-icons/lu";

type MobileControlsProps = {
  gameMode: string;
};

export function MobileControls({ gameMode }: MobileControlsProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Deteksi apakah perangkat menggunakan layar sentuh / mobile
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0,
      );
    };
    checkTouch();
  }, []);

  if (!isTouchDevice || (gameMode !== "PLAYING" && gameMode !== "PAUSED")) {
    return null;
  }

  // Helper untuk mensimulasikan event Keyboard di layar sentuh
  const dispatchKey = (code: string, type: "keydown" | "keyup") => {
    window.dispatchEvent(new KeyboardEvent(type, { code }));
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none">
      {/* VIRTUAL D-PAD (GERAK) - POJOK KIRI BAWAH */}
      <div className="absolute bottom-4 left-4 pointer-events-auto flex flex-col items-center gap-1">
        {/* Atas */}
        <button
          onTouchStart={() => dispatchKey("KeyW", "keydown")}
          onTouchEnd={() => dispatchKey("KeyW", "keyup")}
          onMouseDown={() => dispatchKey("KeyW", "keydown")}
          onMouseUp={() => dispatchKey("KeyW", "keyup")}
          className="w-12 h-12 rounded-xl bg-slate-900/70 active:bg-sky-500/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
        >
          <LuArrowUp className="w-6 h-6" />
        </button>

        <div className="flex gap-2">
          {/* Kiri */}
          <button
            onTouchStart={() => dispatchKey("KeyA", "keydown")}
            onTouchEnd={() => dispatchKey("KeyA", "keyup")}
            onMouseDown={() => dispatchKey("KeyA", "keydown")}
            onMouseUp={() => dispatchKey("KeyA", "keyup")}
            className="w-12 h-12 rounded-xl bg-slate-900/70 active:bg-sky-500/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
          >
            <LuArrowLeft className="w-6 h-6" />
          </button>

          {/* Bawah */}
          <button
            onTouchStart={() => dispatchKey("KeyS", "keydown")}
            onTouchEnd={() => dispatchKey("KeyS", "keyup")}
            onMouseDown={() => dispatchKey("KeyS", "keydown")}
            onMouseUp={() => dispatchKey("KeyS", "keyup")}
            className="w-12 h-12 rounded-xl bg-slate-900/70 active:bg-sky-500/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
          >
            <LuArrowDown className="w-6 h-6" />
          </button>

          {/* Kanan */}
          <button
            onTouchStart={() => dispatchKey("KeyD", "keydown")}
            onTouchEnd={() => dispatchKey("KeyD", "keyup")}
            onMouseDown={() => dispatchKey("KeyD", "keydown")}
            onMouseUp={() => dispatchKey("KeyD", "keyup")}
            className="w-12 h-12 rounded-xl bg-slate-900/70 active:bg-sky-500/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
          >
            <LuArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* VIRTUAL SHOOT BUTTON (TEMBAK) - POJOK KANAN BAWAH */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <button
          onTouchStart={() => dispatchKey("Space", "keydown")}
          onTouchEnd={() => dispatchKey("Space", "keyup")}
          onMouseDown={() => dispatchKey("Space", "keydown")}
          onMouseUp={() => dispatchKey("Space", "keyup")}
          className="w-16 h-16 rounded-full bg-red-600/80 active:bg-red-500 backdrop-blur-md border-2 border-red-400 flex items-center justify-center text-white shadow-xl shadow-red-950/50 active:scale-90 transition-all"
        >
          <LuCrosshair className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
