import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import PDFDocument from 'pdfkit'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const documentsDir = path.resolve(__dirname, '..', 'public', 'documents')

function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }
}

function getPrettyTitleFromFilename(filePath) {
    const base = path.basename(filePath, '.pdf')
    // Заменяем дефисы и подчёркивания на пробелы, капитализация слов
    const human = base
        .replace(/[\-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    return human
}

function generatePlaceholderPdf(targetFilePath, title, generatedAt) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 72, info: { Title: title } })
        const stream = fs.createWriteStream(targetFilePath)

        stream.on('finish', resolve)
        stream.on('error', reject)

        doc.pipe(stream)

        // Заголовок
        doc.fontSize(22).text(title, { align: 'center' })
        doc.moveDown(1.5)
        doc.fontSize(12).fillColor('#555555').text(`Сгенерировано: ${generatedAt}`, { align: 'center' })
        doc.moveDown(2)
        doc.fillColor('#000000').fontSize(11).text(
            'Это техническая заглушка PDF. Файл будет заменён на реальный документ при его появлении.',
            { align: 'center' }
        )

        doc.end()
    })
}

async function main() {
    ensureDirExists(documentsDir)

    const entries = fs.readdirSync(documentsDir, { withFileTypes: true })
    const pdfFiles = entries
        .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.pdf'))
        .map((e) => path.join(documentsDir, e.name))

    const nowStr = new Date().toLocaleDateString('ru-RU')

    for (const filePath of pdfFiles) {
        const base = path.basename(filePath).toLowerCase()
        if (base === 'schedule.pdf') {
            continue
        }
        const prettyTitle = getPrettyTitleFromFilename(filePath)
        await generatePlaceholderPdf(filePath, prettyTitle, nowStr)
        // eslint-disable-next-line no-console
        console.log(`✔ Пересоздано: ${path.basename(filePath)}`)
    }

    // eslint-disable-next-line no-console
    console.log('Готово: все PDF-заглушки (кроме schedule.pdf) пересозданы')
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Ошибка генерации PDF-заглушек:', err)
    process.exit(1)
})


