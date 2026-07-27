"use client";

type GameOverMenuProps = {
  score: number;
  onStartGame: () => void;
  onBackToMenu: () => void;
};

export function GameOverMenu({
  score,
  onStartGame,
  onBackToMenu,
}: GameOverMenuProps) {
  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 text-center p-6 z-20">
      <div>
        <span className="text-red-500 text-sm font-bold tracking-widest uppercase">
          MISI GAGAL
        </span>
        <h2 className="text-5xl font-black text-white mt-1">PESAWAT JATUH!</h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-xs">
        <p className="text-slate-400 text-sm">SKOR AKHIR</p>
        <p className="text-4xl font-black text-yellow-400 mt-1">{score}</p>
      </div>

      <div className="flex gap-4 w-full max-w-xs">
        <button
          onClick={onStartGame}
          className="flex-1 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          TERBANG LAGI
        </button>
        <button
          onClick={onBackToMenu}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-xl transition-all border border-slate-700"
        >
          MENU
        </button>
      </div>
    </div>
  );
}
