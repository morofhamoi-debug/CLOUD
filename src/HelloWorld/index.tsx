import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "./Background";
import { Subtitle } from "./Subtitle";
import { Title } from "./Title";

export type HelloWorldProps = {
  title: string;
  subtitle: string;
  textColor: string;
  gradientFrom: string;
  gradientTo: string;
};

export const HelloWorld: React.FC<HelloWorldProps> = ({
  title,
  subtitle,
  textColor,
  gradientFrom,
  gradientTo,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <Background from={gradientFrom} to={gradientTo} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          opacity: fadeOut,
        }}
      >
        <Title text={title} color={textColor} />
        <Sequence from={25} layout="none">
          <Subtitle text={subtitle} color={textColor} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
