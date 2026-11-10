import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const NeonBackground: React.FC<{
  accent: string;
  secondary: string;
}> = ({ accent, secondary }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame / 25), [-1, 1], [0.35, 0.6]);
  const gridShift = (frame * 0.6) % 120;

  return (
    <AbsoluteFill style={{ backgroundColor: "#05040d", overflow: "hidden" }}>
      <Glow
        color={accent}
        size={900}
        x={-300}
        y={150}
        frame={frame}
        speed={0.015}
        opacity={pulse}
      />
      <Glow
        color={secondary}
        size={1000}
        x={500}
        y={1150}
        frame={frame}
        speed={0.011}
        opacity={pulse}
      />
      <Glow
        color={accent}
        size={500}
        x={650}
        y={-150}
        frame={frame}
        speed={0.02}
        opacity={0.25}
      />

      {/* Perspective grid drifting towards the viewer */}
      <AbsoluteFill
        style={{
          top: "62%",
          height: "60%",
          transform: "perspective(600px) rotateX(65deg)",
          transformOrigin: "top center",
          backgroundImage: `linear-gradient(${secondary}55 2px, transparent 2px), linear-gradient(90deg, ${secondary}55 2px, transparent 2px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `0 ${gridShift}px`,
          maskImage: "linear-gradient(to bottom, transparent, black 40%)",
          opacity: 0.5,
        }}
      />

      {/* Vignette keeps the centre readable */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Glow: React.FC<{
  color: string;
  size: number;
  x: number;
  y: number;
  frame: number;
  speed: number;
  opacity: number;
}> = ({ color, size, x, y, frame, speed, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: x + Math.sin(frame * speed) * 120,
      top: y + Math.cos(frame * speed * 0.8) * 160,
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      opacity,
      filter: "blur(180px)",
    }}
  />
);
