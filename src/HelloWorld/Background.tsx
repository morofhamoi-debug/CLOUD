import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Background: React.FC<{ from: string; to: string }> = ({
  from,
  to,
}) => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [0, 300], [120, 240]);

  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(${angle}deg, ${from}, ${to})` }}
    >
      <Blob
        color="rgba(255,255,255,0.18)"
        size={700}
        x={-150}
        y={-200}
        speed={0.012}
      />
      <Blob
        color="rgba(255,120,200,0.25)"
        size={600}
        x={1350}
        y={600}
        speed={0.018}
      />
    </AbsoluteFill>
  );
};

const Blob: React.FC<{
  color: string;
  size: number;
  x: number;
  y: number;
  speed: number;
}> = ({ color, size, x, y, speed }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame * speed) * 80;
  const dy = Math.cos(frame * speed) * 60;

  return (
    <div
      style={{
        position: "absolute",
        left: x + dx,
        top: y + dy,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(120px)",
      }}
    />
  );
};
