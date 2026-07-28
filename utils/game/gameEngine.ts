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

  // 1. MOVEMENT PLAYER
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

  if (isUp && player.y > 0) {
    player.y -= player.speed;
    targetRotation = -18 * (Math.PI / 180);
  }
  if (isDown && player.y < canvasHeight - player.height) {
    player.y += player.speed;
    targetRotation = 18 * (Math.PI / 180);
  }
  if (isLeft && player.x > 0) {
    player.x -= player.speed;
  }
  if (isRight && player.x < canvasWidth - player.width) {
    player.x += player.speed;
  }

  player.rotation = player.rotation || 0;
  player.rotation += (targetRotation - player.rotation) * 0.25;

  // 2. SHOOTING PLAYER
  if (keys["Space"] && timestamp - lastShotTimeRef.current > shootCooldown) {
    playerBulletsRef.current.push({
      x: player.x + player.width - 10,
      y: player.y + player.height / 2 - 4,
      width: 16,
      height: 8,
      speed: 10,
    });
    lastShotTimeRef.current = timestamp;

    // PLAY SFX SHOOT
    callbacks.playShoot();
  }

  // 3. UPDATE POSITION BULLETS & ENEMIES
  playerBulletsRef.current.forEach((b) => (b.x += b.speed));
  playerBulletsRef.current = playerBulletsRef.current.filter(
    (b) => b.x < canvasWidth,
  );

  enemyBulletsRef.current.forEach((eb) => (eb.x -= eb.speed));
  enemyBulletsRef.current = enemyBulletsRef.current.filter((eb) => eb.x > -20);

  const now = Date.now();

  enemiesRef.current.forEach((e) => {
    if (e.type === "KAMIKAZE") {
      e.x -= e.speed;
      if (e.y < player.y) e.y += 1.2;
      if (e.y > player.y) e.y -= 1.2;
    } else if (e.type === "BOSS") {
      if (e.x > canvasWidth - 160) {
        e.x -= e.speed;
      }
      if (Math.abs(e.y - (e.targetY || 0)) < 10) {
        e.targetY = Math.random() * (canvasHeight - e.height);
      }
      e.y += (e.y < (e.targetY || 0) ? 1 : -1) * 1.5;

      if (!e.lastShotTime || now - e.lastShotTime > 1000) {
        enemyBulletsRef.current.push(
          { x: e.x, y: e.y + 20, width: 14, height: 7, speed: 6 },
          { x: e.x, y: e.y + e.height / 2, width: 14, height: 7, speed: 7 },
          { x: e.x, y: e.y + e.height - 20, width: 14, height: 7, speed: 6 },
        );
        e.lastShotTime = now;
      }
    } else {
      e.x -= e.speed;
      if (!e.lastShotTime || now - e.lastShotTime > 2000) {
        enemyBulletsRef.current.push({
          x: e.x,
          y: e.y + e.height / 2 - 3,
          width: 12,
          height: 6,
          speed: 5,
        });
        e.lastShotTime = now;
      }
    }
  });

  enemiesRef.current = enemiesRef.current.filter((e) => e.x + e.width > 0);

  // 4. COLLISIONS (PELURU VS MUSUH)
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
          // SPAWN LEDAKAN & PLAY SFX EXPLOSION
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

  // COLLISIONS (MUSUH / PELURU VS PLAYER)
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

      // PLAY SFX PLAYER HIT
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

      // PLAY SFX PLAYER HIT
      callbacks.playPlayerHit();
    }
  });

  // UPDATE FRAME LEDAKAN
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

// AUTOPILOT CINEMATIC BACKGROUND
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

  if (enemiesRef.current.length < 2 && Math.random() < 0.03) {
    enemiesRef.current.push({
      type: "NORMAL",
      x: canvasWidth,
      y: Math.random() * (canvasHeight - 80),
      width: 50,
      height: 35,
      speed: 3,
      hp: 1,
      maxHp: 1,
    });
  }

  playerBulletsRef.current.forEach((b) => (b.x += b.speed));
  playerBulletsRef.current = playerBulletsRef.current.filter(
    (b) => b.x < canvasWidth,
  );

  enemiesRef.current.forEach((e) => (e.x -= e.speed));

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
