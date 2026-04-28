/**
 * Tiny synthesised sound bank for the Build page. Uses the Web Audio API so
 * we don't ship any audio files. Sounds are short, woody, intentionally
 * understated — they mark a successful snap, a cracked plank, a trim tap,
 * or a celebratory chime when the building reaches the standing threshold.
 *
 * The whole bank can be muted with `setBuildAudioMuted(true)`. The mute
 * preference is persisted in localStorage so it sticks across sessions.
 *
 * The AudioContext is created lazily on the first user-initiated sound and
 * resumed if the browser auto-suspended it (Safari, older Chrome).
 */

const MUTE_KEY = "wordpile:build-audio-muted";

let ctx: AudioContext | null = null;
let muted = false;

if (typeof window !== "undefined") {
  try {
    muted = window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    muted = false;
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const W = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  const Ctor = W.AudioContext ?? W.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

export function isBuildAudioMuted(): boolean {
  return muted;
}

export function setBuildAudioMuted(next: boolean) {
  muted = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {
      // Ignore — quota / privacy mode.
    }
  }
}

interface ToneOpts {
  freq: number;
  /** Seconds. */
  duration: number;
  /** "sine" | "square" | "sawtooth" | "triangle" — defaults to "sine". */
  type?: OscillatorType;
  /** 0..1 peak gain. Defaults to 0.18. */
  gain?: number;
  /** Optional second pitch the oscillator slides to. */
  glideTo?: number;
  /** Delay before this tone starts, in seconds. */
  delay?: number;
}

function tone(opts: ToneOpts) {
  const c = getCtx();
  if (!c) return;
  const { freq, duration, type = "sine", gain = 0.18, glideTo, delay = 0 } = opts;
  const start = c.currentTime + delay;
  const end = start + duration;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (glideTo) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, glideTo), end);
  }
  // Quick attack, gentle release so the tones don't click.
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + Math.min(0.02, duration / 4));
  g.gain.exponentialRampToValueAtTime(0.0001, end);
  osc.connect(g).connect(c.destination);
  osc.start(start);
  osc.stop(end + 0.02);
}

function noiseBurst(duration: number, gain = 0.18) {
  const c = getCtx();
  if (!c) return;
  const length = Math.max(1, Math.floor(c.sampleRate * duration));
  const buffer = c.createBuffer(1, length, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    // Decaying white noise — sounds more "wood crack" than constant hiss.
    const decay = 1 - i / length;
    data[i] = (Math.random() * 2 - 1) * decay * decay;
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  // Lowpass so the noise reads as a wooden snap rather than a digital hiss.
  const filt = c.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.setValueAtTime(2200, c.currentTime);
  filt.frequency.exponentialRampToValueAtTime(700, c.currentTime + duration);
  src.connect(filt).connect(g).connect(c.destination);
  src.start();
  src.stop(c.currentTime + duration + 0.05);
}

/** Soft thud — load-bearing timber locks into a frame slot. */
export function playFrameSnap() {
  if (muted) return;
  tone({ freq: 220, glideTo: 110, duration: 0.18, type: "triangle", gain: 0.22 });
  tone({ freq: 90, duration: 0.22, type: "sine", gain: 0.16, delay: 0.01 });
}

/** Light tap — interior trim placed on top. */
export function playTrimTap() {
  if (muted) return;
  tone({ freq: 660, glideTo: 540, duration: 0.09, type: "triangle", gain: 0.12 });
}

/** Untreated lumber landed — slightly more curious / unresolved tone. */
export function playUntestedTap() {
  if (muted) return;
  tone({ freq: 420, glideTo: 360, duration: 0.12, type: "triangle", gain: 0.14 });
  tone({ freq: 540, duration: 0.18, type: "sine", gain: 0.06, delay: 0.05 });
}

/** Crackle + downward sweep — Avoid plank shatters. */
export function playCrack() {
  if (muted) return;
  noiseBurst(0.28, 0.22);
  tone({ freq: 320, glideTo: 80, duration: 0.32, type: "sawtooth", gain: 0.12 });
}

/** Rejection bump — slot full / can't place. Quiet, brief. */
export function playBump() {
  if (muted) return;
  tone({ freq: 180, glideTo: 130, duration: 0.08, type: "square", gain: 0.08 });
}

/** Two-tone bell — building has reached the standing threshold. */
export function playStandingChime() {
  if (muted) return;
  tone({ freq: 523.25, duration: 0.45, type: "sine", gain: 0.17 });
  tone({ freq: 659.25, duration: 0.55, type: "sine", gain: 0.17, delay: 0.12 });
  tone({ freq: 783.99, duration: 0.7, type: "sine", gain: 0.13, delay: 0.24 });
}
