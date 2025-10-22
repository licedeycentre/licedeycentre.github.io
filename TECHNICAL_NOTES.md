# Технические заметки

## Команды NPM

### Разработка

```bash
# Установка зависимостей
npm install

# Запуск локального сервера разработки
npm run dev
# Откроется на http://localhost:5175/

# Проверка кода (рекомендуется перед коммитом)
npm run check
# Проверяет типы + линтер + форматтер + тесты

# Автоисправление кода
npm run fix
# Исправляет ESLint + форматирует Prettier

# Сборка проекта для продакшена
npm run build

# Предварительный просмотр собранного проекта
npm run preview
```

### Качество кода

```bash
# Полная подготовка кода
npm run prepare

# Проверка качества кода
npm run lint

# Автоматическое исправление ошибок ESLint
npm run lint:fix

# Форматирование кода Prettier
npm run format

# Проверка форматирования
npm run format:check
```

### Тестирование

```bash
# Запуск тестов в watch режиме
npm run test

# UI интерфейс для тестов
npm run test:ui

# Однократный запуск тестов
npm run test:run

# Тесты с отчетом покрытия
npm run test:coverage
```

## Покрытие тестами

### Полностью покрытые компоненты и утилиты:

- ✅ `src/utils/slugify.ts` - 89.52% покрытие
- ✅ `src/utils/dateFormat.ts` - 96.15% покрытие
- ✅ `src/utils/scrollLock.ts` - 100% покрытие
- ✅ `src/components/ScrollToTop.tsx` - 100% покрытие
- ✅ `src/components/CookieBanner.tsx` - 100% покрытие
- ✅ `src/components/Footer.tsx` - 92.59% покрытие

### Примеры тестов

#### Тест утилиты:

```typescript
import { describe, it, expect } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it('creates slug from cyrillic text', () => {
    expect(slugify('Спектакль Тест')).toBe('spektakl-test')
  })
})
```

#### Тест компонента:

```typescript
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Footer from '../components/Footer'

describe('Footer', () => {
  it('renders footer with copyright', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(screen.getByText(/Лицедей/i)).toBeInTheDocument()
  })
})
```

### Публикация

```bash
# Сборка проекта (для GitHub Actions)
npm run build
```

## Рекомендуемый Workflow

### Для редактирования контента

```bash
# 1. Редактируете JSON файлы в src/content/
# 2. Деплоите одной командой
npm run deploy

# Или пошагово:
# 3. Подготавливаете код
npm run prepare

# 4. Проверяете результат локально
npm run dev

# 5. Коммитите изменения
git add .
git commit -m "Update content"
git push origin main
```

### Для разработки

```bash
# 1. Разрабатываете код
npm run dev

# 2. Подготавливаете код перед коммитом
npm run prepare

# 3. Проверяете сборку
npm run build
npm run preview

# 4. Коммитите
git add .
git commit -m "Feature: add new component"
git push origin main
```

## Команды Git

### Основные команды

```bash
# Посмотреть статус файлов
git status

# Добавить все изменения
git add .

# Добавить конкретный файл
git add src/content/performances.json

# Создать коммит
git commit -m "Update content"

# Отправить изменения в репозиторий
git push origin main
```

### Типичные коммиты

```bash
git commit -m "Update performances"
git commit -m "Add new publication"
git commit -m "Update hero slides"
git commit -m "Fix image paths"
```

## Структура JSON файлов

### Основные правила

- Все строки в двойных кавычках: `"текст"`
- Объекты в фигурных скобках: `{ "ключ": "значение" }`
- Массивы в квадратных скобках: `["элемент1", "элемент2"]`
- Запятые между элементами (кроме последнего)
- Никаких комментариев в JSON

### Пример правильного JSON

```json
{
  "title": "Название спектакля",
  "duration": "45 минут",
  "gallery": ["/images/photo1.jpg", "/images/photo2.jpg"]
}
```

### Пример неправильного JSON

```json
{
  "title": "Название спектакля", // ❌ Комментарий недопустим
  "duration": "45 минут"         // ❌ Лишняя запятая
  "gallery": [                   // ❌ Отсутствует запятая
    "/images/photo1.jpg"
    "/images/photo2.jpg"         // ❌ Отсутствует запятая
  ]
}
```

## Публикация на GitHub Pages

### Процесс деплоя

1. **Внесите изменения** в JSON файлы
2. **Проверьте локально**: `npm run dev`
3. **Сохраните изменения в Git**:
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```
4. **GitHub Actions автоматически опубликует изменения**

### Что происходит при деплое через GitHub Actions

- GitHub Actions запускается при push в main ветку
- Проект собирается командой `npm run build` (включая генерацию sitemap)
- Собранные файлы из папки `dist/` публикуются на GitHub Pages
- Сайт становится доступен по адресу: https://licedeycentre.github.io

## Решение проблем

### Ошибка "Module not found"

```bash
# Переустановите зависимости
rm -rf node_modules
npm install
```

### Ошибка "Port already in use"

```bash
# Остановите процесс на порту 5175
npx kill-port 5175
# Или запустите на другом порту
npm run dev -- --port 3000
```

### Ошибка сборки

```bash
# Очистите кэш
npm run build -- --force
# Или удалите папку dist и пересоберите
rm -rf dist
npm run build
```

### Git ошибки

**"Your branch is ahead of origin"**

```bash
git push origin main
```

**"Please commit your changes"**

```bash
git add .
git commit -m "Save changes"
```

**"Merge conflict"**

```bash
# Откройте файл с конфликтом и разрешите вручную
# Затем:
git add .
git commit -m "Resolve merge conflict"
```

### Проблемы с изображениями

**Изображение не загружается:**

1. Проверьте путь в JSON файле
2. Убедитесь, что файл существует в `public/images/`
3. Проверьте права доступа к файлу

**Медленная загрузка:**

1. Оптимизируйте размер изображения (до 2MB)
2. Используйте формат JPG для фотографий
3. Проверьте разрешение (рекомендуется 1200x800px)

## Полезные инструменты

### Валидация JSON

- [jsonlint.com](https://jsonlint.com) - онлайн валидатор
- Встроенный валидатор в VS Code

### Редакторы изображений

- **GIMP** - бесплатный аналог Photoshop
- **Paint.NET** - простой редактор для Windows
- **Canva** - онлайн редактор

### Терминал

- **Windows**: PowerShell или Command Prompt
- **macOS**: Terminal
- **Linux**: Terminal

---

_Последнее обновление: Январь 2025_
