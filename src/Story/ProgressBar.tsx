import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./font";

export const ProgressBar: React.FC<{
  accent: string;
  secondary: string;
  current: number;
  total: number;
}> = ({ accent, secondary, current, total }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 100], {
    extrapolateRight: "clamp",
  });
  const formatTime = (f: number) => {
    const s = Math.floor(f / fps);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    // Kept above the bottom ~250px that Shorts/Reels cover with UI.
    <div style={{ position: "absolute", left: 90, right: 90, bottom: 260 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 18,
          fontFamily,
          fontSize: 30,
          fontWeight: 600,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: 2,
        }}
      >
        <span>
          {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span>
          {formatTime(frame)} / {formatTime(durationInFrames)}
        </span>
      </div>
      <div
        style={{
          height: 10,
          borderRadius: 5,
          background: "rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: 5,
            background: `linear-gradient(90deg, ${secondary}, ${accent})`,
            boxShadow: `0 0 20px ${accent}, 0 0 40px ${accent}88`,
          }}
        />
      </div>
    </div>
  );
};
