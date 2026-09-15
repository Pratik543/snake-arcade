let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

const playTone = (freq: number, duration: number, type: OscillatorType = 'square', vol = 0.15) => {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch { /* silent */ }
};

const playNoise = (duration: number, vol = 0.1) => {
  try {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch { /* silent */ }
};

const sounds: Record<string, () => void> = {
  eat: () => {
    playTone(520, 0.08, 'square', 0.12);
    setTimeout(() => playTone(780, 0.1, 'square', 0.1), 40);
  },
  bonus: () => {
    playTone(440, 0.06, 'sine', 0.15);
    setTimeout(() => playTone(660, 0.06, 'sine', 0.12), 60);
    setTimeout(() => playTone(880, 0.1, 'sine', 0.1), 120);
  },
  special: () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => playTone(300 + i * 150, 0.08, 'sine', 0.1), i * 50);
    }
  },
  death: () => {
    playTone(200, 0.3, 'sawtooth', 0.15);
    playNoise(0.4, 0.12);
    setTimeout(() => playTone(100, 0.4, 'sawtooth', 0.1), 100);
  },
  move: () => {
    playTone(180, 0.03, 'sine', 0.03);
  },
  levelUp: () => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => setTimeout(() => playTone(n, 0.15, 'sine', 0.12), i * 100));
  },
  portal: () => {
    playTone(800, 0.15, 'sine', 0.1);
    setTimeout(() => playTone(400, 0.15, 'sine', 0.1), 80);
    setTimeout(() => playTone(1200, 0.1, 'sine', 0.08), 160);
  },
  combo: () => {
    playTone(600, 0.06, 'square', 0.08);
    setTimeout(() => playTone(900, 0.08, 'square', 0.06), 50);
  },
  menu: () => {
    playTone(440, 0.06, 'sine', 0.08);
  },
  select: () => {
    playTone(660, 0.08, 'sine', 0.1);
  },
};

export const createSoundEngine = () => ({
  play: (sound: string) => {
    sounds[sound]?.();
  },
});
