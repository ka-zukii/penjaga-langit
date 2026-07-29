import { Bullet, Enemy, Explosion, GameStateUI, Player } from "@/types/game";

type StageState = {
  currentStage: number;
  killsInStage: number;
  requiredKills: number;
  isBossSpawned: boolean;
};

type GameSettings = {
  controlType: "WASD" | "ARROWS";
  parallaxEnabled: boolean;
};

export function updateGameLogic(
  timestamp: number,
  canvasWidth: number,
  canvasHeight: number,
  gameState: { current: { score: number; mode: GameStateUI } },
  playerRef: { current: Player },
  playerBulletsRef: { current: Bullet[] },
  enemyBulletsRef: { current: Bullet[] },
  enemiesRef: { current: Enemy[] },
  explosionsRef: { current: Explosion[] },
  keys: { [key: string]: boolean },
  settingsRef: { current: GameSettings },
  stageRef: { current: StageState },
  lastShotTimeRef: { current: number },
  shootCooldown: number,
  callbacks: {
    setScore: (score: number) => void;
    setPlayerHp: (hp: number) => void;
    setStage: (stage: number) => void;
    setStageProgress: (progress: number) => void;
    setIsBossStage: (isBoss: boolean) => void;
    setGameMode: (mode: GameStateUI) => void;
    playNormalBGM: () => void;
    playShoot: () => void;
    playExplosion: () => void;
    playPlayerHit: () => void;
  },
) {
  const player = playerRef.current;
  const currentStage = stageRef.current.currentStage;

  // 1. KONTROL & BATASAN GERAKAN PLAYER (BOUNDING BOX LOCK)
  let targetRotation = 0;
  const isUp =
    settingsRef.current.controlType === "WASD" ? keys["KeyW"] : keys["ArrowUp"];
  const isDown =
    settingsRef.current.controlType === "WASD"
      ? keys["KeyS"]
      : keys["ArrowDown"];
  const isLeft =
    settingsRef.current.controlType === "WASD"
      ? keys["KeyA"]
      : keys["ArrowLeft"];
  const isRight =
    settingsRef.current.controlType === "WASD"
      ? keys["KeyD"]
      : keys["ArrowRight"];

  if (isUp) {
    player.y -= player.speed;
    targetRotation = -18 * (Math.PI / 180);
  }
  if (isDown) {
    player.y += player.speed;
    targetRotation = 18 * (Math.PI / 180);
  }
  if (isLeft) {
    player.x -= player.speed;
  }
  if (isRight) {
    player.x += player.speed;
  }

  // 🛑 CLAMP PLAYER AGAR 100% TIDAK BISA KELUAR LAYAR (TETAP TERLIHAT PENUH)
  const padding = 5; // Margin tipis dari pinggir canvas
  player.x = Math.max(
    padding,
    Math.min(canvasWidth - player.width - padding, player.x),
  );
  player.y = Math.max(
    padding,
    Math.min(canvasHeight - player.height - padding, player.y),
  );

  player.rotation = player.rotation || 0;
  player.rotation += (targetRotation - player.rotation) * 0.25;

  // 2. TEMBAKAN PLAYER
  if (keys["Space"] && timestamp - lastShotTimeRef.current > shootCooldown) {
    playerBulletsRef.current.push({
      x: player.x + player.width - 10,
      y: player.y + player.height / 2 - 4,
      width: 16,
      height: 8,
      speed: 10,
    });
    lastShotTimeRef.current = timestamp;
    callbacks.playShoot();
  }

  // 3. UPDATE POSISI PELURU PLAYER & PELURU MUSUH
  playerBulletsRef.current.forEach((b) => (b.x += b.speed));
  playerBulletsRef.current = playerBulletsRef.current.filter(
    (b) => b.x < canvasWidth,
  );

  enemyBulletsRef.current.forEach((eb) => {
    eb.x -= eb.speed;
    if (eb.vy) eb.y += eb.vy;
  });
  enemyBulletsRef.current = enemyBulletsRef.current.filter(
    (eb) => eb.x > -20 && eb.y > -20 && eb.y < canvasHeight + 20,
  );

  const now = Date.now();

  // 4. PERGERAKAN & BATASAN MUSUH
  enemiesRef.current.forEach((e) => {
    if (e.sineOffset === undefined) e.sineOffset = Math.random() * 100;

    if (e.type === "KAMIKAZE") {
      e.x -= e.speed;
      if (e.y < player.y) e.y += 1.5;
      if (e.y > player.y) e.y -= 1.5;

      // Batasi Kamikaze agar tetap di dalam layar saat mengejar Y
      e.y = Math.max(10, Math.min(canvasHeight - e.height - 10, e.y));
    } else if (e.type === "BOSS") {
      // Pergerakan Boss di sisi kanan (tidak melewati tengah ke kiri)
      if (e.x > canvasWidth - 160) {
        e.x -= e.speed;
      }

      if (Math.abs(e.y - (e.targetY || 0)) < 10) {
        e.targetY = Math.random() * (canvasHeight - e.height - 20) + 10;
      }
      e.y += (e.y < (e.targetY || 0) ? 1 : -1) * 1.5;

      // Clamp Boss di dalam batas vertikal
      e.y = Math.max(10, Math.min(canvasHeight - e.height - 10, e.y));

      // POLA TEMBAKAN BOSS
      const bossShootInterval = Math.max(800, 1500 - currentStage * 20);
      if (!e.lastShotTime || now - e.lastShotTime > bossShootInterval) {
        enemyBulletsRef.current.push(
          { x: e.x, y: e.y + 20, width: 14, height: 7, speed: 6, vy: -1 },
          {
            x: e.x,
            y: e.y + e.height / 2,
            width: 14,
            height: 7,
            speed: 7,
            vy: 0,
          },
          {
            x: e.x,
            y: e.y + e.height - 20,
            width: 14,
            height: 7,
            speed: 6,
            vy: 1,
          },
        );
        e.lastShotTime = now;
      }
    } else {
      // MUSUH BIASA (NORMAL)
      e.x -= e.speed;
      e.y += Math.sin(now * 0.003 + e.sineOffset) * 0.8;

      // 🛑 CLAMP MUSUH BIASA AGAR TIDAK LEWAT ATAS/BAWAH LAYAR
      e.y = Math.max(10, Math.min(canvasHeight - e.height - 10, e.y));

      // POLA TEMBAKAN MUSUH BIASA
      const enemyShootInterval = Math.max(1600, 2800 - currentStage * 50);
      if (!e.lastShotTime || now - e.lastShotTime > enemyShootInterval) {
        if (e.variantIndex && e.variantIndex >= 4 && currentStage >= 3) {
          enemyBulletsRef.current.push(
            { x: e.x, y: e.y + 8, width: 12, height: 6, speed: 5.5, vy: -0.6 },
            {
              x: e.x,
              y: e.y + e.height - 8,
              width: 12,
              height: 6,
              speed: 5.5,
              vy: 0.6,
            },
          );
        } else {
          enemyBulletsRef.current.push({
            x: e.x,
            y: e.y + e.height / 2 - 3,
            width: 12,
            height: 6,
            speed: 5,
            vy: 0,
          });
        }
        e.lastShotTime = now;
      }
    }
  });

  // Hapus musuh yang sudah lewat jauh ke kiri
  enemiesRef.current = enemiesRef.current.filter((e) => e.x + e.width > 0);

  // 5. TABRAKAN: PELURU PLAYER VS MUSUH
  playerBulletsRef.current.forEach((b, bIdx) => {
    enemiesRef.current.forEach((e, eIdx) => {
      if (
        b.x < e.x + e.width &&
        b.x + b.width > e.x &&
        b.y < e.y + e.height &&
        b.y + b.height > e.y
      ) {
        playerBulletsRef.current.splice(bIdx, 1);
        e.hp -= 1;

        if (e.hp <= 0) {
          explosionsRef.current.push({
            x: e.x + e.width / 2,
            y: e.y + e.height / 2,
            width: e.type === "BOSS" ? 140 : 65,
            height: e.type === "BOSS" ? 140 : 65,
            currentFrame: 0,
            lastFrameTime: now,
            frameDuration: 40,
          });
          callbacks.playExplosion();

          if (e.type === "KAMIKAZE") {
            enemyBulletsRef.current.push(
              {
                x: e.x,
                y: e.y + e.height / 2,
                width: 8,
                height: 8,
                speed: 4,
                vy: -1.5,
              },
              {
                x: e.x,
                y: e.y + e.height / 2,
                width: 8,
                height: 8,
                speed: 4,
                vy: 0,
              },
              {
                x: e.x,
                y: e.y + e.height / 2,
                width: 8,
                height: 8,
                speed: 4,
                vy: 1.5,
              },
            );
          }

          enemiesRef.current.splice(eIdx, 1);
          gameState.current.score +=
            e.type === "BOSS" ? 200 : e.type === "KAMIKAZE" ? 25 : 10;
          callbacks.setScore(gameState.current.score);

          if (e.type === "BOSS") {
            stageRef.current.currentStage += 1;
            stageRef.current.killsInStage = 0;
            stageRef.current.isBossSpawned = false;
            callbacks.setStage(stageRef.current.currentStage);
            callbacks.setStageProgress(0);
            callbacks.setIsBossStage(false);
            callbacks.playNormalBGM();
          } else {
            stageRef.current.killsInStage += 1;
            const progress = Math.min(
              100,
              Math.floor(
                (stageRef.current.killsInStage /
                  stageRef.current.requiredKills) *
                  100,
              ),
            );
            callbacks.setStageProgress(progress);

            if (
              stageRef.current.killsInStage >= stageRef.current.requiredKills
            ) {
              stageRef.current.currentStage += 1;
              stageRef.current.killsInStage = 0;
              callbacks.setStage(stageRef.current.currentStage);
              callbacks.setStageProgress(0);
            }
          }
        }
      }
    });
  });

  // 6. TABRAKAN: MUSUH / PELURU MUSUH VS PLAYER
  enemiesRef.current.forEach((e, eIdx) => {
    const hitPlayer =
      player.x < e.x + e.width &&
      player.x + player.width > e.x &&
      player.y < e.y + e.height &&
      player.y + player.height > e.y;

    if (hitPlayer) {
      explosionsRef.current.push({
        x: e.x + e.width / 2,
        y: e.y + e.height / 2,
        width: 65,
        height: 65,
        currentFrame: 0,
        lastFrameTime: now,
        frameDuration: 40,
      });

      if (e.type !== "BOSS") enemiesRef.current.splice(eIdx, 1);
      player.hp -= e.type === "KAMIKAZE" ? 2 : 1;
      callbacks.setPlayerHp(player.hp);
      callbacks.playPlayerHit();
    }
  });

  enemyBulletsRef.current.forEach((eb, ebIdx) => {
    const hitPlayer =
      player.x < eb.x + eb.width &&
      player.x + player.width > eb.x &&
      player.y < eb.y + eb.height &&
      player.y + player.height > eb.y;

    if (hitPlayer) {
      enemyBulletsRef.current.splice(ebIdx, 1);
      player.hp -= 1;
      callbacks.setPlayerHp(player.hp);
      callbacks.playPlayerHit();
    }
  });

  // 7. LEDAKAN FRAME UPDATE
  explosionsRef.current.forEach((exp) => {
    if (now - exp.lastFrameTime > exp.frameDuration) {
      exp.currentFrame += 1;
      exp.lastFrameTime = now;
    }
  });
  explosionsRef.current = explosionsRef.current.filter(
    (exp) => exp.currentFrame < 9,
  );

  if (player.hp <= 0) {
    gameState.current.mode = "GAMEOVER";
    callbacks.setGameMode("GAMEOVER");
  }
}

// 8. AUTOPILOT CINEMATIC LOGIC
export function updateAutopilotLogic(
  timestamp: number,
  canvasWidth: number,
  canvasHeight: number,
  playerRef: { current: Player },
  playerBulletsRef: { current: Bullet[] },
  enemyBulletsRef: { current: Bullet[] },
  enemiesRef: { current: Enemy[] },
  explosionsRef: { current: Explosion[] },
  lastShotTimeRef: { current: number },
) {
  const player = playerRef.current;
  const now = Date.now();

  const time = timestamp * 0.002;
  player.x = 80 + Math.sin(time * 0.5) * 15;
  player.y = canvasHeight / 2 - player.height / 2 + Math.sin(time) * 60;
  player.rotation = Math.cos(time) * 0.08;

  if (timestamp - lastShotTimeRef.current > 200) {
    playerBulletsRef.current.push({
      x: player.x + player.width - 10,
      y: player.y + player.height / 2 - 4,
      width: 16,
      height: 8,
      speed: 12,
    });
    lastShotTimeRef.current = timestamp;
  }

  if (enemiesRef.current.length < 3 && Math.random() < 0.04) {
    enemiesRef.current.push({
      type: "NORMAL",
      x: canvasWidth,
      y: Math.random() * (canvasHeight - 80),
      width: 55,
      height: 38,
      speed: 3,
      hp: 1,
      maxHp: 1,
      variantIndex: Math.floor(Math.random() * 8),
      sineOffset: Math.random() * 100,
    });
  }

  playerBulletsRef.current.forEach((b) => (b.x += b.speed));
  playerBulletsRef.current = playerBulletsRef.current.filter(
    (b) => b.x < canvasWidth,
  );

  enemiesRef.current.forEach((e) => {
    e.x -= e.speed;
    e.y += Math.sin(now * 0.003 + (e.sineOffset || 0)) * 0.8;
    e.y = Math.max(10, Math.min(canvasHeight - e.height - 10, e.y));
  });

  playerBulletsRef.current.forEach((b, bIdx) => {
    enemiesRef.current.forEach((e, eIdx) => {
      if (
        b.x < e.x + e.width &&
        b.x + b.width > e.x &&
        b.y < e.y + e.height &&
        b.y + b.height > e.y
      ) {
        explosionsRef.current.push({
          x: e.x + e.width / 2,
          y: e.y + e.height / 2,
          width: 65,
          height: 65,
          currentFrame: 0,
          lastFrameTime: now,
          frameDuration: 40,
        });

        playerBulletsRef.current.splice(bIdx, 1);
        enemiesRef.current.splice(eIdx, 1);
      }
    });
  });

  explosionsRef.current.forEach((exp) => {
    if (now - exp.lastFrameTime > exp.frameDuration) {
      exp.currentFrame += 1;
      exp.lastFrameTime = now;
    }
  });
  explosionsRef.current = explosionsRef.current.filter(
    (exp) => exp.currentFrame < 9,
  );

  enemiesRef.current = enemiesRef.current.filter((e) => e.x + e.width > 0);
  enemyBulletsRef.current = [];
}
