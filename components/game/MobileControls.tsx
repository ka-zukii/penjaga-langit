"use client";

import { useEffect, useState, useRef } from "react";
import { LuCrosshair } from "react-icons/lu";

type MobileControlsProps = {
  gameMode: string;
};

export function MobileControls({ gameMode }: MobileControlsProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkTouch = () => {
      // Deteksi hanya untuk layar sentuh / mobile
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

      setIsTouchDevice(hasTouch);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  // Jangan tampilkan jika bukan perangkat sentuh ATAU sedang di Desktop ATAU bukan mode bermain
  if (!isTouchDevice || (gameMode !== "PLAYING" && gameMode !== "PAUSED")) {
    return null;
  }

  const setKeyState = (code: string, active: boolean) => {
    window.dispatchEvent(
      new KeyboardEvent(active ? "keydown" : "keyup", { code }),
    );
  };

  const handleJoystickMove = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);
    const maxRadius = rect.width / 2 - 8;

    const angle = Math.atan2(deltaY, deltaX);
    const clampedDistance = Math.min(distance, maxRadius);
    const knobX = Math.cos(angle) * clampedDistance;
    const knobY = Math.sin(angle) * clampedDistance;

    setKnobPos({ x: knobX, y: knobY });

    const deadzone = 8;

    setKeyState("KeyW", deltaY < -deadzone);
    setKeyState("KeyS", deltaY > deadzone);
    setKeyState("KeyA", deltaX < -deadzone);
    setKeyState("KeyD", deltaX > deadzone);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    handleJoystickMove(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        handleJoystickMove(
          e.changedTouches[i].clientX,
          e.changedTouches[i].clientY,
        );
        break;
      }
    }
  };

  const resetJoystick = () => {
    touchIdRef.current = null;
    setKnobPos({ x: 0, y: 0 });
    setKeyState("KeyW", false);
    setKeyState("KeyS", false);
    setKeyState("KeyA", false);
    setKeyState("KeyD", false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40 select-none flex justify-between items-end p-2 sm:p-3 md:hidden">
      {/* 🕹️ VIRTUAL JOYSTICK (KHUSUS MOBILE/TABLET) */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={resetJoystick}
        onTouchCancel={resetJoystick}
        className="pointer-events-auto relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-950/20 backdrop-blur-[1px] rounded-full border border-sky-400/25 flex items-center justify-center touch-none active:bg-slate-950/30 transition-colors"
      >
        <div className="absolute inset-1.5 rounded-full border border-dashed border-sky-400/15 pointer-events-none" />

        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-sky-500/40 border border-sky-300/60 shadow-[0_0_10px_rgba(56,189,248,0.2)] flex items-center justify-center transition-transform duration-75 pointer-events-none backdrop-blur-xs"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        >
          <div className="w-3 h-3 rounded-full bg-white/50" />
        </div>
      </div>

      {/* TOMBOL TEMBAK (KHUSUS MOBILE/TABLET) */}
      <div className="pointer-events-auto mb-0.5 mr-0.5">
        <button
          onTouchStart={() => setKeyState("Space", true)}
          onTouchEnd={() => setKeyState("Space", false)}
          onMouseDown={() => setKeyState("Space", true)}
          onMouseUp={() => setKeyState("Space", false)}
          className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-red-600/35 active:bg-red-500/60 backdrop-blur-[1px] border border-red-400/40 flex items-center justify-center text-white/80 active:text-white active:scale-90 transition-all shadow-sm"
        >
          <LuCrosshair className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-xs" />
        </button>
      </div>
    </div>
  );
}
