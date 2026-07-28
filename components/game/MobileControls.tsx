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

  // State Posisi Knob Joystick (x, y)
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

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

  // Helper untuk mengirim event keyboard (WASD) ke Game Engine
  const setKeyState = (code: string, active: boolean) => {
    window.dispatchEvent(
      new KeyboardEvent(active ? "keydown" : "keyup", { code }),
    );
  };

  // Logika Kalkulasi Pergerakan Joystick (360 / 8-Arah / Diagonal)
  const handleJoystickMove = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);
    const maxRadius = rect.width / 2 - 10;

    // Batasi Knob agar tidak keluar dari lingkaran dasar Joystick
    const angle = Math.atan2(deltaY, deltaX);
    const clampedDistance = Math.min(distance, maxRadius);
    const knobX = Math.cos(angle) * clampedDistance;
    const knobY = Math.sin(angle) * clampedDistance;

    setKnobPos({ x: knobX, y: knobY });

    // Deadzone (jarak minimal geser agar tidak terpicu tidak sengaja)
    const deadzone = 12;

    // Trigger Key Down/Up berdasarkan arah geser knob (Memungkinkan Serong!)
    setKeyState("KeyW", deltaY < -deadzone); // Atas
    setKeyState("KeyS", deltaY > deadzone); // Bawah
    setKeyState("KeyA", deltaX < -deadzone); // Kiri
    setKeyState("KeyD", deltaX > deadzone); // Kanan
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
    <div className="absolute inset-0 pointer-events-none z-40 select-none flex justify-between items-end p-3 sm:p-5">
      {/* 🕹️ VIRTUAL JOYSTICK 8-ARAH (SERONG / DIAGONAL) */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={resetJoystick}
        onTouchCancel={resetJoystick}
        className="pointer-events-auto relative w-32 h-32 sm:w-36 sm:h-36 bg-slate-950/50 backdrop-blur-md rounded-full border-2 border-sky-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.2)] touch-none"
      >
        {/* Ring Arah Panah Panduan */}
        <div className="absolute inset-2 rounded-full border border-dashed border-sky-400/20 pointer-events-none" />

        {/* Knob Yang Digeser Jempol */}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-sky-400 to-blue-600 border-2 border-white shadow-[0_0_15px_rgba(56,189,248,0.6)] flex items-center justify-center transition-transform duration-75 pointer-events-none"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        >
          <div className="w-5 h-5 rounded-full bg-white/40 border border-white/60" />
        </div>
      </div>

      {/* 🎯 TOMBOL TEMBAK SPASI (POJOK KANAN BAWAH) */}
      <div className="pointer-events-auto mb-1 mr-1">
        <button
          onTouchStart={() => setKeyState("Space", true)}
          onTouchEnd={() => setKeyState("Space", false)}
          onMouseDown={() => setKeyState("Space", true)}
          onMouseUp={() => setKeyState("Space", false)}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 active:from-red-400 active:to-red-600 backdrop-blur-md border-2 border-red-300 flex items-center justify-center text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] active:scale-90 transition-all"
        >
          <LuCrosshair className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" />
        </button>
      </div>
    </div>
  );
}
