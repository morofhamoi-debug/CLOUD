import { Easing, interpolate, random } from "remotion";

export const ease = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Smooth pseudo-random motion in [-amp, amp], for hand-held camera / trembling. */
export const wobble = (frame: number, seed: number, amp: number) =>
  (Math.sin(frame * 0.31 + seed) * 0.55 +
    Math.sin(frame * 0.73 + seed * 2.1) * 0.3 +
    Math.sin(frame * 1.37 + seed * 3.7) * 0.15) *
  amp;

/** Unsteady light: mostly on, with deterministic random dips. */
export const flicker = (frame: number, seed: string, amount = 1) => {
  const r = random(`${seed}-${Math.floor(frame / 2)}`);
  const dip = r > 0.82 ? 0.25 + r * 0.3 : r > 0.7 ? 0.75 : 1;
  return 1 - (1 - dip) * amount;
};
