"use client";

import { LuCheck, LuFileSliders, LuX } from "react-icons/lu";

type SettingsMenuProps = {
  bgmVolume: number;
  controlType: "WASD" | "ARROWS";
  parallaxEnabled: boolean;
  onSetBgmVolume: (val: number) => void;
  onUpdateControlType: (type: "WASD" | "ARROWS") => void;
  onUpdateParallaxEnabled: (enabled: boolean) => void;
  onBackToMenu: () => void;
};

export function SettingsMenu({
  bgmVolume,
  controlType,
  parallaxEnabled,
  onSetBgmVolume,
  onUpdateControlType,
  onUpdateParallaxEnabled,
  onBackToMenu,
}: SettingsMenuProps) {
  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="relative bg-slate-900/90 border border-slate-700/80 p-6 rounded-2xl w-full max-w-md flex flex-col gap-5 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <LuFileSliders className="w-5 h-5 text-sky-400" />
            <h3 className="text-xl font-black tracking-wider text-white">
              PENGATURAN
            </h3>
          </div>
          <button
            onClick={onBackToMenu}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          {/* Slider BGM */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>VOLUME MUSIK (BGM)</span>
              <span className="text-sky-400">{bgmVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={bgmVolume}
              onChange={(e) => onSetBgmVolume(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* Pilih Kontrol */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-300 font-semibold">
              SKEMA KONTROL
            </span>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => onUpdateControlType("WASD")}
                className={`px-3 py-1 rounded-md transition-all font-bold ${
                  controlType === "WASD"
                    ? "bg-sky-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                WASD
              </button>
              <button
                onClick={() => onUpdateControlType("ARROWS")}
                className={`px-3 py-1 rounded-md transition-all font-bold ${
                  controlType === "ARROWS"
                    ? "bg-sky-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                PANAH
              </button>
            </div>
          </div>

          {/* Parallax Toggle */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-slate-300 font-semibold">
              EFEK BACKGROUND PARALLAX
            </span>
            <button
              onClick={() => onUpdateParallaxEnabled(!parallaxEnabled)}
              className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                parallaxEnabled
                  ? "bg-sky-500 border-sky-400 text-slate-950"
                  : "bg-slate-800 border-slate-700 text-transparent"
              }`}
            >
              <LuCheck className="w-4 h-4 stroke-3" />
            </button>
          </div>
        </div>

        <button
          onClick={onBackToMenu}
          className="mt-2 w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black tracking-wider rounded-xl transition-all shadow-lg active:scale-95"
        >
          SIMPAN & KEMBALI
        </button>
      </div>
    </div>
  );
}
