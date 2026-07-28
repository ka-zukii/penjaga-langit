export class AudioManager {
  private bgm: HTMLAudioElement | null = null;
  private bossBgm: HTMLAudioElement | null = null;
  private victoryBgm: HTMLAudioElement | null = null;
  private currentAudio: HTMLAudioElement | null = null;

  // SFX AUDIO ELEMENTS
  private shootSfx: HTMLAudioElement | null = null;
  private explosionSfx: HTMLAudioElement | null = null;
  private playerHitSfx: HTMLAudioElement | null = null;

  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private targetVolume: number = 0.4;
  private sfxVolume: number = 0.5;

  constructor(
    bgmSrc: string,
    bossBgmSrc: string,
    victorySrc: string,
    shootSfxSrc?: string,
    explosionSfxSrc?: string,
    playerHitSfxSrc?: string,
  ) {
    if (typeof window !== "undefined") {
      this.bgm = this.createAudio(bgmSrc);
      this.bossBgm = this.createAudio(bossBgmSrc);
      this.victoryBgm = this.createAudio(victorySrc);

      if (shootSfxSrc) this.shootSfx = new Audio(shootSfxSrc);
      if (explosionSfxSrc) this.explosionSfx = new Audio(explosionSfxSrc);
      if (playerHitSfxSrc) this.playerHitSfx = new Audio(playerHitSfxSrc);

      this.currentAudio = this.bgm;
      this.setVolume(0.4);
    }
  }

  private createAudio(src: string): HTMLAudioElement {
    const audio = new Audio(src);
    audio.preload = "auto";

    audio.addEventListener("timeupdate", () => {
      const buffer = 0.15;
      if (audio.duration && audio.currentTime >= audio.duration - buffer) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    });

    return audio;
  }

  // HELPER MEMAINKAN SFX TANPA DELAY
  private playSfx(sfx: HTMLAudioElement | null, volumeMultiplier = 1) {
    if (!sfx || this.isMuted) return;
    try {
      // Clone node agar suara yang sama bisa overlapping (misal tembakan beruntun)
      const soundClone = sfx.cloneNode() as HTMLAudioElement;
      soundClone.volume = Math.min(1, this.sfxVolume * volumeMultiplier);
      soundClone.play().catch(() => {});
    } catch (e) {
      // Ignore audio play errors
    }
  }

  // METHOD PEMANGGILAN EFEK SUARA (SFX)
  playShoot() {
    this.playSfx(this.shootSfx, 0.4); // Tembakan sedikit lebih lembut
  }

  playExplosion() {
    this.playSfx(this.explosionSfx, 0.8);
  }

  playPlayerHit() {
    this.playSfx(this.playerHitSfx, 1.0);
  }

  private switchTrack(newAudio: HTMLAudioElement | null) {
    if (!newAudio || this.currentAudio === newAudio) return;

    const oldAudio = this.currentAudio;
    this.currentAudio = newAudio;

    if (oldAudio) {
      this.fadeOut(oldAudio, () => {
        oldAudio.pause();
        oldAudio.currentTime = 0;
      });
    }

    if (!this.isMuted) {
      this.currentAudio.volume = 0;
      this.currentAudio
        .play()
        .then(() => {
          this.fadeIn(this.currentAudio!);
        })
        .catch(() => {
          this.listenForFirstInteraction();
        });
    }
  }

  private fadeOut(audio: HTMLAudioElement, callback: () => void) {
    let vol = audio.volume;
    const fadeStep = 0.05;

    const interval = setInterval(() => {
      if (vol > fadeStep) {
        vol -= fadeStep;
        audio.volume = vol;
      } else {
        audio.volume = 0;
        clearInterval(interval);
        callback();
      }
    }, 30);
  }

  private fadeIn(audio: HTMLAudioElement) {
    let vol = 0;
    const fadeStep = 0.05;

    const interval = setInterval(() => {
      if (vol < this.targetVolume - fadeStep) {
        vol += fadeStep;
        audio.volume = vol;
      } else {
        audio.volume = this.targetVolume;
        clearInterval(interval);
      }
    }, 30);
  }

  playNormalBGM() {
    this.switchTrack(this.bgm);
  }

  playBossBGM() {
    this.switchTrack(this.bossBgm);
  }

  playVictoryBGM() {
    this.switchTrack(this.victoryBgm);
  }

  play() {
    if (this.currentAudio && !this.isMuted) {
      this.currentAudio.volume = this.targetVolume;
      this.currentAudio
        .play()
        .then(() => {
          this.isInitialized = true;
        })
        .catch(() => {
          this.listenForFirstInteraction();
        });
    }
  }

  setVolume(volume: number) {
    this.targetVolume = Math.max(0, Math.min(1, volume));
    this.sfxVolume = this.targetVolume;
    if (this.currentAudio && !this.isMuted) {
      this.currentAudio.volume = this.targetVolume;
    }
  }

  private listenForFirstInteraction() {
    if (this.isInitialized || typeof window === "undefined") return;

    const handleInteraction = () => {
      if (this.currentAudio && !this.isMuted) {
        this.currentAudio
          .play()
          .then(() => {
            this.isInitialized = true;
          })
          .catch((e) => console.log("Audio play blocked:", e));
      }
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
  }

  pause() {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  stopAll() {
    [this.bgm, this.bossBgm, this.victoryBgm].forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }

  stop() {
    this.stopAll();
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    [this.bgm, this.bossBgm, this.victoryBgm].forEach((audio) => {
      if (audio) audio.muted = mute;
    });
  }

  toggleMute() {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }
}
