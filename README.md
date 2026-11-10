# Remotion video

Проект на [Remotion](https://www.remotion.dev) 4 (React 19, TypeScript), созданный через `npx create-video@latest --blank`.

## Структура

```
src/
  index.ts              # registerRoot — точка входа
  Root.tsx              # композиция Story (1080×1920, 30 fps) и текст сценария
  Story/
    index.tsx           # сцена: фон, блоки текста по таймингу, прогресс-бар
    schema.ts           # тип пропсов и расчёт длительности по числу блоков
    NeonBackground.tsx  # тёмный фон с неоновыми бликами и сеткой
    TextBlock.tsx       # появление/исчезновение блока текста (spring + blur)
    ProgressBar.tsx     # индикатор времени и номер блока внизу
    font.ts             # Montserrat (кириллица) из @remotion/google-fonts
public/                 # статические файлы (staticFile())
remotion.config.ts      # настройки CLI
```

## Как менять сценарий

Текст лежит в `defaultProps` в `src/Root.tsx`:

- `blocks` — массив строк, каждая строка — отдельный экран;
- `secondsPerBlock` — сколько секунд показывается каждый блок;
- `label` — подпись сверху (пустая строка скрывает её);
- `accentColor` / `secondaryColor` — неоновые цвета.

Длительность видео пересчитывается автоматически: 0,5 с интро + блоки × `secondsPerBlock` + 1 с затухания. Пропсы можно править и прямо в Studio (панель Props).

Новую композицию добавляйте папкой в `src/` и регистрируйте через `<Composition>` в `src/Root.tsx`.

## Команды

| Команда           | Что делает                                      |
| ----------------- | ----------------------------------------------- |
| `npm i`           | установка зависимостей                          |
| `npm run dev`     | Remotion Studio (превью, правка props) на :3000 |
| `npm run render`  | рендер `Story` в `out/story.mp4`                |
| `npm run still`   | один кадр (70) в `out/story.png`                |
| `npm run lint`    | ESLint + проверка типов                         |
| `npm run upgrade` | обновление пакетов Remotion                     |

Произвольный рендер: `npx remotion render Story out/video.mp4 --props='{"blocks":["Первый экран","Второй экран"]}'`.

## Лицензия

Для некоторых компаний нужна коммерческая лицензия Remotion: [условия](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
