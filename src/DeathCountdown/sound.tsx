import { staticFile, Html5Audio, Sequence } from "remotion";

export type SfxName =
  | "tick"
  | "tock"
  | "heartbeat"
  | "vibrate"
  | "ring"
  | "knock"
  | "creak"
  | "steps"
  | "bell"
  | "powerdown"
  | "impact"
  | "sting"
  | "paper"
  | "riser"
  | "breath"
  | "rain"
  | "drone"
  | "pulse";

export const Sfx: React.FC<{
  src: SfxName;
  at?: number;
  /** Cut the sound after this many frames. */
  duration?: number;
  volume?: number | ((f: number) => number);
  rate?: number;
  loop?: boolean;
}> = ({ src, at = 0, duration, volume = 1, rate = 1, loop = false }) => (
  <Sequence
    from={Math.max(0, Math.round(at))}
    durationInFrames={duration}
    layout="none"
    name={`♪ ${src}`}
  >
    <Html5Audio
      src={staticFile(`sfx/${src}.wav`)}
      volume={volume}
      playbackRate={rate}
      loop={loop}
    />
  </Sequence>
);

/** Clock ticks at the given frames, alternating tick/tock. */
export const Ticks: React.FC<{ frames: number[]; volume?: number }> = ({
  frames,
  volume = 0.6,
}) => (
  <>
    {frames.map((f, i) => (
      <Sfx key={f} src={i % 2 ? "tock" : "tick"} at={f} volume={volume} />
    ))}
  </>
);

export const everyN = (duration: number, n: number, offset = 0) =>
  Array.from(
    { length: Math.max(0, Math.ceil((duration - offset) / n)) },
    (_, i) => offset + i * n,
  );
