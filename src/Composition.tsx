import { AbsoluteFill, useCurrentFrame } from "remotion";

const blocks = [
  "Павел открыл конверт и замер.",
  "Внутри лежала официальная справка.",
  "Дата смерти была указана строго.",
  "Сегодня. Ровно в полночь.",
  "Сначала он громко рассмеялся.",
  "Это казалось злой шуткой.",
  "Но на часах уже тикали минуты.",
  "Он выбежал на пустую улицу.",
  "Фонари мигали тусклым светом.",
  "Каждый прохожий казался угрозой.",
  "Время ускоряло свой бег.",
  "Остался всего один час.",
  "Павел бросился к старому дому.",
  "Дверь поддалась без усилий.",
  "Внутри царила абсолютная тишина.",
  "На столе лежал такой же конверт.",
  "Он медленно протянул к нему руку.",
  "Стрелки часов сошлись на двенадцати.",
  "И в этот момент…"
];

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const framesPerBlock = 45;
  const currentIndex = Math.min(
    Math.floor(frame / framesPerBlock),
    blocks.length - 1
  );
  
  const currentText = blocks[currentIndex];
  const isLastBlock = currentIndex === blocks.length - 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050508",
        fontFamily: "sans-serif",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px",
      }}
    >
      <div
        style={{
          color: isLastBlock ? "#ff3333" : "#ffffff",
          fontSize: "64px",
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {currentText}
      </div>
    </AbsoluteFill>
  );
};
