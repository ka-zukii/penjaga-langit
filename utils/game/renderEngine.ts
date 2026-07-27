import { Bullet, Enemy, GameStateUI, Player } from "@/types/game";
import { ParallaxLayer } from "@/utils/ParallaxLayer";
import { GameAssets } from "./assetLoader";

export function renderGame(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  assets: GameAssets,
  layers: ParallaxLayer[],
  mode: GameStateUI,
  player: Player,
  playerBullets: Bullet[],
  enemyBullets: Bullet[],
  enemies: Enemy[],
) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Background Top Sky
  if (assets.skyTopImg.complete && assets.skyTopImg.naturalWidth !== 0) {
    ctx.drawImage(assets.skyTopImg, 0, 0, canvasWidth, canvasHeight);
  } else {
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Sun
  if (assets.sunImg.complete && assets.sunImg.naturalWidth !== 0) {
    ctx.drawImage(assets.sunImg, canvasWidth - 200, 20, 140, 140);
  }

  // Parallax Layers
  layers.forEach((layer) => layer.draw(ctx, canvasWidth));

  // Mode Menu/Settings Animation
  if (mode === "MENU" || mode === "SETTINGS") {
    if (assets.playerImg.complete && assets.playerImg.naturalWidth !== 0) {
      ctx.save();
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
      ctx.rotate(player.rotation || 0);
      ctx.drawImage(
        assets.playerImg,
        (-player.width * 1.3) / 2,
        (-player.height * 1.3) / 2,
        player.width * 1.3,
        player.height * 1.3,
      );
      ctx.restore();
    }
    return;
  }

  // Bullets Player
  playerBullets.forEach((b) => {
    if (assets.bulletImg.complete && assets.bulletImg.naturalWidth !== 0) {
      ctx.drawImage(assets.bulletImg, b.x, b.y, b.width, b.height);
    } else {
      ctx.fillStyle = "#facc15";
      ctx.fillRect(b.x, b.y, b.width, b.height);
    }
  });

  // Bullets Enemy
  ctx.fillStyle = "#ef4444";
  enemyBullets.forEach((eb) => {
    ctx.fillRect(eb.x, eb.y, eb.width, eb.height);
  });

  // Enemies
  enemies.forEach((e) => {
    ctx.save();
    ctx.translate(e.x + e.width / 2, e.y + e.height / 2);
    ctx.scale(-1, 1);

    let currentImg = assets.enemyImg;
    if (e.type === "KAMIKAZE") currentImg = assets.kamikazeImg;
    if (e.type === "BOSS") currentImg = assets.bossImg;

    if (e.type === "KAMIKAZE") {
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 14;
    }

    if (currentImg.complete && currentImg.naturalWidth !== 0) {
      ctx.drawImage(currentImg, -e.width / 2, -e.height / 2, e.width, e.height);
    } else {
      ctx.fillStyle =
        e.type === "BOSS"
          ? "#9333ea"
          : e.type === "KAMIKAZE"
            ? "#f97316"
            : "#ef4444";
      ctx.fillRect(-e.width / 2, -e.height / 2, e.width, e.height);
    }
    ctx.restore();

    if (e.type === "BOSS") {
      const hpPercent = e.hp / e.maxHp;
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.fillRect(e.x, e.y - 14, e.width, 7);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(e.x, e.y - 14, e.width * hpPercent, 7);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.strokeRect(e.x, e.y - 14, e.width, 7);
    }
  });

  // Player Aircraft
  if (assets.playerImg.complete && assets.playerImg.naturalWidth !== 0) {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(player.rotation || 0);
    ctx.drawImage(
      assets.playerImg,
      -player.width / 2,
      -player.height / 2,
      player.width,
      player.height,
    );
    ctx.restore();
  } else {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(player.rotation || 0);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(
      -player.width / 2,
      -player.height / 2,
      player.width,
      player.height,
    );
    ctx.restore();
  }
}
