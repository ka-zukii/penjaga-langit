export class AudioManager {
  private bgm: HTMLAudioElement | null = null;
  private bossBgm: HTMLAudioElement | null = null;
  private victoryBgm: HTMLAudioElement | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private currentVolume: number = 0.4;

  constructor(bgmSrc: string, bossBgmSrc: string, victorySrc: string) {
    if (typeof window !== "undefined") {
      this.bgm = new Audio(bgmSrc);
      this.bgm.loop = true;

      this.bossBgm = new Audio(bossBgmSrc);
      this.bossBgm.loop = true;

      this.victoryBgm = new Audio(victorySrc);
      this.victoryBgm.loop = true;

      this.currentAudio = this.bgm;
      this.setVolume(0.4);
    }
  }

  // HENTIKAN SEMUA AUDIO SECARA TOTAL & RESET TIME
  stopAll() {
    [this.bgm, this.bossBgm, this.victoryBgm].forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }

  playNormalBGM() {
    this.stopAll();
    this.currentAudio = this.bgm;
    this.setVolume(this.currentVolume);
    this.play();
  }

  playBossBGM() {
    this.stopAll();
    this.currentAudio = this.bossBgm;
    this.setVolume(this.currentVolume);
    this.play();
  }

  playVictoryBGM() {
    this.stopAll();
    this.currentAudio = this.victoryBgm;
    this.setVolume(this.currentVolume);
    this.play();
  }

  play() {
    if (this.currentAudio && !this.isMuted) {
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
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.bgm) this.bgm.volume = this.currentVolume;
    if (this.bossBgm) this.bossBgm.volume = this.currentVolume;
    if (this.victoryBgm) this.victoryBgm.volume = this.currentVolume;
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
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
  }

  pause() {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  stop() {
    this.stopAll();
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.bgm) this.bgm.muted = mute;
    if (this.bossBgm) this.bossBgm.muted = mute;
    if (this.victoryBgm) this.victoryBgm.muted = mute;
  }

  toggleMute() {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }
}
