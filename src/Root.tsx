import { Composition } from "remotion";
import { Story } from "./Story";
import { calculateStoryMetadata, StoryProps } from "./Story/schema";

// Edit the script here (or live in Remotion Studio → Props).
const defaultProps: StoryProps = {
  label: "ИСТОРИЯ",
  blocks: [
    "26 сентября 1983 года. Секретный командный пункт «Серпухов-15».",
    "Посреди ночи система предупреждения выдаёт сигнал: из США запущена ракета.",
    "Потом ещё одна. И ещё. Всего — пять.",
    "Дежурный — подполковник Станислав Петров. На решение у него считаные минуты.",
    "Он рассуждает: настоящий удар начался бы с сотен ракет, а не с пяти.",
    "Петров докладывает наверх: «Ложная тревога».",
    "Позже выяснится: спутники приняли солнечные блики на облаках за пуски ракет.",
    "Одно спокойное решение, которое, возможно, спасло мир.",
  ],
  secondsPerBlock: 3.5,
  accentColor: "#22d3ee",
  secondaryColor: "#d946ef",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Story"
        component={Story}
        // Overridden by calculateMetadata from the number of blocks.
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={calculateStoryMetadata}
      />
    </>
  );
};
