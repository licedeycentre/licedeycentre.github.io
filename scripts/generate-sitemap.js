#!/usr/bin/env node

/**
 * Скрипт для автоматической генерации sitemap.xml
 * Читает контент из JSON файлов и создает корректную карту сайта
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Таблица транслитерации кириллицы в латиницу
const transliterationMap = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  
  // Заглавные буквы
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
  'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
};

/**
 * Транслитерирует кириллический текст в латиницу
 */
function transliterate(text) {
  return text
    .split('')
    .map(char => transliterationMap[char] || char)
    .join('');
}

/**
 * Создает slug из текста
 */
function slugify(text) {
  return transliterate(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Удаляем все кроме букв, цифр, пробелов и дефисов
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Убираем множественные дефисы
    .replace(/^-|-$/g, ''); // Убираем дефисы в начале и конце
}

/**
 * Генерирует ID для публикации на основе даты и заголовка
 */
function generatePublicationId(title, date) {
  const titleSlug = slugify(title);
  
  if (date) {
    // Форматируем дату в YYYY-MM-DD
    const formattedDate = date.includes('-') ? date.split('T')[0] : date;
    return `${formattedDate}-${titleSlug}`;
  }
  
  return titleSlug;
}

/**
 * Генерирует ID для спектакля на основе заголовка
 */
function generatePerformanceId(title) {
  return slugify(title);
}

/**
 * Форматирует дату для XML
 */
function formatDateForXML(dateString) {
  if (!dateString) return new Date().toISOString().split('T')[0];
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Читает JSON файл
 */
function readJSONFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Ошибка чтения файла ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Генерирует XML для URL
 */
function generateURLXML(loc, lastmod, changefreq, priority, images = [], videos = []) {
  let xml = `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;

  // Добавляем изображения
  images.forEach(imageUrl => {
    xml += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
    </image:image>`;
  });

  // Добавляем видео
  videos.forEach(video => {
    xml += `
    <video:video>
      <video:content_loc>${video.url}</video:content_loc>
      <video:title>${video.title}</video:title>
      <video:description>${video.description}</video:description>
    </video:video>`;
  });

  xml += `
  </url>`;
  
  return xml;
}

/**
 * Основная функция генерации sitemap
 */
function generateSitemap() {
  const baseUrl = 'https://licedeycentre.github.io';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Читаем контентные файлы
  const performancesData = readJSONFile(path.join(__dirname, '../src/content/performances.json'));
  const publicationsData = readJSONFile(path.join(__dirname, '../src/content/publications.json'));
  const aboutData = readJSONFile(path.join(__dirname, '../src/content/about.json'));
  const servicesData = readJSONFile(path.join(__dirname, '../src/content/services.json'));

  if (!performancesData || !publicationsData) {
    console.error('❌ Не удалось загрузить основные контентные файлы');
    process.exit(1);
  }

  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Основные страницы -->`;

  // Основные страницы
  const mainPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/performances', priority: '0.9', changefreq: 'weekly' },
    { url: '/publications', priority: '0.8', changefreq: 'weekly' },
    { url: '/services', priority: '0.7', changefreq: 'monthly' },
    { url: '/contacts', priority: '0.7', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' }
  ];

  mainPages.forEach(page => {
    sitemapXML += '\n' + generateURLXML(
      `${baseUrl}${page.url}`,
      currentDate,
      page.changefreq,
      page.priority
    );
  });

  // Подразделы "О нас"
  if (aboutData && aboutData.subsections) {
    sitemapXML += '\n\n  <!-- Подразделы "О нас" -->';
    
    Object.keys(aboutData.subsections).forEach(subsection => {
      sitemapXML += '\n' + generateURLXML(
        `${baseUrl}/about/${subsection}`,
        currentDate,
        'monthly',
        '0.7'
      );
    });
  }

  // Подразделы "Услуги"
  if (servicesData && servicesData.subsections) {
    sitemapXML += '\n\n  <!-- Подразделы "Услуги" -->';
    
    Object.keys(servicesData.subsections).forEach(subsection => {
      sitemapXML += '\n' + generateURLXML(
        `${baseUrl}/services/${subsection}`,
        currentDate,
        'monthly',
        '0.7'
      );
    });
  }

  // Спектакли
  if (performancesData && performancesData.performances) {
    sitemapXML += '\n\n  <!-- Спектакли -->';
    
    performancesData.performances.forEach(performance => {
      const performanceId = generatePerformanceId(performance.title);
      const images = performance.gallery || [];
      const videos = performance.video ? [performance.video] : [];
      
      sitemapXML += '\n' + generateURLXML(
        `${baseUrl}/performances/${performanceId}`,
        currentDate,
        'weekly',
        '0.7',
        images,
        videos
      );
    });
  }

  // Публикации
  if (publicationsData && publicationsData.publications) {
    sitemapXML += '\n\n  <!-- Публикации -->';
    
    publicationsData.publications.forEach(publication => {
      const publicationId = generatePublicationId(publication.title, publication.date);
      const images = publication.gallery || [];
      const lastmod = formatDateForXML(publication.date);
      
      sitemapXML += '\n' + generateURLXML(
        `${baseUrl}/publications/${publicationId}`,
        lastmod,
        'monthly',
        '0.6',
        images
      );
    });
  }

  sitemapXML += '\n\n</urlset>';

  // Сохраняем файл
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  
  try {
    fs.writeFileSync(outputPath, sitemapXML, 'utf8');
  } catch (error) {
    console.error('❌ Ошибка сохранения файла:', error.message);
    process.exit(1);
  }
}

// Запускаем генерацию
generateSitemap();

export { generateSitemap };
