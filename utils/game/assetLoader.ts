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

export function loadGameAssetsWithProgress(
  onProgress: (percent: number) => void,
): Promise<GameAssets> {
  return new Promise((resolve) => {
    const imagesToLoad: {
      key: string;
      src: string;
      isVariant?: boolean;
      index?: number;
    }[] = [
      { key: "skyTopImg", src: "/images/bg/sky_top.png" },
      { key: "sunImg", src: "/images/bg/sun.png" },
      { key: "playerImg", src: "/images/player.png" },
      { key: "bulletImg", src: "/images/bullet.png" },
      { key: "enemyImg", src: "/images/enemy.png" },
      { key: "kamikazeImg", src: "/images/kamikaze.png" },
      { key: "bossImg", src: "/images/boss.png" },
    ];

    // 8 Varian Pesawat
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

    enemyVariantSources.forEach((src, idx) => {
      imagesToLoad.push({
        key: "enemyVariant",
        src,
        isVariant: true,
        index: idx,
      });
    });

    // 9 Frame Ledakan
    for (let i = 1; i <= 9; i++) {
      imagesToLoad.push({
        key: `explosion_${i}`,
        src: `/images/explosions/explosion_0${i}.png`,
      });
    }

    const totalAssets = imagesToLoad.length;
    let loadedAssets = 0;

    const assets: Partial<GameAssets> = {
      enemyVariants: [],
      explosionFrames: [],
    };

    imagesToLoad.forEach((item) => {
      const img = new Image();
      img.src = item.src;

      const handleLoad = () => {
        loadedAssets++;
        const percent = Math.floor((loadedAssets / totalAssets) * 100);
        onProgress(percent);

        if (item.isVariant) {
          assets.enemyVariants![item.index!] = img;
        } else if (item.key.startsWith("explosion_")) {
          const idx = parseInt(item.key.split("_")[1]) - 1;
          assets.explosionFrames![idx] = img;
        } else {
          (assets as Record<string, unknown>)[item.key] = img;
        }

        if (loadedAssets === totalAssets) {
          resolve(assets as GameAssets);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleLoad;
    });
  });
}
