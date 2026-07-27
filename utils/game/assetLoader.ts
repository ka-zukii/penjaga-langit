export type GameAssets = {
  skyTopImg: HTMLImageElement;
  sunImg: HTMLImageElement;
  playerImg: HTMLImageElement;
  bulletImg: HTMLImageElement;
  enemyImg: HTMLImageElement;
  kamikazeImg: HTMLImageElement;
  bossImg: HTMLImageElement;
};

export function loadGameAssets(): GameAssets {
  const skyTopImg = new Image();
  skyTopImg.src = "/images/bg/sky_top.png";

  const sunImg = new Image();
  sunImg.src = "/images/bg/sun.png";

  const playerImg = new Image();
  playerImg.src = "/images/player.png";

  const bulletImg = new Image();
  bulletImg.src = "/images/bullet.png";

  const enemyImg = new Image();
  enemyImg.src = "/images/enemy.png";

  const kamikazeImg = new Image();
  kamikazeImg.src = "/images/kamikaze.png";

  const bossImg = new Image();
  bossImg.src = "/images/boss.png";

  return {
    skyTopImg,
    sunImg,
    playerImg,
    bulletImg,
    enemyImg,
    kamikazeImg,
    bossImg,
  };
}
