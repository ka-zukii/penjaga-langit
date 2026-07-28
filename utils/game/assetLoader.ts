export type GameAssets = {
  skyTopImg: HTMLImageElement;
  sunImg: HTMLImageElement;
  playerImg: HTMLImageElement;
  bulletImg: HTMLImageElement;
  enemyImg: HTMLImageElement;
  kamikazeImg: HTMLImageElement;
  bossImg: HTMLImageElement;
  enemyVariants: HTMLImageElement[];
  explosionFrames: HTMLImageElement[];
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

  // LOAD 8 VARIAN PESAWAT MUSUH
  const enemyVariantSources = [
    "/images/enemies/plane_1_blue.png",
    "/images/enemies/plane_1_pink.png",
    "/images/enemies/plane_1_red.png",
    "/images/enemies/plane_1_yellow.png",
    "/images/enemies/plane_3_blue.png",
    "/images/enemies/plane_3_green.png",
    "/images/enemies/plane_3_red.png",
    "/images/enemies/plane_3_yellow.png",
  ];

  const enemyVariants: HTMLImageElement[] = enemyVariantSources.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  });

  // LOAD 9 FRAME LEDAKAN
  const explosionFrames: HTMLImageElement[] = [];
  for (let i = 1; i <= 9; i++) {
    const img = new Image();
    img.src = `/images/explosions/explosion_0${i}.png`;
    explosionFrames.push(img);
  }

  return {
    skyTopImg,
    sunImg,
    playerImg,
    bulletImg,
    enemyImg,
    kamikazeImg,
    bossImg,
    enemyVariants,
    explosionFrames,
  };
}
