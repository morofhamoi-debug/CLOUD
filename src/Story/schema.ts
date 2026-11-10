import { CalculateMetadataFunction } from "remotion";

export type StoryProps = {
  /** Small label above the text, e.g. "ИСТОРИЯ". Empty string hides it. */
  label: string;
  /** Script: each entry is one on-screen text block. */
  blocks: string[];
  /** How long each block stays on screen. */
  secondsPerBlock: number;
  accentColor: string;
  secondaryColor: string;
};

export const INTRO_FRAMES = 15;
export const OUTRO_FRAMES = 30;

export const framesPerBlock = (props: StoryProps, fps: number) =>
  Math.round(props.secondsPerBlock * fps);

// Video length follows the script, so adding blocks never cuts the ending.
export const calculateStoryMetadata: CalculateMetadataFunction<StoryProps> = ({
  props,
}) => {
  const fps = 30;
  return {
    fps,
    durationInFrames:
      INTRO_FRAMES +
      Math.max(1, props.blocks.length) * framesPerBlock(props, fps) +
      OUTRO_FRAMES,
  };
};
