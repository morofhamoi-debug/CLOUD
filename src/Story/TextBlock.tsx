import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./font";

const EXIT_FRAMES = 12;

/** Rendered inside a <Sequence>, so frame 0 is the moment the block appears. */
export const TextBlock: React.FC<{ text: string; accent: string }> = ({
  text,
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const exit = interpolate(
    frame,
    [durationInFrames - EXIT_FRAMES, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const opacity = Math.min(enter, 1) * (1 - exit);
  const translateY = (1 - enter) * 120 - exit * 80;
  const blur = (1 - Math.min(enter, 1)) * 12 + exit * 10;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 90px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily,
          fontSize: 78,
          fontWeight: 800,
          lineHeight: 1.25,
          color: "#ffffff",
          textAlign: "center",
          textWrap: "balance",
          opacity,
          transform: `translateY(${translateY}px)`,
          filter: `blur(${blur}px)`,
          textShadow: `0 6px 24px rgba(0,0,0,0.9), 0 0 40px ${accent}88`,
        }}
      >
        {text}
      </p>
    </AbsoluteFill>
  );
};
