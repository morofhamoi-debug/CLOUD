// Procedurally synthesises the music beds and sound effects used by the
// DeathCountdown composition into public/sfx/*.wav. Deterministic (seeded),
// no dependencies: `node scripts/generate-sfx.mjs`.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx");
const TAU = Math.PI * 2;

let seed = 1234567;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;

const buf = (seconds) => new Float32Array(Math.round(seconds * SR));

const lowpass = (x, cutoff) => {
  const a = 1 - Math.exp((-TAU * cutoff) / SR);
  let y = 0;
  for (let i = 0; i < x.length; i++) x[i] = y += a * (x[i] - y);
  return x;
};
const highpass = (x, cutoff) => {
  const lp = lowpass(Float32Array.from(x), cutoff);
  for (let i = 0; i < x.length; i++) x[i] -= lp[i];
  return x;
};
// Two-pole resonator, used for wood/metal body resonances.
const resonate = (x, freq, q) => {
  const r = Math.exp((-Math.PI * freq) / (q * SR));
  const c = 2 * r * Math.cos((TAU * freq) / SR);
  const out = new Float32Array(x.length);
  let y1 = 0;
  let y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const y = x[i] * (1 - r) + c * y1 - r * r * y2;
    out[i] = y;
    y2 = y1;
    y1 = y;
  }
  return out;
};
const mixInto = (dst, src, at = 0, gain = 1) => {
  const o = Math.round(at * SR);
  for (let i = 0; i < src.length && o + i < dst.length; i++)
    dst[o + i] += src[i] * gain;
  return dst;
};
const normalize = (x, peak = 0.9) => {
  let m = 0;
  for (const v of x) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < x.length; i++) x[i] *= peak / m;
  return x;
};
const fadeEdges = (x, fadeIn = 0.005, fadeOut = 0.02) => {
  const fi = Math.round(fadeIn * SR);
  const fo = Math.round(fadeOut * SR);
  for (let i = 0; i < fi && i < x.length; i++) x[i] *= i / fi;
  for (let i = 0; i < fo && i < x.length; i++) x[x.length - 1 - i] *= i / fo;
  return x;
};
// Makes a buffer loop seamlessly by crossfading its tail into its head.
const makeLoop = (x, seconds) => {
  const n = Math.round(seconds * SR);
  const xf = x.length - n;
  const out = x.slice(0, n);
  for (let i = 0; i < xf; i++) {
    const t = i / xf;
    out[i] = x[n + i] * (1 - t) + x[i] * t;
  }
  return out;
};

const write = (name, x) => {
  const data = Buffer.alloc(44 + x.length * 2);
  data.write("RIFF", 0);
  data.writeUInt32LE(36 + x.length * 2, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(SR, 24);
  data.writeUInt32LE(SR * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(x.length * 2, 40);
  for (let i = 0; i < x.length; i++)
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, x[i])) * 32767), 44 + i * 2);
  const file = join(OUT, `${name}.wav`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
  console.log(`${name}.wav  ${(x.length / SR).toFixed(2)}s`);
};

// --- Sound effects -------------------------------------------------------

const click = (freq, seconds = 0.09) => {
  const x = buf(seconds);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = noise() * Math.exp(-t * 400) * 0.6 + Math.sin(TAU * freq * t) * Math.exp(-t * 90) * 0.5;
  }
  return normalize(highpass(resonate(x, freq, 8), 600), 0.8);
};
write("tick", click(3100));
write("tock", click(2300));

{
  const x = buf(0.9);
  for (const at of [0, 0.26]) {
    const beat = buf(0.35);
    for (let i = 0; i < beat.length; i++) {
      const t = i / SR;
      const f = 48 + 40 * Math.exp(-t * 30);
      beat[i] = Math.sin(TAU * f * t) * Math.exp(-t * 16);
    }
    mixInto(x, beat, at, at === 0 ? 1 : 0.7);
  }
  write("heartbeat", normalize(lowpass(x, 200), 0.95));
}

{
  const x = buf(1.3);
  for (const [start, end] of [[0, 0.45], [0.7, 1.15]]) {
    for (let i = Math.round(start * SR); i < end * SR; i++) {
      const t = i / SR;
      const env = Math.min(1, (t - start) * 60, (end - t) * 60);
      const motor = Math.sign(Math.sin(TAU * 165 * t)) * 0.5 + Math.sin(TAU * 330 * t) * 0.3;
      x[i] = (motor + noise() * 0.25) * env;
    }
  }
  write("vibrate", normalize(lowpass(x, 1800), 0.7));
}

{
  const x = buf(2.6);
  for (const [start, end] of [[0, 0.9], [1.4, 2.3]]) {
    for (let i = Math.round(start * SR); i < end * SR; i++) {
      const t = i / SR;
      const gate = Math.sin(TAU * 22 * t) > 0 ? 1 : 0;
      const env = Math.min(1, (t - start) * 40, (end - t) * 40);
      x[i] = (Math.sin(TAU * 440 * t) + Math.sin(TAU * 480 * t)) * 0.5 * gate * env;
    }
  }
  write("ring", normalize(resonate(x, 900, 1.5), 0.6));
}

{
  const x = buf(1.1);
  for (const at of [0, 0.22, 0.44]) {
    const k = buf(0.3);
    for (let i = 0; i < k.length; i++) {
      const t = i / SR;
      k[i] = (noise() * 0.6 + Math.sin(TAU * 110 * t)) * Math.exp(-t * 35);
    }
    mixInto(x, resonate(lowpass(k, 900), 180, 4), at);
  }
  write("knock", normalize(x, 0.95));
}

{
  // Stick-slip impulses at a wandering rate excite wooden resonances.
  const len = 2.8;
  const x = buf(len);
  let phase = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const rate = 35 + 25 * Math.sin(TAU * 0.6 * t) + 12 * Math.sin(TAU * 2.3 * t);
    phase += rate / SR;
    if (phase >= 1) {
      phase -= 1;
      x[i] = 1;
    }
    x[i] += noise() * 0.02;
    x[i] *= Math.sin((Math.PI * t) / len);
  }
  const body = resonate(x, 720, 12);
  mixInto(body, resonate(x, 1350, 14), 0, 0.7);
  mixInto(body, resonate(x, 2600, 10), 0, 0.3);
  write("creak", normalize(highpass(body, 200), 0.8));
}

{
  const x = buf(3.2);
  for (let s = 0; s < 5; s++) {
    const step = buf(0.4);
    for (let i = 0; i < step.length; i++) {
      const t = i / SR;
      step[i] = Math.sin(TAU * (70 + 30 * Math.exp(-t * 40)) * t) * Math.exp(-t * 22) + noise() * 0.3 * Math.exp(-t * 12);
    }
    mixInto(x, lowpass(step, 600), s * 0.62, 0.6 + s * 0.1);
  }
  write("steps", normalize(x, 0.9));
}

{
  // Inharmonic bell partials, like a big grandfather clock strike.
  const len = 7;
  const x = buf(len);
  const f0 = 130;
  const partials = [[0.5, 1, 0.6], [1, 0.8, 1], [1.19, 0.5, 1.3], [1.5, 0.45, 1.6], [2, 0.4, 2], [2.52, 0.25, 2.6], [3, 0.2, 3.2], [4.07, 0.12, 4.5]];
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    let v = 0;
    for (const [ratio, amp, decay] of partials)
      v += Math.sin(TAU * f0 * ratio * t + ratio) * amp * Math.exp(-t * decay * 0.7);
    v += noise() * Math.exp(-t * 60) * 0.5;
    x[i] = v;
  }
  write("bell", normalize(fadeEdges(x, 0.001, 0.5), 0.95));
}

{
  const x = buf(1.8);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const f = 20 + 100 * Math.exp(-t * 2.5);
    ph += (TAU * f) / SR;
    x[i] = (Math.sin(ph) + Math.sign(Math.sin(ph)) * 0.3) * Math.exp(-t * 1.8) + (t < 0.03 ? noise() : 0);
  }
  write("powerdown", normalize(lowpass(fadeEdges(x), 1200), 0.85));
}

{
  const x = buf(3);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = Math.sin(TAU * (32 + 40 * Math.exp(-t * 6)) * t) * Math.exp(-t * 1.6) + noise() * Math.exp(-t * 5) * 0.4;
  }
  write("impact", normalize(lowpass(fadeEdges(x), 400), 0.95));
}

{
  // Dissonant high cluster swelling in: the "something is wrong" sting.
  const len = 3.5;
  const x = buf(len);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const vib = Math.sin(TAU * 5.5 * t) * 0.004;
    let v = 0;
    for (const f of [880, 932, 988, 1397]) v += Math.sin(TAU * f * t * (1 + vib));
    x[i] = v * Math.sin((Math.PI * t) / len) ** 2;
  }
  write("sting", normalize(x, 0.5));
}

{
  const x = buf(1.2);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = noise() * (0.3 + 0.7 * Math.abs(Math.sin(TAU * 7 * t + Math.sin(TAU * 3 * t)))) * Math.sin((Math.PI * t) / 1.2);
  }
  write("paper", normalize(highpass(lowpass(x, 5000), 1200), 0.6));
}

{
  const len = 9;
  const x = buf(len);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const p = t / len;
    ph += (TAU * (80 * 2 ** (p * 3))) / SR;
    x[i] = (Math.sin(ph) * 0.5 + Math.sin(ph * 1.5) * 0.3 + noise() * (0.2 + p * 0.5)) * p ** 2;
  }
  write("riser", normalize(lowpass(fadeEdges(x, 0.5, 0.01), 4000), 0.8));
}

{
  // Heavy, shaky breathing: two inhale/exhale cycles of band-limited noise.
  const len = 3.2;
  const x = buf(len);
  const phases = [[0, 0.55, 0.5], [0.6, 1.5, 0.8], [1.6, 2.1, 0.55], [2.2, 3.1, 0.85]];
  for (const [start, end, amp] of phases) {
    for (let i = Math.round(start * SR); i < end * SR; i++) {
      const t = (i / SR - start) / (end - start);
      const shake = 0.8 + 0.2 * Math.sin(TAU * 9 * (i / SR));
      x[i] = noise() * Math.sin(Math.PI * t) ** 1.5 * amp * shake;
    }
  }
  write("breath", normalize(highpass(lowpass(x, 1800), 350), 0.7));
}

{
  const loop = 6;
  const x = buf(loop + 1);
  const hiss = highpass(lowpass(Float32Array.from({ length: x.length }, noise), 6000), 800);
  for (let i = 0; i < x.length; i++) x[i] = hiss[i] * 0.35;
  for (let d = 0; d < 260; d++) {
    const drop = buf(0.03);
    for (let i = 0; i < drop.length; i++) drop[i] = noise() * Math.exp((-i / SR) * 250);
    mixInto(x, resonate(drop, 1500 + rand() * 3000, 3), rand() * (loop + 0.9), 0.3 + rand() * 0.5);
  }
  write("rain", normalize(makeLoop(x, loop), 0.6));
}

// --- Music beds (seamless loops) -----------------------------------------

{
  // Dark drone: A1 against a beating B♭1 with a slow swell and wind.
  const loop = 24;
  const x = buf(loop + 2);
  const wind = lowpass(Float32Array.from({ length: x.length }, noise), 300);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const swell = 0.7 + 0.3 * Math.sin((TAU * t) / 8);
    x[i] =
      (Math.sin(TAU * 55 * t) * 0.5 + Math.sin(TAU * 58.25 * t) * 0.35 + Math.sin(TAU * 110 * t) * 0.2 + Math.sin(TAU * 164.75 * t) * 0.08 * (1 - swell)) * swell +
      wind[i] * 1.8;
  }
  write("drone", normalize(makeLoop(x, loop), 0.7));
}

{
  // Pulsing low ostinato (120 bpm 8ths) for the final act.
  const loop = 4;
  const x = buf(loop);
  const notes = [55, 55, 65.41, 55, 55, 58.27, 55, 49];
  for (let n = 0; n < 16; n++) {
    const f = notes[n % notes.length];
    const pluck = buf(0.25);
    let ph = 0;
    for (let i = 0; i < pluck.length; i++) {
      const t = i / SR;
      ph += (TAU * f) / SR;
      pluck[i] = (Math.sign(Math.sin(ph)) * 0.6 + Math.sin(ph * 2) * 0.4) * Math.exp(-t * 14);
    }
    mixInto(x, lowpass(pluck, 500 + (n % 4) * 150), n * 0.25);
  }
  write("pulse", normalize(x, 0.7));
}
