/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundService {
  private audioContext: AudioContext | null = null;

  private init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playCorrect() {
    this.init();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, this.audioContext.currentTime + 0.1); // C6

    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  playIncorrect() {
    this.init();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, this.audioContext.currentTime + 0.2);

    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.4);
  }
}

export const soundService = new SoundService();
