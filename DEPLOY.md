# Публикация «Хайку» на GitHub Pages (бесплатно)

Сайт полностью статический — после `vite build` папку `dist/` можно выложить на любой статик-хостинг. Проект подготовлен к работе из подпапки: пути относительные (`base: './'` в `vite.config.js`), шрифт bundled через `src/assets/Sangha.ttf`.

## Вариант 1 — GitHub Pages (рекомендуется)

1. **Создайте публичный репозиторий** на https://github.com/new, например `haiku`.
2. **Отправьте проект** (из папки `C:\RD\Haiku2`):
   ```powershell
   git init
   git add .
   git commit -m "Хайку: редактор хайку 5-7-5"
   git branch -M main
   git remote add origin https://github.com/<ваш-логин>/haiku.git
   git push -u origin main
   ```
   `.gitignore` уже исключает `node_modules` и `dist`.
3. **Включите Pages**: в репозитории → Settings → Pages → Build and deployment → Source: **GitHub Actions**.
4. Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) сработает на этот пуш сам: соберёт проект и опубликует `dist/`.
5. Через 1–2 минуты сайт будет на `https://<ваш-логин>.github.io/haiku/`.

Последующие обновления: `git push` — сайт перестроится и обновится автоматически.

HTTPS на GitHub Pages включён по умолчанию, поэтому копирование через Clipboard API работает без фолбэка.

## Вариант 2 — без Git, одной командой (Surge.sh)

```powershell
npx surge dist
```
При первом запуске спросит e-mail/пароль и предложит адрес (`*.surge.sh`) — можно оставить или вписать свой поддомен. Не требует репозитория.

## Вариант 3 — Cloudflare Pages

1. https://dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets (или подключить Git-репозиторий, build command `npm run build`, output `dist`).
2. Сайт на `*.pages.dev`, безлимитный трафик, доступен из России.

## Локальный предпросмотр собранного сайта

```powershell
node node_modules\vite\bin\vite.js preview
```
→ http://127.0.0.1:5173/
