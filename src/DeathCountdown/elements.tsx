import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { condensed, mono, serif } from "./theme";

const fill = (style: React.CSSProperties): React.CSSProperties => ({
  position: "absolute",
  ...style,
});

/** Wall + floor interior. `light` dims the whole room. */
export const Room: React.FC<{
  wall: string;
  wallDark: string;
  floor: string;
  floorY?: number;
  children?: React.ReactNode;
}> = ({ wall, wallDark, floor, floorY = 1260, children }) => (
  <AbsoluteFill style={{ background: wallDark }}>
    <div
      style={fill({
        inset: 0,
        bottom: 1920 - floorY,
        background: `radial-gradient(ellipse at 50% 35%, ${wall}, ${wallDark} 75%)`,
      })}
    />
    <div
      style={fill({
        inset: 0,
        bottom: 1920 - floorY,
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 60px)",
      })}
    />
    <div
      style={fill({
        left: 0,
        right: 0,
        top: floorY,
        bottom: 0,
        background: `linear-gradient(${floor}, #050507)`,
      })}
    />
    <div
      style={fill({
        left: 0,
        right: 0,
        top: floorY - 14,
        height: 14,
        background: "rgba(0,0,0,0.45)",
      })}
    />
    {children}
  </AbsoluteFill>
);

/** Darkness overlay, 0 = no change, 1 = black. */
export const Shade: React.FC<{ amount: number; color?: string }> = ({
  amount,
  color = "#000",
}) => <AbsoluteFill style={{ background: color, opacity: amount }} />;

export const LightPool: React.FC<{
  x: number;
  y: number;
  r: number;
  color: string;
  opacity?: number;
}> = ({ x, y, r, color, opacity = 1 }) => (
  <div
    style={fill({
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color}, transparent 70%)`,
      opacity,
      mixBlendMode: "screen",
    })}
  />
);

const hand = (angle: number, length: number, width: number, color: string) => (
  <line
    x1={0}
    y1={length * 0.15}
    x2={0}
    y2={-length}
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    transform={`rotate(${angle})`}
  />
);

/** Classic wall clock. `time` = seconds since midnight (may exceed 24h). */
export const WallClock: React.FC<{
  size: number;
  time: number;
  glow?: string;
  dim?: number;
  highlightTwelve?: number;
  style?: React.CSSProperties;
}> = ({ size, time, glow, dim = 0, highlightTwelve = 0, style }) => {
  const s = time % 60;
  const m = (time / 60) % 60;
  const h = (time / 3600) % 12;
  const numerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

  return (
    <svg
      viewBox="-100 -100 200 200"
      width={size}
      height={size}
      style={{
        position: "absolute",
        overflow: "visible",
        filter: glow ? `drop-shadow(0 0 ${size / 20}px ${glow})` : undefined,
        ...style,
      }}
    >
      <circle r={98} fill="#2a1d14" />
      <circle r={90} fill="#d9cfb8" />
      <circle r={90} fill="url(#clockShade)" />
      <defs>
        <radialGradient id="clockShade" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.35} />
        </radialGradient>
      </defs>
      {Array.from({ length: 60 }, (_, i) => (
        <line
          key={i}
          y1={-86}
          y2={i % 5 === 0 ? -76 : -82}
          stroke="#2a2420"
          strokeWidth={i % 5 === 0 ? 2.4 : 1}
          transform={`rotate(${i * 6})`}
        />
      ))}
      {numerals.map((n, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <text
            key={n}
            x={Math.sin(a) * 63}
            y={-Math.cos(a) * 63 + 5}
            textAnchor="middle"
            fontFamily={serif}
            fontSize={i === 0 ? 15 : 12}
            fontWeight={600}
            fill={i === 0 && highlightTwelve > 0 ? `rgba(200,30,25,${0.4 + highlightTwelve * 0.6})` : "#2a2420"}
          >
            {n}
          </text>
        );
      })}
      {hand(h * 30, 45, 6, "#1b1714")}
      {hand(m * 6, 68, 4, "#1b1714")}
      {hand(s * 6, 76, 1.6, "#9e1b17")}
      <circle r={5} fill="#1b1714" />
      <circle r={90} fill="#000" opacity={dim} />
    </svg>
  );
};

/** Front view of a door. `open` 0..1 swings the leaf away from the viewer. */
export const Door: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  open?: number;
  outside?: string;
  handleAngle?: number;
  mailSlot?: boolean;
  peephole?: boolean;
  wood?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  x,
  y,
  w,
  h,
  open = 0,
  outside = "#000",
  handleAngle = 0,
  mailSlot,
  peephole,
  wood = "#3a2a20",
  style,
  children,
}) => (
  <div style={fill({ left: x, top: y, width: w, height: h, ...style })}>
    <div
      style={fill({
        inset: -26,
        bottom: 0,
        background: "#1a130f",
        boxShadow: "0 0 40px rgba(0,0,0,0.7)",
      })}
    />
    <div style={fill({ inset: 0, background: outside, overflow: "hidden" })}>
      {children}
    </div>
    <div
      style={fill({
        inset: 0,
        transformOrigin: "left center",
        transform: `perspective(1800px) rotateY(${open * 80}deg)`,
        background: `linear-gradient(90deg, ${wood}, #241a14)`,
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.6)",
      })}
    >
      {[0.08, 0.53].map((top) => (
        <div
          key={top}
          style={fill({
            left: "12%",
            right: "12%",
            top: `${top * 100}%`,
            height: "38%",
            boxShadow:
              "inset 6px 6px 14px rgba(0,0,0,0.55), inset -3px -3px 8px rgba(255,255,255,0.05)",
            borderRadius: 4,
          })}
        />
      ))}
      {mailSlot ? (
        <div
          style={fill({
            left: "30%",
            right: "30%",
            top: "49%",
            height: 22,
            background: "#9a8457",
            border: "4px solid #6e5d3c",
            borderRadius: 4,
          })}
        />
      ) : null}
      {peephole ? (
        <div
          style={fill({
            left: w / 2 - 12,
            top: h * 0.3,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "radial-gradient(circle, #f5f1d0 20%, #6e5d3c 60%)",
          })}
        />
      ) : null}
      <div
        style={fill({
          right: w * 0.08,
          top: h * 0.52,
          width: w * 0.2,
          height: Math.max(14, w * 0.035),
          background: "linear-gradient(#d2b779, #7a6236)",
          borderRadius: 8,
          transformOrigin: "88% 50%",
          transform: `rotate(${handleAngle}deg)`,
          boxShadow: "0 4px 8px rgba(0,0,0,0.6)",
        })}
      />
      <div
        style={fill({
          right: w * 0.08 + w * 0.02,
          top: h * 0.52 - w * 0.015,
          width: w * 0.06,
          height: w * 0.06,
          borderRadius: "50%",
          background: "#5a4626",
        })}
      />
    </div>
  </div>
);

export const Phone: React.FC<{
  x: number;
  y: number;
  w: number;
  time: string;
  glow?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, w, time, glow = 1, children, style }) => {
  const h = w * 2.05;
  return (
    <div style={fill({ left: x, top: y, width: w, height: h, ...style })}>
      <div
        style={fill({
          inset: -w * 0.5,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(140,180,255,${0.35 * glow}), transparent 65%)`,
        })}
      />
      <div
        style={fill({
          inset: 0,
          borderRadius: w * 0.13,
          background: "#0c0c0f",
          border: "3px solid #2a2b31",
          boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
        })}
      />
      <div
        style={fill({
          inset: w * 0.04,
          borderRadius: w * 0.1,
          background: `linear-gradient(160deg, rgba(40,52,84,${glow}), rgba(10,12,22,${glow}))`,
          overflow: "hidden",
          fontFamily: mono,
          color: "#e8edf7",
          opacity: 0.2 + glow * 0.8,
        })}
      >
        <div
          style={{
            textAlign: "center",
            marginTop: w * 0.16,
            fontFamily: condensed,
            fontSize: w * 0.26,
            letterSpacing: 2,
          }}
        >
          {time}
        </div>
        {children}
      </div>
    </div>
  );
};

export const Window: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  sky: string;
  rain?: boolean;
  moon?: boolean;
  children?: React.ReactNode;
}> = ({ x, y, w, h, sky, rain, moon, children }) => {
  const frame = useCurrentFrame();
  return (
    <div style={fill({ left: x, top: y, width: w, height: h })}>
      <div style={fill({ inset: -24, background: "#120f0d" })} />
      <div style={fill({ inset: 0, background: sky, overflow: "hidden" })}>
        {moon ? (
          <div
            style={fill({
              right: w * 0.18,
              top: h * 0.12,
              width: w * 0.18,
              height: w * 0.18,
              borderRadius: "50%",
              background: "#e9eef7",
              boxShadow: "0 0 60px 20px rgba(200,215,240,0.35)",
            })}
          />
        ) : null}
        {children}
        {rain
          ? Array.from({ length: 70 }, (_, i) => {
              const speed = 38 + random(`rs${i}`) * 30;
              const top = ((random(`ry${i}`) * (h + 200) + frame * speed) % (h + 200)) - 200;
              return (
                <div
                  key={i}
                  style={fill({
                    left: random(`rx${i}`) * w,
                    top,
                    width: 2,
                    height: 70 + random(`rl${i}`) * 80,
                    background: "linear-gradient(transparent, rgba(190,210,240,0.55))",
                    transform: "rotate(8deg)",
                  })}
                />
              );
            })
          : null}
      </div>
      {/* Mullions */}
      <div style={fill({ left: w / 2 - 8, top: 0, width: 16, height: h, background: "#120f0d" })} />
      <div style={fill({ left: 0, top: h * 0.45, width: w, height: 16, background: "#120f0d" })} />
    </div>
  );
};

/** Bare hanging bulb with its own glow. */
export const Bulb: React.FC<{ x: number; y: number; intensity: number; color?: string }> = ({
  x,
  y,
  intensity,
  color = "255,214,150",
}) => (
  <>
    <div style={fill({ left: x - 2, top: 0, width: 4, height: y, background: "#0d0d0d" })} />
    <LightPool x={x} y={y + 30} r={520} color={`rgba(${color},${0.55 * intensity})`} />
    <div
      style={fill({
        left: x - 26,
        top: y,
        width: 52,
        height: 68,
        borderRadius: "50% 50% 45% 45%",
        background: `rgba(${color},${0.25 + 0.75 * intensity})`,
        boxShadow: `0 0 ${60 * intensity}px ${20 * intensity}px rgba(${color},${0.6 * intensity})`,
      })}
    />
  </>
);

export const Fog: React.FC<{ color?: string; opacity?: number; speed?: number }> = ({
  color = "200,210,230",
  opacity = 0.35,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {[0, 1, 2, 3].map((i) => {
        const x = ((frame * speed * (0.6 + i * 0.3) + i * 400) % 2200) - 700;
        return (
          <div
            key={i}
            style={fill({
              left: x,
              top: 900 + i * 180,
              width: 1400,
              height: 520,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, rgba(${color},0.55), transparent 70%)`,
            })}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Faceless supporting figures. None of them ever gets a face. */
export const Figure: React.FC<{
  kind: "stranger" | "shadow" | "mother" | "friend";
  x: number;
  y: number;
  h: number;
  color?: string;
  rim?: string;
  style?: React.CSSProperties;
}> = ({ kind, x, y, h, color = "#050506", rim, style }) => {
  const shapes: Record<typeof kind, React.ReactNode> = {
    stranger: (
      <>
        <path d="M130 40 L270 40 L262 96 L138 96 Z" />
        <ellipse cx={200} cy={98} rx={110} ry={14} />
        <ellipse cx={200} cy={140} rx={50} ry={60} />
        <path d="M150 190 Q200 175 250 190 L300 240 L320 860 L80 860 L100 240 Z" />
      </>
    ),
    shadow: (
      <>
        <ellipse cx={200} cy={120} rx={58} ry={74} />
        <path d="M120 200 Q200 170 280 200 Q330 300 320 520 L300 900 L100 900 L80 520 Q70 300 120 200 Z" />
      </>
    ),
    mother: (
      <>
        <circle cx={200} cy={110} r={34} fill="#8f8a84" />
        <ellipse cx={200} cy={190} rx={52} ry={64} fill="#c49a80" />
        <path d="M140 250 Q200 230 260 250 L300 520 Q200 560 100 520 Z" fill="#6b4a52" />
        <path d="M120 300 L280 300 L270 360 L130 360 Z" fill="#8a5d64" opacity={0.7} />
        <rect x={130} y={500} width={140} height={360} rx={30} fill="#3b2f34" />
      </>
    ),
    friend: (
      <>
        <ellipse cx={200} cy={140} rx={58} ry={72} fill="#b98b6f" />
        <path d="M142 120 Q150 60 200 62 Q252 60 258 120 Q230 92 200 98 Q168 92 142 120 Z" fill="#6a4a2c" />
        <path d="M118 262 Q200 234 282 262 L292 330 L276 545 Q200 560 124 545 L108 330 Z" fill="#4b5a3c" />
        <rect x={148} y={520} width={104} height={340} rx={16} fill="#25262b" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 400 900"
      width={(h * 400) / 900}
      height={h}
      style={{
        position: "absolute",
        left: x,
        top: y,
        overflow: "visible",
        fill: color,
        filter: rim ? `drop-shadow(0 0 4px ${rim}) drop-shadow(0 0 22px ${rim})` : undefined,
        ...style,
      }}
    >
      {shapes[kind]}
    </svg>
  );
};
