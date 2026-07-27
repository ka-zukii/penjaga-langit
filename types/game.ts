export type GameStateUI =
  | "MENU"
  | "PLAYING"
  | "PAUSED"
  | "GAMEOVER"
  | "SETTINGS";

export type GameObject = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
};

export type Player = GameObject & {
  hp: number;
  maxHp: number;
  rotation?: number;
};

export type EnemyType = "NORMAL" | "KAMIKAZE" | "BOSS";

export type Enemy = GameObject & {
  type: EnemyType;
  hp: number;
  maxHp: number;
  lastShotTime?: number;
  targetY?: number;
};

export type Bullet = GameObject;
