import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Subtitle: React.FC<{ text: string; color: string }> = ({
  text,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line = spring({ frame, fps, config: { damping: 200 } });
  const opacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [10, 30], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: 240 * line,
          height: 6,
          borderRadius: 3,
          background: color,
          marginBottom: 36,
        }}
      />
      <p
        style={{
          margin: 0,
          fontFamily: "Inter, Helvetica, Arial, sans-serif",
          fontSize: 48,
          fontWeight: 500,
          color,
          opacity,
          transform: `translateY(${y}px)`,
        }}
      >
        {text}
      </p>
    </div>
  );
};
