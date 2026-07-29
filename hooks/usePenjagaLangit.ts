import { useEffect, useRef, useState } from "react";
import {
  Bullet,
  DropItem,
  Enemy,
  Explosion,
  GameStateUI,
  Player,
} from "@/types/game";
import { ParallaxLayer } from "@/utils/ParallaxLayer";
import { AudioManager } from "@/utils/AudioManager";
import {
  loadGameAssetsWithProgress,
  GameAssets,
} from "@/utils/game/assetLoader";
import { updateGameLogic, updateAutopilotLogic } from "@/utils/game/gameEngine";
import { renderGame } from "@/utils/game/renderEngine";

export function usePenjagaLangit(canvasWidth = 800, canvasHeight = 450) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // LOADING STATES (UNTUK PRELOADER ASSET)
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // GAME STATES
  const [score, setScore] = useState(0);
  const [playerHp, setPlayerHp] = useState(3);
  const [gameMode, setGameMode] = useState<GameStateUI>("MENU");
  const [isMuted, setIsMuted] = useState(false);

  // STAGE STATES
  const [stage, setStage] = useState(1);
  const [stageProgress, setStageProgress] = useState(0);
  const [isBossStage, setIsBossStage] = useState(false);

  // SETTINGS STATES
  const [bgmVolume, setBgmVolumeState] = useState(40);
  const [controlType, setControlType] = useState<"WASD" | "ARROWS">("WASD");
  const [parallaxEnabled, setParallaxEnabled] = useState(true);

  const assetsRef = useRef<GameAssets | null>(null);

  const settingsRef = useRef<{
    controlType: "WASD" | "ARROWS";
    parallaxEnabled: boolean;
  }>({
    controlType: "WASD",
    parallaxEnabled: true,
  });

  const stageRef = useRef({
    currentStage: 1,
    killsInStage: 0,
    requiredKills: 10,
    isBossSpawned: false,
  });

  // AUDIO MANAGER INITIALIZATION
  const audioManagerRef = useRef<AudioManager | null>(null);
  if (!audioManagerRef.current && typeof window !== "undefined") {
    audioManagerRef.current = new AudioManager(
      "/audio/bgm.mp3",
      "/audio/boss_bgm.mp3",
      "/audio/victory_bgm.mp3",
      "/audio/sfx/shoot.mp3",
      "/audio/sfx/explosion.mp3",
      "/audio/sfx/player_hit.mp3",
    );
  }

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
  const explosionsRef = useRef<Explosion[]>([]);
  const dropItemsRef = useRef<DropItem[]>([]);
  const lastShotTimeRef = useRef<number>(0);

  // HANDLER PENGATURAN SUARA & KONTROL
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

  const openSettings = () => {
    gameState.current.mode = "SETTINGS";
    setGameMode("SETTINGS");
  };

  const openHighScore = () => {
    gameState.current.mode = "HIGHSCORE";
    setGameMode("HIGHSCORE");
    audioManagerRef.current?.playVictoryBGM();
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
    explosionsRef.current = [];
    dropItemsRef.current = [];

    setScore(0);
    setPlayerHp(3);
    setStage(1);
    setStageProgress(0);
    setIsBossStage(false);
    setGameMode("PLAYING");

    audioManagerRef.current?.playNormalBGM();
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
    audioManagerRef.current?.playNormalBGM();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // PRELOAD GAMBAR DENGAN PROGRESS BAR
    loadGameAssetsWithProgress((percent) => {
      setLoadProgress(percent);
    }).then((loadedAssets) => {
      assetsRef.current = loadedAssets;
      setIsAssetsLoaded(true);
      audioManagerRef.current?.play();
    });

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

    let menuTime = 0;
    let keys: { [key: string]: boolean } = {};
    const shootCooldown = 150;

    const handleKeyDown = (e: KeyboardEvent) => (keys[e.code] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys[e.code] = false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // PENAMBAHAN MUSUH DENGAN 8 VARIASI PESAWAT
    const spawnEnemyInterval = setInterval(() => {
      if (gameState.current.mode !== "PLAYING") return;

      const currentStage = stageRef.current.currentStage;
      const isBossLevel = currentStage % 10 === 0;

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

          audioManagerRef.current?.playBossBGM();
        }
        return;
      }

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
        width: isKamikaze ? 45 : 55,
        height: isKamikaze ? 30 : 38,
        speed: (isKamikaze ? 4.2 : 2.5) * speedMultiplier,
        hp: isKamikaze ? 1 : 1 + Math.floor(currentStage / 4),
        maxHp: isKamikaze ? 1 : 1 + Math.floor(currentStage / 4),
        variantIndex: Math.floor(Math.random() * 8),
        sineOffset: Math.random() * 100,
        lastShotTime: Date.now(),
      });
    }, 1200);

    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      // Tunggu hingga aset selesai dimuat
      if (!assetsRef.current) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      if (settingsRef.current.parallaxEnabled) {
        layers.forEach((layer) => layer.update(canvas.width));
      }

      const player = playerRef.current;

      if (gameState.current.mode === "HIGHSCORE") {
        updateAutopilotLogic(
          timestamp,
          canvas.width,
          canvas.height,
          playerRef,
          playerBulletsRef,
          enemyBulletsRef,
          enemiesRef,
          explosionsRef,
          lastShotTimeRef,
        );
      } else if (
        gameState.current.mode === "MENU" ||
        gameState.current.mode === "SETTINGS"
      ) {
        menuTime += 0.05;
        player.x = 80;
        player.y = canvas.height / 2 - 20 + Math.sin(menuTime) * 12;
        player.rotation = Math.cos(menuTime) * 0.05;
      } else if (gameState.current.mode === "PLAYING") {
        updateGameLogic(
          timestamp,
          canvas.width,
          canvas.height,
          gameState,
          playerRef,
          playerBulletsRef,
          enemyBulletsRef,
          enemiesRef,
          explosionsRef,
          dropItemsRef,
          keys,
          settingsRef,
          stageRef,
          lastShotTimeRef,
          shootCooldown,
          {
            setScore,
            setPlayerHp,
            setStage,
            setStageProgress,
            setIsBossStage,
            setGameMode,
            playNormalBGM: () => audioManagerRef.current?.playNormalBGM(),
            playShoot: () => audioManagerRef.current?.playShoot(),
            playExplosion: () => audioManagerRef.current?.playExplosion(),
            playPlayerHit: () => audioManagerRef.current?.playPlayerHit(),
          },
        );
      }

      renderGame(
        ctx,
        canvas.width,
        canvas.height,
        assetsRef.current,
        layers,
        gameState.current.mode,
        playerRef.current,
        playerBulletsRef.current,
        enemyBulletsRef.current,
        enemiesRef.current,
        explosionsRef.current,
        dropItemsRef.current,
      );

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
    isAssetsLoaded,
    loadProgress,
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
    openHighScore,
  };
}
