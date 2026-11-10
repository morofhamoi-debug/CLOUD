import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./font";
import { NeonBackground } from "./NeonBackground";
import { ProgressBar } from "./ProgressBar";
import {
  framesPerBlock,
  INTRO_FRAMES,
  OUTRO_FRAMES,
  StoryProps,
} from "./schema";
import { TextBlock } from "./TextBlock";

export const Story: React.FC<StoryProps> = (props) => {
  const { label, blocks, accentColor, secondaryColor } = props;
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const perBlock = framesPerBlock(props, fps);

  const fade = interpolate(
    frame,
    [0, INTRO_FRAMES, durationInFrames - OUTRO_FRAMES, durationInFrames - 1],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const current = Math.min(
    blocks.length,
    Math.max(1, Math.floor((frame - INTRO_FRAMES) / perBlock) + 1),
  );

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <NeonBackground accent={accentColor} secondary={secondaryColor} />

      {label ? (
        <div
          style={{
            position: "absolute",
            top: 220,
            width: "100%",
            textAlign: "center",
            fontFamily,
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: 14,
            color: accentColor,
            textShadow: `0 0 18px ${accentColor}`,
          }}
        >
          {label}
        </div>
      ) : null}

      {blocks.map((text, i) => (
        <Sequence
          key={i}
          from={INTRO_FRAMES + i * perBlock}
          durationInFrames={perBlock}
          name={`Блок ${i + 1}`}
        >
          <TextBlock text={text} accent={accentColor} />
        </Sequence>
      ))}

      <ProgressBar
        accent={accentColor}
        secondary={secondaryColor}
        current={current}
        total={blocks.length}
      />
    </AbsoluteFill>
  );
};
