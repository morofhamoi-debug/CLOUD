import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";

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
  const { fps } = useVideoConfig();

  // Распределение блоков по времени (примерно по 1.5 секунды на блок)
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
        backgroundColor: "#050508", // Глубокий темный фон
        fontFamily: "Montserrat, sans-serif",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px",
      }}
    >
      {/* Неоновый легкий акцент в фоне */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,0,255,0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Текст блока */}
      <div
        style={{
          color: isLastBlock ? "#ff3333" : "#ffffff", // Красный акцент на финальной фразе
          fontSize: "64px",
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.3,
          zIndex: 10,
          textShadow: isLastBlock ? "0 0 20px rgba(255,0,0,0.6)" : "0 0 10px rgba(255,255,255,0.2)",
        }}
      >
        {currentText}
      </div>

      {/* Прогресс-бар внизу */}
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          left: "100px",
          right: "100px",
          height: "6px",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(frame / (blocks.length * framesPerBlock)) * 100}%`,
            height: "100%",
            backgroundColor: "#a855f7",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
