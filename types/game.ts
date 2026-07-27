export type GameStateUI =
  | "MENU"
  | "PLAYING"
  | "PAUSED"
  | "GAMEOVER"
  | "SETTINGS"
  | "HIGHSCORE";

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

export type Explosion = {
  x: number;
  y: number;
  width: number;
  height: number;
  currentFrame: number;
  lastFrameTime: number;
  frameDuration: number;
};

export type ScoreEntry = {
  id: string;
  username: string;
  score: number;
  stage: number;
  date: string;
};
