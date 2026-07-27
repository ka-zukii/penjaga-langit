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

  const dispatchKey = (code: string, type: "keydown" | "keyup") => {
    window.dispatchEvent(new KeyboardEvent(type, { code }));
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40 select-none flex justify-between items-end p-2 sm:p-4">
      {/* D-PAD ERGONOMIS (POJOK KIRI BAWAH) */}
      <div className="pointer-events-auto relative w-28 h-28 sm:w-32 sm:h-32 bg-slate-950/40 backdrop-blur-xs rounded-full border border-slate-700/50 flex items-center justify-center">
        {/* Atas */}
        <button
          onTouchStart={() => dispatchKey("KeyW", "keydown")}
          onTouchEnd={() => dispatchKey("KeyW", "keyup")}
          onMouseDown={() => dispatchKey("KeyW", "keydown")}
          onMouseUp={() => dispatchKey("KeyW", "keyup")}
          className="absolute top-1 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900/80 active:bg-sky-500/80 border border-slate-700 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <LuArrowUp className="w-5 h-5" />
        </button>

        {/* Kiri */}
        <button
          onTouchStart={() => dispatchKey("KeyA", "keydown")}
          onTouchEnd={() => dispatchKey("KeyA", "keyup")}
          onMouseDown={() => dispatchKey("KeyA", "keydown")}
          onMouseUp={() => dispatchKey("KeyA", "keyup")}
          className="absolute left-1 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900/80 active:bg-sky-500/80 border border-slate-700 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <LuArrowLeft className="w-5 h-5" />
        </button>

        {/* Kanan */}
        <button
          onTouchStart={() => dispatchKey("KeyD", "keydown")}
          onTouchEnd={() => dispatchKey("KeyD", "keyup")}
          onMouseDown={() => dispatchKey("KeyD", "keydown")}
          onMouseUp={() => dispatchKey("KeyD", "keyup")}
          className="absolute right-1 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900/80 active:bg-sky-500/80 border border-slate-700 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <LuArrowRight className="w-5 h-5" />
        </button>

        {/* Bawah */}
        <button
          onTouchStart={() => dispatchKey("KeyS", "keydown")}
          onTouchEnd={() => dispatchKey("KeyS", "keyup")}
          onMouseDown={() => dispatchKey("KeyS", "keydown")}
          onMouseUp={() => dispatchKey("KeyS", "keyup")}
          className="absolute bottom-1 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900/80 active:bg-sky-500/80 border border-slate-700 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <LuArrowDown className="w-5 h-5" />
        </button>
      </div>

      {/* TOMBOL TEMBAK SPASI (POJOK KANAN BAWAH) */}
      <div className="pointer-events-auto mb-1 mr-1">
        <button
          onTouchStart={() => dispatchKey("Space", "keydown")}
          onTouchEnd={() => dispatchKey("Space", "keyup")}
          onMouseDown={() => dispatchKey("Space", "keydown")}
          onMouseUp={() => dispatchKey("Space", "keyup")}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600/80 active:bg-red-500 backdrop-blur-md border-2 border-red-400 flex items-center justify-center text-white shadow-xl shadow-red-950/60 active:scale-90 transition-transform"
        >
          <LuCrosshair className="w-7 h-7 sm:w-8 sm:h-8" />
        </button>
      </div>
    </div>
  );
}
