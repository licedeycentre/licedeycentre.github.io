# 🏷️ Руководство по использованию UI Labels

## Что это такое?

**UI Labels** — это централизованное хранилище всех текстовых меток интерфейса (кнопки, заголовки, сообщения и т.д.) в файле `src/content/ui-labels.json`.

## Зачем это нужно?

### ✅ Для контент-менеджера:

- Все тексты интерфейса в одном файле
- Меняешь текст кнопки в одном месте — меняется везде
- Нет риска сломать код
- Легко искать и редактировать

### ✅ Для разработчика:

- Чистый код без хардкода
- Готовая база для мультиязычности (i18n)
- Типизация через TypeScript
- Переиспользование меток

## Структура файла ui-labels.json

```json
{
  "common": {           // Общие метки
    "readMore": "Подробнее",
    "download": "Скачать",
    ...
  },
  "navigation": {       // Навигация
    "main": "Главная",
    "about": "О нас",
    ...
  },
  "sections": {         // Заголовки секций
    "video": "Видео",
    "documents": "Документы",
    ...
  },
  "buttons": {          // Кнопки
    "buyTickets": "Купить билеты",
    "contact": "Связаться с нами",
    ...
  },
  "footer": {           // Footer
    "addressTitle": "Адрес",
    "phonesTitle": "Телефоны",
    ...
  },
  "performance": {      // Спектакли
    "duration": "Продолжительность",
    "status": { ... },
    ...
  },
  "ariaLabels": {       // Accessibility
    "mainNavigation": "Главная навигация",
    ...
  }
}
```

## Как использовать в компонентах

### 1. Импортировать хук

```tsx
import { useUILabels } from '../hooks/useContent'
```

### 2. Получить labels в компоненте

```tsx
const MyComponent: React.FC = () => {
  const labels = useUILabels()

  return (
    <div>
      <button>{labels.buttons.buyTickets}</button>
      <h2>{labels.sections.documents}</h2>
      <a title={labels.common.preview}>...</a>
    </div>
  )
}
```

## Примеры реальных кейсов

### До рефакторинга (хардкод):

```tsx
// Footer.tsx
<h4 className="footer-block-title">Адрес</h4>
<h4 className="footer-block-title">Телефоны</h4>
<h4 className="footer-block-title">Email</h4>
```

### После рефакторинга (из JSON):

```tsx
// Footer.tsx
import { useUILabels } from '../hooks/useContent'

const Footer: React.FC = () => {
  const labels = useUILabels()

  return (
    <>
      <h4>{labels.footer.addressTitle}</h4>
      <h4>{labels.footer.phonesTitle}</h4>
      <h4>{labels.footer.emailTitle}</h4>
    </>
  )
}
```

## Типичные задачи

### Изменить текст кнопки

**Задача:** Поменять "Купить билеты" на "Приобрести билеты"

**Решение:**

1. Открыть `src/content/ui-labels.json`
2. Найти `"buttons.buyTickets"`
3. Изменить значение
4. Сохранить

✅ Изменение применится везде, где используется эта кнопка!

### Добавить новый label

**Задача:** Добавить текст "Загрузить ещё"

**Решение:**

1. Открыть `src/content/ui-labels.json`
2. Добавить в нужную секцию:

```json
{
  "buttons": {
    ...
    "loadMore": "Загрузить ещё"
  }
}
```

3. Использовать в компоненте: `labels.buttons.loadMore`

### Проверить все доступные labels

**Решение:**

- Открыть `src/content/ui-labels.json`
- Или посмотреть типы в `src/types/content.ts` → `interface UILabels`

## Категории labels

### `common` - Общие действия

Используется: везде где нужны базовые действия

```
readMore, download, preview, close, open, loading, error
```

### `navigation` - Меню навигации

Используется: Header, мобильное меню

```
main, about, services, contacts, publications, performances
```

### `sections` - Заголовки секций

Используется: страницы контента

```
video, documents, gallery, cast, schedule
```

### `buttons` - Кнопки действий

Используется: CTA кнопки, формы

```
buyTickets, contact, showArchivedActors, enroll
```

### `footer` - Footer

Используется: Footer компонент

```
addressTitle, phonesTitle, emailTitle, socialTitle
```

### `performance` - Спектакли

Используется: страницы спектаклей, карточки

```
duration, ageGroup, status.upcoming, notFound
```

### `ariaLabels` - Accessibility

Используется: aria-label атрибуты

```
mainNavigation, socialNetworks, openMenu, closeMenu
```

## Best Practices

### ✅ Хорошо:

- Использовать labels для всего видимого пользователю текста
- Группировать labels логически по секциям
- Давать понятные имена ключам (`buyTickets` лучше чем `btn1`)

### ❌ Плохо:

- Хардкодить текст прямо в компоненте
- Дублировать один и тот же текст в разных местах JSON
- Смешивать контент и UI labels (контент → отдельные JSON файлы)

## Готовность к мультиязычности

Когда потребуется английская версия сайта:

1. Создать `src/content/ui-labels.en.json`
2. Скопировать структуру из `ui-labels.json`
3. Перевести все значения
4. Добавить переключатель языка
5. Готово! 🌍

## Вопросы и ответы

**Q: Нужно ли переносить aria-labels?**  
A: Да, но только те, которые видны скринридерам и могут быть переведены.

**Q: Где хранить тексты страниц (большие блоки)?**  
A: В отдельных JSON файлах (`about.json`, `services.json` и т.д.)

**Q: Что делать с динамическим текстом?**  
A: Использовать шаблоны или интерполяцию:

```tsx
;`${labels.performance.duration}: ${performance.duration}`
```

---

_Обновлено: Октябрь 2024_
