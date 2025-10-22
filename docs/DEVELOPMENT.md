# Техническая документация для разработчиков

## Архитектура проекта

Проект представляет собой одностраничное приложение (SPA) на React с TypeScript, использующее Vite как сборщик и GitHub Pages для хостинга.

### Основные принципы

- **Контент через JSON** - все данные хранятся в `src/content/` в виде JSON файлов
- **Компонентная архитектура** - переиспользуемые React компоненты
- **TypeScript** - типизация для безопасности и удобства разработки
- **Маршрутизация** - React Router для навигации между страницами

## Структура проекта

```
src/
├── components/          # React компоненты
│   ├── Header.tsx      # Шапка сайта с навигацией
│   ├── Footer.tsx      # Подвал сайта
│   ├── PageLayout.tsx  # Общий макет страниц
│   ├── Modal.tsx       # Модальные окна
│   ├── Slider.tsx      # Слайдер изображений
│   ├── VideoPlayer.tsx # Видеоплеер
│   └── ...
├── pages/              # Страницы приложения
│   ├── HomePage.tsx    # Главная страница
│   ├── PerformancesPage.tsx # Страница спектаклей
│   ├── PerformancePage.tsx   # Страница отдельного спектакля
│   ├── PublicationsPage.tsx  # Страница публикаций
│   ├── AboutPage.tsx        # Страница "О театре"
│   └── ...
├── content/            # JSON файлы с контентом
│   ├── performances.json
│   ├── publications.json
│   ├── about.json
│   ├── services.json
│   ├── contacts.json
│   ├── hero.json
│   ├── media.json
│   ├── seo.json
│   ├── site.json
│   ├── ui-labels.json
│   └── privacy-policy.json
├── hooks/              # React хуки
│   └── useContent.ts   # Хук для загрузки контента
├── utils/              # Утилиты
│   ├── htmlProcessor.tsx # Обработка HTML контента
│   ├── slugify.ts      # Создание URL-слаг
│   ├── dateFormat.ts   # Форматирование дат
│   └── ...
├── types/              # TypeScript типы
│   └── content.ts      # Типы для контента
├── styles.css          # Глобальные стили
├── App.tsx             # Главный компонент приложения
└── main.tsx            # Точка входа

public/
├── images/             # Статические изображения
├── documents/          # Документы (PDF, DOC и др.)
├── videos/             # Видео файлы
├── favicon.svg         # Иконка сайта
└── ...
```

## Компоненты

### Основные компоненты

**PageLayout.tsx** - Общий макет страниц

- Оборачивает все страницы
- Включает Header и Footer
- Обрабатывает SEO метаданные
- Управляет переходами между страницами

**Header.tsx** - Навигация

- Главное меню сайта
- Мобильная навигация
- Логотип и социальные сети

**Footer.tsx** - Подвал

- Контактная информация
- Копирайт и ссылки
- Социальные сети

**Modal.tsx** - Модальные окна

- Галерея изображений
- Видеоплеер
- Дополнительная информация

### Специализированные компоненты

**PerformanceCard.tsx** - Карточка спектакля

- Отображение информации о спектакле
- Кнопка "Приобрести билеты"
- Галерея изображений

**PublicationCard.tsx** - Карточка публикации

- Заголовок и дата
- Изображение и теги
- Ссылка на полную статью

**VideoPlayer.tsx** - Видеоплеер

- Встроенный YouTube плеер
- Обработка различных форматов ссылок
- Адаптивный дизайн

## TypeScript типы

### Основные типы (`src/types/content.ts`)

```typescript
// Спектакль
export interface Performance {
  id?: number
  title: string
  duration: string
  ageGroup: string
  description: string
  detailedDescription?: string
  cast: string
  creators: string
  image: string
  gallery?: string[]
  slider?: string[]
  video?: {
    url: string
    title: string
    description: string
  }
  status: 'current' | 'planned' | 'archive'
  showTicketsButton?: boolean
  showDates?: Array<{
    date: string
    time: string
  }>
  ticketsUrl?: string
}

// Публикация
export interface Publication {
  id: number
  title: string
  date: string
  image: string
  tags: string[]
  html: string
  gallery?: string[]
}

// Hero слайд
export interface HeroSlide {
  title: string
  description: string
  backgroundImage: string
  buttons: Array<{
    text: string
    url: string
    primary: boolean
  }>
}
```

## Роутинг (React Router)

### Структура маршрутов

```typescript
// App.tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/performances" element={<PerformancesPage />} />
  <Route path="/performance/:id" element={<PerformancePage />} />
  <Route path="/publications" element={<PublicationsPage />} />
  <Route path="/publication/:id" element={<PublicationPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/contacts" element={<ContactsPage />} />
  <Route path="/services" element={<ServicesPage />} />
  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### Динамические маршруты

- `/performance/:id` - страница спектакля по ID
- `/publication/:id` - страница публикации по ID
- `/services/:slug` - подразделы услуг

## Хуки

### useContent.ts

Основной хук для загрузки контента:

```typescript
export const useContent = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Загрузка всех JSON файлов
    Promise.all([
      import('../content/performances.json'),
      import('../content/publications.json'),
      // ... другие файлы
    ]).then(([performances, publications, ...]) => {
      setContent({
        performances: performances.default,
        publications: publications.default,
        // ...
      });
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  return { content, loading, error };
};
```

## Утилиты

### htmlProcessor.tsx

Обработка HTML контента из JSON:

```typescript
export const processHtml = (html: string): React.ReactNode => {
  // Парсинг HTML и создание React элементов
  // Обработка ссылок, изображений, списков
}
```

### slugify.ts

Создание URL-слаг из заголовков:

```typescript
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

### dateFormat.ts

Форматирование дат:

```typescript
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
```

## Сборка и деплой

### Vite конфигурация

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: '/LCDY_REACT/', // Для GitHub Pages
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
})
```

### GitHub Pages деплой

```json
// package.json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

### Процесс деплоя

1. `npm run build` - сборка проекта
2. `gh-pages -d dist` - публикация в ветку `gh-pages`
3. GitHub Pages автоматически обновляет сайт

## Добавление новых фич

### Новый тип контента

1. **Создать JSON файл** в `src/content/`
2. **Добавить TypeScript тип** в `src/types/content.ts`
3. **Обновить хук** `useContent.ts`
4. **Создать компонент** для отображения
5. **Добавить страницу** в роутинг
6. **Обновить навигацию** в Header

### Новый компонент

1. **Создать файл** в `src/components/`
2. **Добавить TypeScript типы** для пропсов
3. **Создать стили** (CSS модули или глобальные)
4. **Экспортировать** из компонента
5. **Импортировать** в нужных местах

### Новая страница

1. **Создать файл** в `src/pages/`
2. **Добавить маршрут** в `App.tsx`
3. **Создать контент** в JSON файле
4. **Добавить в навигацию** (если нужно)
5. **Обновить SEO** метаданные

## Производительность

### Оптимизации

- **Lazy loading** для изображений
- **Code splitting** для страниц
- **Минификация** CSS и JS
- **Сжатие** изображений
- **Кэширование** статических ресурсов

### Мониторинг

- **Lighthouse** для проверки производительности
- **Bundle analyzer** для анализа размера бандла
- **Core Web Vitals** для метрик пользовательского опыта

## Безопасность

### Меры безопасности

- **Валидация** JSON данных
- **Санитизация** HTML контента
- **HTTPS** для всех внешних ссылок
- **CSP** заголовки (если возможно)

### Обработка ошибок

- **Try-catch** блоки для загрузки контента
- **Fallback** компоненты для ошибок
- **Логирование** ошибок в консоль

---

_Последнее обновление: Январь 2025_
