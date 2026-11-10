import { Composition } from "remotion";
import { HelloWorld, HelloWorldProps } from "./HelloWorld";

const defaultProps: HelloWorldProps = {
  title: "Hello, Remotion!",
  subtitle: "Видео, написанное на React",
  textColor: "#ffffff",
  gradientFrom: "#6d28d9",
  gradientTo: "#db2777",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
    </>
  );
};
