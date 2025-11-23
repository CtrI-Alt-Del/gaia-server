import { Buffer } from 'node:buffer'
import * as fs from 'node:fs'
import path from 'node:path'

const EOL = '\n'

type TableRow = {
  period: string
  value: string
}

type ParameterTable = {
  title: string
  rows: TableRow[]
}

export type ParameterSection = {
  header: string
  description: string
  tables: ParameterTable[]
}

export type StationReportPdfInput = {
  headerTitle: string
  brandName: string
  stationTitle: string
  overviewDetails: Array<{ label: string; value: string }>
  alerts: {
    critical: number
    warning: number
  }
  parameterSections: ParameterSection[]
  generatedAt: Date
}

type RgbColor = [number, number, number]

const COLORS = {
  header: rgb(62, 42, 135),
  headerAccent: rgb(90, 64, 180),
  brand: rgb(28, 174, 77),
  text: rgb(0, 0, 0),
  gray: rgb(92, 92, 92),
  lightGray: rgb(240, 240, 240),
  border: rgb(190, 190, 190),
  tableHeader: rgb(74, 55, 165),
}

const PAGE = {
  width: 595,
  height: 842,
}

export function generateStationReportPdf(payload: StationReportPdfInput): Buffer {
  const painter = new StationReportPdfPainter(payload)

  painter.addStationOverview()
  painter.addAlertSummary()

  for (const section of payload.parameterSections) {
    painter.addParameterSection(section)
  }

  return painter.build()
}

class StationReportPdfPainter {
  private readonly margin = 48
  private readonly headerHeight = 78
  private readonly footerHeight = 45
  private readonly contentGap = 14
  private readonly space = 18
  private readonly spacingFactor = 1.4
  private readonly availableWidth = PAGE.width - this.margin * 2

  private readonly pages: string[] = []
  private currentContent: string[] = []
  private currentY = 0
  private pageNumber = 0

  constructor(private readonly payload: StationReportPdfInput) {
    this.startPage()
  }

  private addSpace(lines: number = 1, base: number = 14): void {
    this.currentY -= lines * base * this.spacingFactor
  }

  addStationOverview(): void {
    this.addSectionTitle(this.payload.stationTitle)
    this.addKeyValueDetails(this.payload.overviewDetails)
  }

  addAlertSummary(): void {
    const cards = [
      { label: 'Críticos', value: this.payload.alerts.critical },
      { label: 'Avisos', value: this.payload.alerts.warning },
    ]
    this.ensureSpace(90)
    const titleY = this.currentY
    this.drawText('Alertas', this.margin, titleY, 14, {
      color: COLORS.headerAccent,
      bold: true,
    })
    this.currentY = titleY - this.space

    const cardWidth = (this.availableWidth - 16) / cards.length
    const cardHeight = 58
    const baseY = this.currentY

    cards.forEach((card, index) => {
      const x = this.margin + index * (cardWidth + 16)
      const bottom = baseY - cardHeight

      this.drawRectangle(x, bottom, cardWidth, cardHeight, {
        fill: COLORS.lightGray,
        stroke: COLORS.border,
      })

      this.drawText(card.label, x + 14, bottom + cardHeight - 18, 11, {
        color: COLORS.gray,
      })

      this.drawText(String(card.value), x + 14, bottom + 13, 20, {
        color: COLORS.headerAccent,
        bold: true,
      })
    })

    this.currentY = baseY - cardHeight - this.contentGap
  }

  addParameterSection(section: ParameterSection): void {
    this.ensureSpace(80)

    const barHeight = 26
    const top = this.currentY
    const bottom = top - barHeight

    this.drawRectangle(this.margin, bottom, this.availableWidth, barHeight, {
      fill: COLORS.tableHeader,
    })

    const textY = bottom + barHeight / 5 + 4
    this.drawText(section.header, this.margin + 12, textY, 12, {
      color: rgb(255, 255, 255),
      bold: true,
    })

    this.currentY = bottom - this.space

    if (section.description) {
      this.drawParagraph(section.description, 11, COLORS.gray)
    }

    for (const table of section.tables) {
      this.addTable(table)
    }
  }

  build(): Buffer {
    if (this.currentContent.length > 0) {
      this.finishPage()
    }

    return assemblePdf(this.pages)
  }

  private startPage(): void {
    if (this.currentContent.length) {
      this.finishPage()
    }

    this.pageNumber += 1
    this.currentContent = []
    this.drawHeader()
    this.currentY = PAGE.height - this.headerHeight - this.contentGap
  }

  private finishPage(): void {
    this.drawFooter()
    this.pages.push(this.currentContent.join(EOL))
    this.currentContent = []
  }

  private drawHeader(): void {
    const y = PAGE.height - this.headerHeight
    this.drawRectangle(0, y, PAGE.width, this.headerHeight, { fill: COLORS.header })

    this.drawText(this.payload.headerTitle, this.margin, PAGE.height - 48, 20, {
      color: rgb(255, 255, 255),
      bold: true,
    })

    // const logoPath = path.join(__dirname, '../../../../../documentation/example.jpeg')

    // if (fs.existsSync(logoPath)) {
    //   const imageData = fs.readFileSync(logoPath)
    //   const base64 = imageData.toString('base64')
    //   this.currentContent.push(`%IMG_START%${base64}%IMG_END%`)

    //   const imgWidth = 80
    //   const imgHeight = imgWidth * 0.3
    //   const x = PAGE.width - this.margin - imgWidth
    //   const y = PAGE.height - imgHeight - 20

    //   this.currentContent.push(
    //     'q',
    //     `${imgWidth} 0 0 ${imgHeight} ${x} ${y} cm`,
    //     '/Im1 Do',
    //     'Q',
    //   )
    // }
  }

  private drawFooter(): void {
    const footerTop = this.footerHeight + 12
    const lineY = footerTop + 12

    this.drawLine(this.margin, lineY, PAGE.width - this.margin, lineY, {
      color: COLORS.border,
      width: 0.5,
    })

    const generatedLabel = `Gerado em: ${formatDateTime(this.payload.generatedAt)}`
    this.drawText(generatedLabel, this.margin, footerTop, 13, { color: COLORS.gray })

    const pageLabel = `Página ${this.pageNumber}`
    this.drawText(
      pageLabel,
      PAGE.width - this.margin - this.estimateTextWidth(pageLabel, 10),
      footerTop,
      13,
      {
        color: COLORS.gray,
      },
    )

    const brandX =
      PAGE.width - this.margin - this.estimateTextWidth(this.payload.brandName, 10) - 20
    this.drawText('Tecsus', brandX, footerTop - 18, 18, {
      color: COLORS.brand,
      bold: true,
    })
  }

  private addSectionTitle(text: string): void {
    this.ensureSpace(40)
    this.drawText(text, this.margin, this.currentY - 10, 18, {
      color: COLORS.headerAccent,
      bold: true,
    })
    this.addSpace(2)
  }

  private addKeyValueDetails(items: Array<{ label: string; value: string }>): void {
    const labelWidth = 120
    const valueWidth = this.availableWidth - labelWidth

    items.forEach((item, index) => {
      const lines = this.wrapText(item.value, valueWidth, 12)
      const rowHeight = lines.length * 15 + 6
      this.ensureSpace(rowHeight)

      this.drawText(`${item.label}:`, this.margin, this.currentY, 12, {
        color: COLORS.gray,
        bold: true,
      })

      let lineY = this.currentY
      lines.forEach((line) => {
        this.drawText(line, this.margin + labelWidth, lineY, 12, {
          color: COLORS.text,
        })
        lineY -= 15
      })

      this.currentY = lineY - (index === items.length - 1 ? this.contentGap : 8)
    })
  }

  private drawParagraph(text: string, fontSize: number, color: RgbColor): void {
    const lines = this.wrapText(text, this.availableWidth, fontSize)
    const totalHeight = lines.length * (fontSize + 4)
    this.ensureSpace(totalHeight)

    lines.forEach((line) => {
      this.drawText(line, this.margin, this.currentY, fontSize, { color })
      this.currentY -= fontSize + 4
    })

    this.addSpace(0.3)
  }

  private addTable(table: ParameterTable): void {
    const rows = table.rows.length
      ? table.rows
      : [{ period: 'Sem dados no período', value: '-' }]

    const rowHeight = 22
    const headerHeight = 24
    const tableHeight = headerHeight + rows.length * rowHeight
    const totalHeight = tableHeight + 40
    this.ensureSpace(totalHeight)

    this.drawText(table.title, this.margin, this.currentY - 5, 13, {
      color: COLORS.headerAccent,
      bold: true,
    })
    this.currentY -= this.space

    const startTop = this.currentY
    const headerBottom = startTop - headerHeight
    const tableWidth = this.availableWidth
    const columnWidths = [tableWidth * 0.62, tableWidth * 0.38]

    this.drawRectangle(this.margin, headerBottom, tableWidth, headerHeight, {
      fill: COLORS.tableHeader,
    })

    const headerTextY = headerBottom + headerHeight - 9
    this.drawText('Período', this.margin - 2 + 15, headerTextY - 6, 13, {
      color: rgb(255, 255, 255),
      bold: true,
    })
    this.drawText(
      'Valor Médio',
      this.margin - 2 + columnWidths[0] + 15,
      headerTextY - 6,
      13,
      {
        color: rgb(255, 255, 255),
        bold: true,
      },
    )

    let rowTop = headerBottom
    rows.forEach((row) => {
      const rowBottom = rowTop - rowHeight
      this.drawRectangle(this.margin, rowBottom, tableWidth, rowHeight, {
        fill: rgb(255, 255, 255),
        stroke: COLORS.border,
      })

      const textY = rowBottom + rowHeight - 8

      this.drawText(row.period, this.margin + 10, textY - 6, 12, { color: COLORS.text })
      this.drawText(row.value, this.margin + columnWidths[0] + 10, textY - 6, 12, {
        color: COLORS.text,
      })

      rowTop = rowBottom
    })

    const dividerX = this.margin + columnWidths[0]
    this.drawLine(dividerX, headerBottom, dividerX, rowTop, {
      color: COLORS.border,
      width: 0.5,
    })

    this.currentY = rowTop - this.contentGap
  }

  private ensureSpace(requiredHeight: number): void {
    const minY = this.footerHeight + 40
    if (this.currentY - requiredHeight < minY) {
      this.startPage()
    }
  }

  private drawText(
    text: string,
    x: number,
    y: number,
    fontSize: number,
    options?: { color?: RgbColor; bold?: boolean },
  ): void {
    const color = options?.color ?? COLORS.text
    const sanitized = escapePdfText(text)
    const commands = [
      'BT',
      `${color[0]} ${color[1]} ${color[2]} rg`,
      `/F1 ${fontSize} Tf`,
      `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
      `(${sanitized}) Tj`,
      'ET',
    ]
    this.currentContent.push(...commands)
  }

  private drawRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    options: { fill?: RgbColor; stroke?: RgbColor },
  ): void {
    const commands = ['q']

    if (options.stroke) {
      commands.push(`${options.stroke[0]} ${options.stroke[1]} ${options.stroke[2]} RG`)
      commands.push('0.6 w')
    }

    if (options.fill) {
      commands.push(`${options.fill[0]} ${options.fill[1]} ${options.fill[2]} rg`)
    }

    commands.push(
      `${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re`,
    )

    if (options.fill && options.stroke) {
      commands.push('B')
    } else if (options.fill) {
      commands.push('f')
    } else if (options.stroke) {
      commands.push('S')
    }

    commands.push('Q')

    this.currentContent.push(...commands)
  }

  private drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options: { color: RgbColor; width: number },
  ): void {
    const commands = [
      'q',
      `${options.color[0]} ${options.color[1]} ${options.color[2]} RG`,
      `${options.width.toFixed(2)} w`,
      `${x1.toFixed(2)} ${y1.toFixed(2)} m`,
      `${x2.toFixed(2)} ${y2.toFixed(2)} l`,
      'S',
      'Q',
    ]
    this.currentContent.push(...commands)
  }

  private wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let current = ''

    words.forEach((word) => {
      const tentative = current ? `${current} ${word}` : word
      if (this.estimateTextWidth(tentative, fontSize) <= maxWidth) {
        current = tentative
      } else {
        if (current) {
          lines.push(current)
        }
        current = word
      }
    })

    if (current) {
      lines.push(current)
    }

    return lines
  }

  private estimateTextWidth(text: string, fontSize: number): number {
    const averageFactor = 0.52
    return text.length * fontSize * averageFactor
  }
}

function rgb(r: number, g: number, b: number): RgbColor {
  return [r / 255, g / 255, b / 255]
}

function escapePdfText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function formatDateTime(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} às ${hour}:${minute}`
}

function assemblePdf(pageContents: string[]): Buffer {
  const header = `%PDF-1.4${EOL}`
  const objects: string[] = []
  const offsets: number[] = []

  const pageCount = pageContents.length
  const firstPageObject = 3
  const firstContentObject = firstPageObject + pageCount
  const fontObjectNumber = firstContentObject + pageCount
  const firstImageObjectNumber = fontObjectNumber + 1

  const logoMatches = pageContents
    .join('')
    .match(/%IMG_START(?:_FOOTER)?%(.*?)%IMG_END(?:_FOOTER)?%/g)

  const logosBase64 = logoMatches
    ? logoMatches.map((m) =>
        m.replace(/%IMG_START(?:_FOOTER)?%|%IMG_END(?:_FOOTER)?%/g, ''),
      )
    : []

  const imageBuffers = logosBase64.map((b64) => Buffer.from(b64, 'base64'))

  const imageRefs = imageBuffers
    .map((_, i) => `/Im${i + 1} ${firstImageObjectNumber + i} 0 R`)
    .join(' ')

  const kidsRefs = Array.from(
    { length: pageCount },
    (_, index) => `${firstPageObject + index} 0 R`,
  ).join(' ')

  objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj')
  objects.push(
    `2 0 obj << /Type /Pages /Kids [${kidsRefs}] /Count ${pageCount} >> endobj`,
  )

  for (let i = 0; i < pageCount; i++) {
    const pageObjectNumber = firstPageObject + i
    const contentObjectNumber = firstContentObject + i
    objects.push(
      `${pageObjectNumber} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] /Contents ${contentObjectNumber} 0 R /Resources << 
  /Font << /F1 ${fontObjectNumber} 0 R >> 
  /XObject << ${imageRefs} >> 
>> endobj`,
    )
  }

  for (let i = 0; i < pageCount; i++) {
    const contentObjectNumber = firstContentObject + i
    const contentStream =
      pageContents[i].replace(/%IMG_START(?:_FOOTER)?%.*?%IMG_END(?:_FOOTER)?%/g, '') +
      EOL

    const length = Buffer.byteLength(contentStream, 'utf8')

    objects.push(
      `${contentObjectNumber} 0 obj << /Length ${length} >> stream` +
        EOL +
        contentStream +
        'endstream endobj',
    )
  }

  objects.push(
    `${fontObjectNumber} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> endobj`,
  )

  imageBuffers.forEach((imageBuffer, index) => {
    const objNumber = firstImageObjectNumber + index
    const imageStream =
      `${objNumber} 0 obj << /Type /XObject /Subtype /Image /Width 600 /Height 240 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBuffer.length} >> stream\n` +
      imageBuffer.toString('binary') +
      '\nendstream endobj'
    objects.push(imageStream)
  })

  let cursor = Buffer.byteLength(header, 'utf8')
  let body = ''
  objects.forEach((object) => {
    offsets.push(cursor)
    const chunk = object + EOL
    body += chunk
    cursor += Buffer.byteLength(chunk, 'utf8')
  })

  const xrefStart = cursor
  const size = objects.length + 1
  let xref = `xref${EOL}`
  xref += `0 ${size}${EOL}`
  xref += `0000000000 65535 f ${EOL}`
  offsets.forEach((offset) => {
    xref += `${offset.toString().padStart(10, '0')} 00000 n ${EOL}`
  })

  const trailer =
    'trailer' +
    EOL +
    `<< /Size ${size} /Root 1 0 R >>` +
    EOL +
    'startxref' +
    EOL +
    `${xrefStart}` +
    EOL +
    '%%EOF' +
    EOL

  return Buffer.concat([
    Buffer.from(header, 'utf8'),
    Buffer.from(body, 'binary'),
    Buffer.from(xref + trailer, 'utf8'),
  ])
}
