import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Title: React.FC<{ text: string; color: string }> = ({
  text,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <h1
      style={{
        margin: 0,
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
        fontSize: 140,
        fontWeight: 800,
        letterSpacing: -4,
        color,
        textAlign: "center",
        textShadow: "0 10px 40px rgba(0,0,0,0.25)",
      }}
    >
      {words.map((word, i) => {
        // Each word starts 6 frames after the previous one.
        const progress = spring({
          frame: frame - i * 6,
          fps,
          config: { damping: 12, mass: 0.6 },
        });

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              margin: "0 15px",
              opacity: Math.min(progress, 1),
              transform: `translateY(${(1 - progress) * 80}px) scale(${progress})`,
            }}
          >
            {word}
          </span>
        );
      })}
    </h1>
  );
};
