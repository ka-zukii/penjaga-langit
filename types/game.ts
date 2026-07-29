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
  variantIndex?: number;
  lastShotTime?: number;
  targetY?: number;
  sineOffset?: number;
};

export type Bullet = GameObject & {
  vy?: number;
  isEnemy?: boolean;
};

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

export type DropItem = {
  id: string;
  type: "HEAL";
  x: number;
  y: number;
  width: number;
  height: number;
  speedY: number;
  swingOffset: number;
};
