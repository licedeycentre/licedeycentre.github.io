# 📝 План улучшения работы с контентом

## Проблема

Сейчас в проекте есть **хардкодные тексты** прямо в компонентах и страницах. Это создает проблемы:

1. ❌ Чтобы поменять текст кнопки, надо лезть в код
2. ❌ Сложно найти все места с текстом
3. ❌ Риск сломать код при редактировании контента
4. ❌ Нет единого места для управления UI-текстами

## Что нужно вынести в JSON

### 1. **Навигация** (`navigation.json`)

**Где сейчас:** `src/components/Header.tsx` (строки 545-556, 668-686)

```json
{
  "main": [
    { "label": "Главная", "path": "/" },
    { "label": "Контакты", "path": "/contacts" },
    { "label": "Публикации", "path": "/publications" },
    { "label": "Спектакли", "path": "/performances" }
  ],
  "about": {
    "label": "О нас",
    "path": "/about",
    "submenu": [
      { "label": "О центре", "path": "/about" },
      { "label": "Студия 'Балаганчик'", "path": "/about/studio" },
      { "label": "Студия 'Без границ'", "path": "/about/inclusive-studio" },
      { "label": "Летний лагерь", "path": "/about/summer-camp" }
    ]
  },
  "services": {
    "label": "Услуги",
    "path": "/services",
    "submenu": [
      { "label": "Все услуги", "path": "/services" },
      { "label": "Выступления на заказ", "path": "/services/performances" },
      { "label": "Аренда зала", "path": "/services/hall-rental" },
      { "label": "Аренда оборудования", "path": "/services/equipment-rental" }
    ]
  }
}
```

### 2. **UI Labels** (`ui-labels.json`)

**Где сейчас:** Разбросано по всем страницам и компонентам

```json
{
  "common": {
    "readMore": "Подробнее",
    "download": "Скачать",
    "preview": "Предпросмотр",
    "close": "Закрыть",
    "open": "Открыть",
    "showAll": "Показать всех",
    "hideAll": "Скрыть",
    "loading": "Загрузка...",
    "error": "Ошибка"
  },
  "sections": {
    "video": "Видео",
    "documents": "Документы",
    "gallery": "Галерея",
    "description": "Подробное описание",
    "cast": "Действующие лица",
    "schedule": "Расписание показов"
  },
  "buttons": {
    "buyTickets": "Купить билеты",
    "getTickets": "Приобрести билеты",
    "contact": "Связаться с нами",
    "showArchivedActors": "Показать всех актёров",
    "hideArchivedActors": "Скрыть архивных актёров"
  },
  "footer": {
    "addressTitle": "Адрес",
    "phonesTitle": "Телефоны",
    "emailTitle": "Email",
    "socialTitle": "Социальные сети",
    "navigation": "Навигация",
    "quickLinks": "Быстрые ссылки",
    "privacyPolicy": "Политика конфиденциальности"
  },
  "performance": {
    "duration": "Продолжительность",
    "ageGroup": "Возраст",
    "status": {
      "upcoming": "Скоро",
      "planned": "Планируется",
      "finished": "Завершён",
      "development": "В разработке",
      "archived": "Архив"
    }
  },
  "ariaLabels": {
    "mainNavigation": "Главная навигация",
    "socialNetworks": "Социальные сети",
    "openMenu": "Открыть меню",
    "closeMenu": "Закрыть меню",
    "toHome": "на главную"
  }
}
```

### 3. **Breadcrumbs** (`breadcrumbs.json`)

**Где сейчас:** Хардкод в каждой странице

```json
{
  "/": { "label": "Главная" },
  "/about": { "label": "О нас", "parent": "/" },
  "/about/studio": { "label": "Студия 'Балаганчик'", "parent": "/about" },
  "/services": { "label": "Услуги", "parent": "/" },
  "/contacts": { "label": "Контакты", "parent": "/" },
  "/performances": { "label": "Спектакли", "parent": "/" },
  "/publications": { "label": "Публикации", "parent": "/" }
}
```

### 4. **SEO Meta Templates** (расширить `seo.json`)

Добавить шаблоны для динамических страниц:

```json
{
  "templates": {
    "performance": {
      "titleTemplate": "{performanceTitle} — Лицедей",
      "descriptionTemplate": "{performanceDescription}. Продолжительность: {duration}. {ageGroup}.",
      "keywordsTemplate": "спектакль, {performanceTitle}, театр, Владивосток, Лицедей"
    },
    "publication": {
      "titleTemplate": "{publicationTitle} — Лицедей",
      "descriptionTemplate": "{publicationPreview}",
      "keywordsTemplate": "публикация, {tags}, театр, Лицедей"
    }
  }
}
```

## Преимущества после рефакторинга

### ✅ Для контент-менеджера:

1. **Один файл для всех кнопок** - изменил текст в одном месте, изменилось везде
2. **Нет риска сломать код** - редактируешь только JSON
3. **Быстрый поиск** - все тексты в одном месте
4. **Легко перевести сайт** - просто создай `ui-labels.en.json`

### ✅ Для разработчика:

1. **Чистый код** - компоненты не захламлены текстами
2. **Переиспользование** - один label используется везде
3. **Типизация** - TypeScript проверит все ключи
4. **Легко добавить i18n** - основа уже готова

## Что НЕ нужно выносить

Оставить в коде (это часть логики, а не контента):

- ❌ Технические aria-labels для accessibility (часть кода)
- ❌ Классы CSS
- ❌ Логика условий и проверок
- ❌ Форматирование дат (это утилита)
- ❌ Валидация форм

## Приоритеты внедрения

### Фаза 1: Критичное (быстро меняется)

1. ✅ `ui-labels.json` - кнопки, заголовки секций
2. ✅ Обновить `site.json` - footer labels

### Фаза 2: Важное (для UX)

3. ✅ `navigation.json` - меню
4. ✅ `breadcrumbs.json` - навигация

### Фаза 3: Улучшения (для масштабирования)

5. 🔄 SEO templates
6. 🔄 Подготовка к i18n (мультиязычность)

## Примеры использования

### До:

```tsx
<button>Купить билеты</button>
<h2>Документы</h2>
<a title="Предпросмотр">...</a>
```

### После:

```tsx
import { useUILabels } from '../hooks/useContent'

const labels = useUILabels()

<button>{labels.buttons.buyTickets}</button>
<h2>{labels.sections.documents}</h2>
<a title={labels.common.preview}>...</a>
```

## Вывод

Это не переусложнение, а **правильная архитектура** для проекта, где контент часто меняется!

Вы сможете:

- 📝 Редактировать ВСЕ тексты в одном месте
- 🌍 Легко добавить английскую версию сайта
- 🎨 Менять формулировки без риска сломать код
- ⚡ Быстро находить и обновлять любой текст
