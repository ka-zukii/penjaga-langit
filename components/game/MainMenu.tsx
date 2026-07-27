"use client";

type MainMenuProps = {
  onStartGame: () => void;
  onOpenSettings: () => void;
  onOpenHighScore: () => void;
};

export function MainMenu({
  onStartGame,
  onOpenSettings,
  onOpenHighScore,
}: MainMenuProps) {
  return (
    <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-slate-950/40 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 animate-pulse">
        <h1 className="text-4xl sm:text-5xl font-black italic tracking-widest text-transparent bg-clip-text bg-linear-to-b from-sky-200 via-sky-400 to-blue-700 drop-shadow-[0_4px_10px_rgba(56,189,248,0.6)]">
          PENJAGA
        </h1>
        <h1 className="text-4xl sm:text-5xl font-black italic tracking-widest text-transparent bg-clip-text bg-linear-to-b from-sky-100 via-sky-300 to-blue-800 drop-shadow-[0_4px_10px_rgba(56,189,248,0.6)] -mt-2">
          LANGIT
        </h1>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs z-10">
        <button
          onClick={onStartGame}
          className="w-full py-2 bg-sky-950/40 hover:bg-sky-500/30 backdrop-blur-md border border-sky-400/40 hover:border-sky-300 text-sky-100 font-extrabold tracking-wider text-base rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          MULAI GAME
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full py-2 bg-sky-950/40 hover:bg-sky-500/30 backdrop-blur-md border border-sky-400/40 hover:border-sky-300 text-sky-100 font-extrabold tracking-wider text-base rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          PENGATURAN
        </button>

        <button
          onClick={onOpenHighScore}
          className="w-full py-2 bg-sky-950/40 hover:bg-sky-500/30 backdrop-blur-md border border-sky-400/40 hover:border-sky-300 text-sky-100 font-extrabold tracking-wider text-base rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          SKOR TINGGI
        </button>
      </div>
    </div>
  );
}
