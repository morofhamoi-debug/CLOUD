import React from "react";
import { useCurrentFrame } from "remotion";

export type Expression =
  | "neutral"
  | "smile"
  | "laugh"
  | "worried"
  | "sad"
  | "fear"
  | "whisper";

export type HeroProps = {
  pose?: "stand" | "sit";
  facing?: "front" | "back";
  expression?: Expression;
  /** "full" = whole body, "bust" = head and shoulders, or a custom SVG viewBox. */
  framing?: "full" | "bust" | string;
  /** Pupil direction, -1..1 on each axis. */
  look?: { x: number; y: number };
  /** Breathing speed multiplier; > 2 reads as panic. */
  breath?: number;
  /** Overall brightness, 1 = fully lit. */
  light?: number;
  /** Optional coloured rim light (CSS colour). */
  rim?: string;
  width: number;
  style?: React.CSSProperties;
};

// The hero's fixed look. Changing these changes him in every scene.
const C = {
  skin: "#c79a7e",
  skinShade: "#a87a62",
  hair: "#2a1d17",
  cardigan: "#3b414d",
  cardiganShade: "#2c313b",
  shirt: "#d8d2c4",
  trousers: "#1f2228",
  shoes: "#111114",
  glasses: "#15151a",
};

const VIEWBOX = { full: "0 0 400 900", bust: "40 20 320 380" };

export const Hero: React.FC<HeroProps> = ({
  pose = "stand",
  facing = "front",
  expression = "neutral",
  framing = "full",
  look = { x: 0, y: 0 },
  breath = 1,
  light = 1,
  rim,
  width,
  style,
}) => {
  const frame = useCurrentFrame();
  const viewBox =
    framing === "full" || framing === "bust" ? VIEWBOX[framing] : framing;
  const [, , vbW, vbH] = viewBox.split(" ").map(Number);

  const breathPhase = Math.sin(frame * 0.09 * breath);
  const chest = breathPhase * (breath > 2 ? 4 : 1.6);
  // Blink for 4 frames roughly every 3.3 s (not while terrified).
  const blinking = expression !== "fear" && frame % 100 > 95;

  let headTilt = 0;
  let headY = 0;
  if (expression === "laugh") {
    headTilt = -7 + Math.sin(frame * 0.9) * 2;
    headY = Math.abs(Math.sin(frame * 0.9)) * -6;
  }

  const sitOffset = pose === "sit" ? 150 : 0;
  const filter = [
    `brightness(${light})`,
    rim ? `drop-shadow(0 0 3px ${rim}) drop-shadow(0 0 14px ${rim})` : "",
  ].join(" ");

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={(width * vbH) / vbW}
      style={{ overflow: "visible", filter, ...style }}
    >
      {pose === "stand" ? <StandingLegs /> : <SittingLegs />}
      <g transform={`translate(0 ${sitOffset - chest * 0.4})`}>
        <Torso facing={facing} chest={chest} />
        <g
          transform={`translate(0 ${headY - chest * 0.5}) rotate(${headTilt} 200 200)`}
        >
          {facing === "front" ? (
            <Face
              expression={expression}
              look={look}
              blinking={blinking}
              frame={frame}
            />
          ) : (
            <BackOfHead />
          )}
        </g>
      </g>
    </svg>
  );
};

const StandingLegs = () => (
  <g>
    <rect x={148} y={520} width={48} height={335} rx={14} fill={C.trousers} />
    <rect x={204} y={520} width={48} height={335} rx={14} fill={C.trousers} />
    <ellipse cx={170} cy={860} rx={36} ry={14} fill={C.shoes} />
    <ellipse cx={230} cy={860} rx={36} ry={14} fill={C.shoes} />
  </g>
);

const SittingLegs = () => (
  <g>
    {/* Thighs foreshortened towards the camera, then shins down. */}
    <rect x={140} y={655} width={58} height={95} rx={22} fill={C.trousers} />
    <rect x={202} y={655} width={58} height={95} rx={22} fill={C.trousers} />
    <rect x={148} y={725} width={46} height={130} rx={14} fill={C.trousers} />
    <rect x={206} y={725} width={46} height={130} rx={14} fill={C.trousers} />
    <ellipse cx={168} cy={860} rx={34} ry={13} fill={C.shoes} />
    <ellipse cx={232} cy={860} rx={34} ry={13} fill={C.shoes} />
  </g>
);

const Torso: React.FC<{ facing: "front" | "back"; chest: number }> = ({
  facing,
  chest,
}) => {
  const s = 1 + chest * 0.006;
  return (
    <g transform={`translate(200 300) scale(${s} ${s}) translate(-200 -300)`}>
      <rect x={182} y={196} width={36} height={70} fill={C.skinShade} />
      {/* Arms */}
      <path
        d="M122 266 Q94 300 96 400 L100 508 L134 508 L136 400 Q138 330 146 292 Z"
        fill={C.cardiganShade}
      />
      <path
        d="M278 266 Q306 300 304 400 L300 508 L266 508 L264 400 Q262 330 254 292 Z"
        fill={C.cardiganShade}
      />
      <circle cx={117} cy={518} r={18} fill={C.skin} />
      <circle cx={283} cy={518} r={18} fill={C.skin} />
      {/* Body */}
      <path
        d="M118 262 Q200 234 282 262 L292 330 L276 545 Q200 560 124 545 L108 330 Z"
        fill={C.cardigan}
      />
      {facing === "front" ? (
        <>
          <path d="M176 250 L224 250 L200 336 Z" fill={C.shirt} />
          <path d="M176 250 L196 262 L186 278 Z" fill="#bdb6a6" />
          <path d="M224 250 L204 262 L214 278 Z" fill="#bdb6a6" />
          <path
            d="M200 336 L200 550"
            stroke={C.cardiganShade}
            strokeWidth={3}
          />
          {[372, 420, 468].map((y) => (
            <circle key={y} cx={208} cy={y} r={4} fill="#1e2128" />
          ))}
        </>
      ) : (
        <path
          d="M200 250 L200 552"
          stroke={C.cardiganShade}
          strokeWidth={2}
          opacity={0.6}
        />
      )}
    </g>
  );
};

const BackOfHead = () => (
  <g>
    <ellipse cx={139} cy={150} rx={10} ry={16} fill={C.skinShade} />
    <ellipse cx={261} cy={150} rx={10} ry={16} fill={C.skinShade} />
    <ellipse cx={200} cy={140} rx={61} ry={75} fill={C.hair} />
    <path d="M168 196 Q200 214 232 196 L228 214 Q200 222 172 214 Z" fill={C.skinShade} />
  </g>
);

const Face: React.FC<{
  expression: Expression;
  look: { x: number; y: number };
  blinking: boolean;
  frame: number;
}> = ({ expression, look, blinking, frame }) => {
  const scared = expression === "fear" || expression === "whisper";
  const eyeRy = blinking ? 0.8 : scared ? 9.5 : expression === "laugh" ? 3 : 7;
  const pupilR = scared ? 2.8 : 4.6;
  // Terrified eyes tremble slightly.
  const tremble = scared ? Math.sin(frame * 2.3) * 0.8 : 0;
  const px = look.x * 4 + tremble;
  const py = look.y * 3;

  const brows: Record<Expression, [string, string]> = {
    neutral: ["M160 119 L190 120", "M210 120 L240 119"],
    smile: ["M160 117 L190 118", "M210 118 L240 117"],
    laugh: ["M160 114 Q175 108 190 114", "M210 114 Q225 108 240 114"],
    worried: ["M160 121 L190 113", "M210 113 L240 121"],
    sad: ["M160 122 L190 114", "M210 114 L240 122"],
    fear: ["M160 114 Q176 104 192 108", "M208 108 Q224 104 240 114"],
    whisper: ["M160 116 L191 107", "M209 107 L240 116"],
  };

  let mouth: React.ReactNode;
  switch (expression) {
    case "laugh":
      mouth = (
        <g>
          <path d="M180 184 Q200 218 220 184 Z" fill="#4a1c1c" />
          <path d="M184 186 L216 186 L213 192 L187 192 Z" fill="#efe9df" />
        </g>
      );
      break;
    case "smile":
      mouth = <path d="M184 188 Q200 200 216 188" stroke="#6b3a30" strokeWidth={4} fill="none" strokeLinecap="round" />;
      break;
    case "sad":
    case "worried":
      mouth = <path d="M186 197 Q200 189 214 197" stroke="#6b3a30" strokeWidth={4} fill="none" strokeLinecap="round" />;
      break;
    case "fear":
      mouth = <ellipse cx={200} cy={195} rx={9} ry={12 + Math.sin(frame * 0.5) * 1.5} fill="#2c1212" />;
      break;
    case "whisper":
      mouth = <ellipse cx={200} cy={194} rx={6} ry={4 + Math.abs(Math.sin(frame * 0.6)) * 3} fill="#2c1212" />;
      break;
    default:
      mouth = <path d="M186 192 Q200 195 214 192" stroke="#6b3a30" strokeWidth={4} fill="none" strokeLinecap="round" />;
  }

  return (
    <g>
      <ellipse cx={139} cy={150} rx={10} ry={16} fill={C.skinShade} />
      <ellipse cx={261} cy={150} rx={10} ry={16} fill={C.skinShade} />
      <ellipse cx={200} cy={140} rx={60} ry={74} fill={C.skin} />
      {/* Stubble along the jaw */}
      <path d="M144 160 Q150 214 200 216 Q250 214 256 160 Q246 196 200 202 Q154 196 144 160 Z" fill="#5a4034" opacity={0.28} />
      <path d="M138 150 Q130 70 200 62 Q272 64 264 150 Q258 108 236 98 Q200 112 160 94 Q144 110 138 150 Z" fill={C.hair} />
      <path d="M158 96 Q176 84 206 88" stroke="#3d2b22" strokeWidth={3} fill="none" />

      {[176, 224].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={145} rx={scared ? 11 : 10} ry={eyeRy} fill="#ece7df" />
          {!blinking ? (
            <circle cx={cx + px} cy={145 + py} r={Math.min(pupilR, eyeRy)} fill="#1b1410" />
          ) : null}
        </g>
      ))}
      {brows[expression].map((d) => (
        <path key={d} d={d} stroke={C.hair} strokeWidth={5} strokeLinecap="round" fill="none" />
      ))}
      <path d="M200 150 Q195 168 203 173" stroke={C.skinShade} strokeWidth={3} fill="none" strokeLinecap="round" />
      {mouth}

      {/* Round glasses: his signature detail */}
      <g stroke={C.glasses} strokeWidth={4} fill="rgba(190,215,255,0.07)">
        <circle cx={176} cy={145} r={21} />
        <circle cx={224} cy={145} r={21} />
      </g>
      <path d="M197 145 Q200 140 203 145" stroke={C.glasses} strokeWidth={4} fill="none" />
      <path d="M155 142 L140 138 M245 142 L260 138" stroke={C.glasses} strokeWidth={3} />
    </g>
  );
};
