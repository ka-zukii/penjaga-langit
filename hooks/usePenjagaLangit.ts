import { useEffect, useRef, useState } from "react";
import { Bullet, Enemy, GameStateUI, Player } from "@/types/game";
import { ParallaxLayer } from "@/utils/ParallaxLayer";
import { AudioManager } from "@/utils/AudioManager";

export function usePenjagaLangit(canvasWidth = 800, canvasHeight = 450) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [playerHp, setPlayerHp] = useState(3);
  const [gameMode, setGameMode] = useState<GameStateUI>("MENU");
  const [isMuted, setIsMuted] = useState(false);

  // --- STATE STAGE & PROGRESS ---
  const [stage, setStage] = useState(1);
  const [stageProgress, setStageProgress] = useState(0);
  const [isBossStage, setIsBossStage] = useState(false);

  // --- STATE PENGATURAN ---
  const [bgmVolume, setBgmVolumeState] = useState(40);
  const [controlType, setControlType] = useState<"WASD" | "ARROWS">("WASD");
  const [parallaxEnabled, setParallaxEnabled] = useState(true);

  const settingsRef = useRef({
    controlType: "WASD",
    parallaxEnabled: true,
  });

  const stageRef = useRef({
    currentStage: 1,
    killsInStage: 0,
    requiredKills: 10,
    isBossSpawned: false,
  });

  const audioManagerRef = useRef<AudioManager | null>(null);

  if (!audioManagerRef.current && typeof window !== "undefined") {
    audioManagerRef.current = new AudioManager("/audio/bgm.mp3");
  }

  const setBgmVolume = (val: number) => {
    setBgmVolumeState(val);
    audioManagerRef.current?.setVolume(val / 100);
  };

  const updateControlType = (type: "WASD" | "ARROWS") => {
    setControlType(type);
    settingsRef.current.controlType = type;
  };

  const updateParallaxEnabled = (enabled: boolean) => {
    setParallaxEnabled(enabled);
    settingsRef.current.parallaxEnabled = enabled;
  };

  const gameState = useRef<{ score: number; mode: GameStateUI }>({
    score: 0,
    mode: "MENU",
  });

  const playerRef = useRef<Player>({
    x: 50,
    y: canvasHeight / 2 - 25,
    width: 60,
    height: 40,
    speed: 5,
    hp: 3,
    maxHp: 3,
    rotation: 0,
  });

  const playerBulletsRef = useRef<Bullet[]>([]);
  const enemyBulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);

  const openSettings = () => {
    gameState.current.mode = "SETTINGS";
    setGameMode("SETTINGS");
  };

  const startGame = () => {
    gameState.current.score = 0;
    gameState.current.mode = "PLAYING";

    playerRef.current.x = 50;
    playerRef.current.y = canvasHeight / 2 - 25;
    playerRef.current.hp = 3;
    playerRef.current.rotation = 0;

    stageRef.current.currentStage = 1;
    stageRef.current.killsInStage = 0;
    stageRef.current.requiredKills = 10;
    stageRef.current.isBossSpawned = false;

    playerBulletsRef.current = [];
    enemyBulletsRef.current = [];
    enemiesRef.current = [];

    setScore(0);
    setPlayerHp(3);
    setStage(1);
    setStageProgress(0);
    setIsBossStage(false);
    setGameMode("PLAYING");

    audioManagerRef.current?.play();
  };

  const togglePause = () => {
    if (gameState.current.mode === "PLAYING") {
      gameState.current.mode = "PAUSED";
      setGameMode("PAUSED");
      audioManagerRef.current?.pause();
    } else if (gameState.current.mode === "PAUSED") {
      gameState.current.mode = "PLAYING";
      setGameMode("PLAYING");
      audioManagerRef.current?.play();
    }
  };

  const toggleAudioMute = () => {
    if (audioManagerRef.current) {
      const muted = audioManagerRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  const backToMenu = () => {
    gameState.current.mode = "MENU";
    setGameMode("MENU");
    audioManagerRef.current?.play();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    audioManagerRef.current?.play();

    // --- LOAD ASSETS BACKGROUND ---
    const skyTopImg = new Image();
    skyTopImg.src = "/images/bg/sky_top.png";

    const sunImg = new Image();
    sunImg.src = "/images/bg/sun.png";

    const layers = [
      new ParallaxLayer(
        "/images/bg/farground_mountains.png",
        0.3,
        canvas.height - 220,
        220,
      ),
      new ParallaxLayer("/images/bg/cloud_far.png", 0.5, 50, 100),
      new ParallaxLayer(
        "/images/bg/midground_mountains.png",
        0.8,
        canvas.height - 180,
        180,
      ),
      new ParallaxLayer(
        "/images/bg/cloud_mid.png",
        1.2,
        canvas.height - 160,
        160,
      ),
      new ParallaxLayer(
        "/images/bg/foreground_mountains.png",
        2.0,
        canvas.height - 120,
        120,
      ),
    ];

    // --- LOAD SPRITE PLAYER & BULLET ---
    const playerImg = new Image();
    playerImg.src = "/images/player.png";

    const bulletImg = new Image();
    bulletImg.src = "/images/bullet.png";

    // --- LOAD SPRITE SETIAP JENIS MUSUH ---
    const enemyImg = new Image();
    enemyImg.src = "/images/enemy.png";

    const kamikazeImg = new Image();
    kamikazeImg.src = "/images/kamikaze.png";

    const bossImg = new Image();
    bossImg.src = "/images/boss.png";

    let menuTime = 0;
    let keys: { [key: string]: boolean } = {};
    let lastShotTime = 0;
    const shootCooldown = 150;

    const handleKeyDown = (e: KeyboardEvent) => (keys[e.code] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys[e.code] = false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // --- SPAWN LOGIC MUSUH BERDASARKAN STAGE & PROBABILITAS KAMIKAZE ---
    const spawnEnemyInterval = setInterval(() => {
      if (gameState.current.mode !== "PLAYING") return;

      const currentStage = stageRef.current.currentStage;
      const isBossLevel = currentStage % 10 === 0;

      // Stage Boss
      if (isBossLevel) {
        if (!stageRef.current.isBossSpawned) {
          enemiesRef.current.push({
            type: "BOSS",
            x: canvas.width,
            y: canvas.height / 2 - 55,
            width: 130,
            height: 110,
            speed: 1.5,
            hp: 50 + currentStage * 15,
            maxHp: 50 + currentStage * 15,
            lastShotTime: Date.now(),
            targetY: canvas.height / 2 - 55,
          });
          stageRef.current.isBossSpawned = true;
          setIsBossStage(true);
        }
        return;
      }

      // RUMUS PELUANG KAMIKAZE BERDASARKAN STAGE:
      // Stage 1 & 2: 0% Kamikaze (tidak muncul)
      // Stage 3: 10%, Stage 4: 15%, dst. (Maksimal 40%)
      let kamikazeChance = 0;
      if (currentStage >= 3) {
        kamikazeChance = Math.min(0.4, 0.1 + (currentStage - 3) * 0.05);
      }

      const isKamikaze = Math.random() < kamikazeChance;
      const speedMultiplier = 1 + currentStage * 0.04;

      enemiesRef.current.push({
        type: isKamikaze ? "KAMIKAZE" : "NORMAL",
        x: canvas.width,
        y: Math.random() * (canvas.height - 80),
        width: isKamikaze ? 40 : 50,
        height: isKamikaze ? 28 : 35,
        speed: (isKamikaze ? 4.2 : 2.5) * speedMultiplier,
        hp: isKamikaze ? 1 : 1 + Math.floor(currentStage / 4),
        maxHp: isKamikaze ? 1 : 1 + Math.floor(currentStage / 4),
        lastShotTime: Date.now(),
      });
    }, 1200);

    let animationFrameId: number;

    const update = (timestamp: number) => {
      if (settingsRef.current.parallaxEnabled) {
        layers.forEach((layer) => layer.update(canvas.width));
      }

      const player = playerRef.current;

      if (
        gameState.current.mode === "MENU" ||
        gameState.current.mode === "SETTINGS"
      ) {
        menuTime += 0.05;
        player.x = 80;
        player.y = canvas.height / 2 - 20 + Math.sin(menuTime) * 12;
        player.rotation = Math.cos(menuTime) * 0.05;
        return;
      }

      if (gameState.current.mode !== "PLAYING") return;

      let targetRotation = 0;

      const isUp =
        settingsRef.current.controlType === "WASD"
          ? keys["KeyW"]
          : keys["ArrowUp"];
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
      if (isDown && player.y < canvas.height - player.height) {
        player.y += player.speed;
        targetRotation = 18 * (Math.PI / 180);
      }
      if (isLeft && player.x > 0) {
        player.x -= player.speed;
      }
      if (isRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
      }

      player.rotation = player.rotation || 0;
      player.rotation += (targetRotation - player.rotation) * 0.25;

      if (keys["Space"] && timestamp - lastShotTime > shootCooldown) {
        playerBulletsRef.current.push({
          x: player.x + player.width - 10,
          y: player.y + player.height / 2 - 4,
          width: 16,
          height: 8,
          speed: 10,
        });
        lastShotTime = timestamp;
      }

      playerBulletsRef.current.forEach((b) => (b.x += b.speed));
      playerBulletsRef.current = playerBulletsRef.current.filter(
        (b) => b.x < canvas.width,
      );

      enemyBulletsRef.current.forEach((eb) => (eb.x -= eb.speed));
      enemyBulletsRef.current = enemyBulletsRef.current.filter(
        (eb) => eb.x > -20,
      );

      const now = Date.now();

      enemiesRef.current.forEach((e) => {
        if (e.type === "KAMIKAZE") {
          e.x -= e.speed;
          if (e.y < player.y) e.y += 1.2;
          if (e.y > player.y) e.y -= 1.2;
        } else if (e.type === "BOSS") {
          if (e.x > canvas.width - 160) {
            e.x -= e.speed;
          }
          if (Math.abs(e.y - (e.targetY || 0)) < 10) {
            e.targetY = Math.random() * (canvas.height - e.height);
          }
          e.y += (e.y < (e.targetY || 0) ? 1 : -1) * 1.5;

          if (!e.lastShotTime || now - e.lastShotTime > 1000) {
            enemyBulletsRef.current.push(
              { x: e.x, y: e.y + 20, width: 14, height: 7, speed: 6 },
              { x: e.x, y: e.y + e.height / 2, width: 14, height: 7, speed: 7 },
              {
                x: e.x,
                y: e.y + e.height - 20,
                width: 14,
                height: 7,
                speed: 6,
              },
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

      // COLLISION: PELURU PLAYER VS MUSUH
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
              enemiesRef.current.splice(eIdx, 1);
              gameState.current.score +=
                e.type === "BOSS" ? 200 : e.type === "KAMIKAZE" ? 25 : 10;
              setScore(gameState.current.score);

              if (e.type === "BOSS") {
                stageRef.current.currentStage += 1;
                stageRef.current.killsInStage = 0;
                stageRef.current.isBossSpawned = false;
                setStage(stageRef.current.currentStage);
                setStageProgress(0);
                setIsBossStage(false);
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
                setStageProgress(progress);

                if (
                  stageRef.current.killsInStage >=
                  stageRef.current.requiredKills
                ) {
                  stageRef.current.currentStage += 1;
                  stageRef.current.killsInStage = 0;
                  setStage(stageRef.current.currentStage);
                  setStageProgress(0);
                }
              }
            }
          }
        });
      });

      // COLLISION: MUSUH VS PLAYER
      enemiesRef.current.forEach((e, eIdx) => {
        const hitPlayer =
          player.x < e.x + e.width &&
          player.x + player.width > e.x &&
          player.y < e.y + e.height &&
          player.y + player.height > e.y;

        if (hitPlayer) {
          if (e.type !== "BOSS") enemiesRef.current.splice(eIdx, 1);
          player.hp -= e.type === "KAMIKAZE" ? 2 : 1;
          setPlayerHp(player.hp);
        }
      });

      // COLLISION: PELURU MUSUH VS PLAYER
      enemyBulletsRef.current.forEach((eb, ebIdx) => {
        const hitPlayer =
          player.x < eb.x + eb.width &&
          player.x + player.width > eb.x &&
          player.y < eb.y + eb.height &&
          player.y + player.height > eb.y;

        if (hitPlayer) {
          enemyBulletsRef.current.splice(ebIdx, 1);
          player.hp -= 1;
          setPlayerHp(player.hp);
        }
      });

      if (player.hp <= 0) {
        gameState.current.mode = "GAMEOVER";
        setGameMode("GAMEOVER");
        audioManagerRef.current?.stop();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (skyTopImg.complete && skyTopImg.naturalWidth !== 0) {
        ctx.drawImage(skyTopImg, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (sunImg.complete && sunImg.naturalWidth !== 0) {
        ctx.drawImage(sunImg, canvas.width - 200, 20, 140, 140);
      }

      layers.forEach((layer) => layer.draw(ctx, canvas.width));

      const player = playerRef.current;

      if (
        gameState.current.mode === "MENU" ||
        gameState.current.mode === "SETTINGS"
      ) {
        if (playerImg.complete && playerImg.naturalWidth !== 0) {
          ctx.save();
          ctx.translate(
            player.x + player.width / 2,
            player.y + player.height / 2,
          );
          ctx.rotate(player.rotation || 0);
          ctx.drawImage(
            playerImg,
            (-player.width * 1.3) / 2,
            (-player.height * 1.3) / 2,
            player.width * 1.3,
            player.height * 1.3,
          );
          ctx.restore();
        }
        return;
      }

      playerBulletsRef.current.forEach((b) => {
        if (bulletImg.complete && bulletImg.naturalWidth !== 0) {
          ctx.drawImage(bulletImg, b.x, b.y, b.width, b.height);
        } else {
          ctx.fillStyle = "#facc15";
          ctx.fillRect(b.x, b.y, b.width, b.height);
        }
      });

      ctx.fillStyle = "#ef4444";
      enemyBulletsRef.current.forEach((eb) => {
        ctx.fillRect(eb.x, eb.y, eb.width, eb.height);
      });

      // RENDER ENEMIES
      enemiesRef.current.forEach((e) => {
        ctx.save();
        ctx.translate(e.x + e.width / 2, e.y + e.height / 2);
        ctx.scale(-1, 1);

        let currentImg = enemyImg;
        if (e.type === "KAMIKAZE") currentImg = kamikazeImg;
        if (e.type === "BOSS") currentImg = bossImg;

        if (e.type === "KAMIKAZE") {
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 14;
        }

        if (currentImg.complete && currentImg.naturalWidth !== 0) {
          ctx.drawImage(
            currentImg,
            -e.width / 2,
            -e.height / 2,
            e.width,
            e.height,
          );
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

      // RENDER PLAYER
      if (playerImg.complete && playerImg.naturalWidth !== 0) {
        ctx.save();
        ctx.translate(
          player.x + player.width / 2,
          player.y + player.height / 2,
        );
        ctx.rotate(player.rotation || 0);
        ctx.drawImage(
          playerImg,
          -player.width / 2,
          -player.height / 2,
          player.width,
          player.height,
        );
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(
          player.x + player.width / 2,
          player.y + player.height / 2,
        );
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
    };

    const gameLoop = (timestamp: number) => {
      update(timestamp);
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(spawnEnemyInterval);
      cancelAnimationFrame(animationFrameId);
      audioManagerRef.current?.stop();
    };
  }, []);

  return {
    canvasRef,
    score,
    playerHp,
    gameMode,
    stage,
    stageProgress,
    isBossStage,
    isMuted,
    bgmVolume,
    controlType,
    parallaxEnabled,
    setBgmVolume,
    updateControlType,
    updateParallaxEnabled,
    startGame,
    togglePause,
    toggleAudioMute,
    backToMenu,
    openSettings,
  };
}
