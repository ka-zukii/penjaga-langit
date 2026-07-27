export class AudioManager {
  private bgm: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  constructor(src: string) {
    if (typeof window !== "undefined") {
      this.bgm = new Audio(src);
      this.bgm.loop = true;
      this.bgm.volume = 0.4;
    }
  }

  setVolume(volume: number) {
    if (this.bgm) {
      this.bgm.volume = Math.max(0, Math.min(1, volume));
    }
  }

  getVolume(): number {
    return this.bgm ? this.bgm.volume : 0.4;
  }

  play() {
    if (this.bgm && !this.isMuted) {
      this.bgm
        .play()
        .then(() => {
          this.isInitialized = true;
        })
        .catch(() => {
          this.listenForFirstInteraction();
        });
    }
  }

  private listenForFirstInteraction() {
    if (this.isInitialized || typeof window === "undefined") return;

    const handleInteraction = () => {
      if (this.bgm && !this.isMuted) {
        this.bgm
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
    if (this.bgm) {
      this.bgm.pause();
    }
  }

  stop() {
    if (this.bgm) {
      this.bgm.pause();
      this.bgm.currentTime = 0;
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.bgm) {
      this.bgm.muted = mute;
    }
  }

  toggleMute() {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }
}
