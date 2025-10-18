# Технические заметки

## Команды NPM

### Разработка
```bash
# Установка зависимостей
npm install

# Запуск локального сервера разработки
npm run dev
# Откроется на http://localhost:5175/

# Сборка проекта для продакшена
npm run build

# Предварительный просмотр собранного проекта
npm run preview
```

### Публикация
```bash
# Сборка и деплой на GitHub Pages
npm run deploy
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
  "gallery": [
    "/images/photo1.jpg",
    "/images/photo2.jpg"
  ]
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
4. **Опубликуйте на сайте**:
   ```bash
   npm run deploy
   ```

### Что происходит при деплое
- Проект собирается командой `npm run build`
- Собранные файлы копируются в папку `dist/`
- Содержимое `dist/` публикуется на GitHub Pages
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

*Последнее обновление: Январь 2025*
