import {
  Bullet,
  DropItem,
  Enemy,
  Explosion,
  GameStateUI,
  Player,
} from "@/types/game";
import { ParallaxLayer } from "@/utils/ParallaxLayer";
import { GameAssets } from "./assetLoader";

// FUNGSI KHUSUS MENGGAMBAR PARASUT & ITEM NYAWA (CANVAS VECTOR 2D)
export function renderDropItems(
  ctx: CanvasRenderingContext2D,
  dropItems: DropItem[],
) {
  if (!dropItems || dropItems.length === 0) return;

  dropItems.forEach((item) => {
    ctx.save();

    const time = Date.now() * 0.003 + item.swingOffset;
    const tiltAngle = Math.cos(time) * 0.15; // Efek parasut miring saat bergoyang

    ctx.translate(item.x + item.width / 2, item.y);
    ctx.rotate(tiltAngle);

    // 1. KUBAH PARASUT
    ctx.beginPath();
    ctx.arc(0, -16, 18, Math.PI, 0, false);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#38bdf8";
    ctx.stroke();

    // Lipatan Parasut
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(0, -16);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
    ctx.stroke();

    // 2. TALI PARASUT
    ctx.beginPath();
    ctx.moveTo(-16, -16);
    ctx.lineTo(-4, 0);

    ctx.moveTo(16, -16);
    ctx.lineTo(4, 0);

    ctx.moveTo(0, -16);
    ctx.lineTo(0, 0);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3. KOTAK ITEM NYAWA BERSINAR (HEAL)
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 10;

    // Kotak Kontainer
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-10, 0, 20, 20, 5);
    ctx.fill();
    ctx.stroke();

    // Simbol Hati Merah
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(-3, 7, 3, Math.PI, 0, false);
    ctx.arc(3, 7, 3, Math.PI, 0, false);
    ctx.lineTo(0, 14);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  });
}

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
  explosions: Explosion[],
  dropItems: DropItem[] = [],
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

  // Mode Menu / Settings Animation
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

    if (e.type === "BOSS") {
      currentImg = assets.bossImg;
    } else if (
      e.variantIndex !== undefined &&
      assets.enemyVariants[e.variantIndex] &&
      assets.enemyVariants[e.variantIndex].complete &&
      assets.enemyVariants[e.variantIndex].naturalWidth !== 0
    ) {
      currentImg = assets.enemyVariants[e.variantIndex];
    } else if (e.type === "KAMIKAZE") {
      currentImg = assets.kamikazeImg;
    }

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

  // 4. Render Drop Items Parasut
  renderDropItems(ctx, dropItems);

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

  // RENDER ANIMASI LEDAKAN
  explosions.forEach((exp) => {
    const frameImg = assets.explosionFrames[exp.currentFrame];
    if (frameImg && frameImg.complete && frameImg.naturalWidth !== 0) {
      ctx.drawImage(
        frameImg,
        exp.x - exp.width / 2,
        exp.y - exp.height / 2,
        exp.width,
        exp.height,
      );
    }
  });
}
