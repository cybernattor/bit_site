# bit Tecnologies

Официальный сайт технологической компании bit Tecnologies. Создан с использованием Astro и Tailwind CSS для максимальной производительности.

## О проекте

- **Framework**: Astro (Static mode)
- **Styling**: Tailwind CSS
- **Target**: Развертывание на Cloudflare Pages
- **Theme**: Dark theme по умолчанию
- **Оптимизация**: Минимальные анимации, быстрая загрузка

## Структура проекта

```
src/
├── layouts/
│   └── Layout.astro          # Основной шаблон с Header/Footer
├── pages/
│   └── index.astro           # Главная страница
├── components/               # Переиспользуемые компоненты
├── styles/                   # Глобальные стили
└── assets/                   # Изображения и ресурсы
```

## Разработка

### Требования

- Node.js 18+
- npm или yarn

### Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Продакшн сборка с оптимизациями
npm run build:prod

# Предпросмотр сборки
npm run preview

# Анализ бандла
npm run build:analyze

# Очистка кэша
npm run clean

# Проверка типов
npm run type-check

# Линтинг
npm run lint
npm run lint:fix
```

### Настройка

1. **GitHub Releases для скачивания APK**:

   Замените `https://github.com/USER/REPO/releases/latest/download/app.apk` на ваш реальный URL в файлах:
   - `src/pages/index.astro` (2 места)

2. **OpenGraph изображение**:

   Замените `public/og-bit-hub.svg` на реальное изображение 1200x630px

3. **SEO мета-данные**:

   Отредактируйте title и description в `src/pages/index.astro`

## Развертывание

### Cloudflare Pages

#### Автоматическое развертывание

1. Подключите репозиторий к Cloudflare Pages
2. Настройте переменные окружения в Cloudflare Dashboard:
   - `SITE_URL=https://bit-site-aye.pages.dev`
   - `SITE_NAME=bit Technologies`
   - `ENABLE_ANALYTICS=false`
   - `ENABLE_SITEMAP=true`

3. Настройте билд:
   - **Build command**: `npm run build:prod`
   - **Build output directory**: `dist`

#### Ручное развертывание

```bash
# Сборка проекта
npm run build:prod

# Развертывание через Wrangler
npx wrangler pages deploy dist
```

### Другие платформы

Сайт можно развернуть на любой статической платформе:
- Vercel
- Netlify
- GitHub Pages
- Surge.sh

## Оптимизация

- Используются системные шрифты для скорости
- Минимальные CSS без лишних зависимостей
- SVG иконки вместо шрифтовых иконок
- Lazy loading для изображений через Astro Image
- Оптимизированный Tailwind конфиг

### Продакшн оптимизации

- Минификация JavaScript с Terser
- Удаление console.log в продакшене
- Оптимизация изображений
- Кеширование статических ресурсов
- Разделение кода на чанки (vendor, router, ui)
- Сжатие и оптимизация бандла

## Адаптивность

- Mobile-first подход
- Тестирование на устройствах от 320px шириной
- Оптимизация для бюджетных устройств

## Лицензия

© 2026 bit Tecnologies. Все права защищены.

Этот проект распространяется под [MIT License](LICENSE).