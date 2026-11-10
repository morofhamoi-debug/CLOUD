# Remotion video

Проект на [Remotion](https://www.remotion.dev) 4 (React 19, TypeScript), созданный через `npx create-video@latest --blank`.

## Структура

```
src/
  index.ts              # registerRoot — точка входа
  Root.tsx              # регистрация композиций и их defaultProps
  HelloWorld/
    index.tsx           # демо-композиция: сцена, тайминги, fade-out
    Background.tsx      # анимированный градиент + плавающие блики
    Title.tsx           # заголовок: слова появляются по очереди через spring()
    Subtitle.tsx        # полоса-акцент и подзаголовок
public/                 # статические файлы (staticFile())
remotion.config.ts      # настройки CLI
```

Новую композицию добавляйте папкой в `src/` и регистрируйте через `<Composition>` в `src/Root.tsx`.

## Команды

| Команда           | Что делает                                      |
| ----------------- | ----------------------------------------------- |
| `npm i`           | установка зависимостей                          |
| `npm run dev`     | Remotion Studio (превью, правка props) на :3000 |
| `npm run render`  | рендер `HelloWorld` в `out/hello-world.mp4`     |
| `npm run still`   | один кадр (75) в `out/hello-world.png`          |
| `npm run lint`    | ESLint + проверка типов                         |
| `npm run upgrade` | обновление пакетов Remotion                     |

Произвольный рендер: `npx remotion render <CompositionId> out/video.mp4 --props='{"title":"Привет"}'`.

## Лицензия

Для некоторых компаний нужна коммерческая лицензия Remotion: [условия](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
