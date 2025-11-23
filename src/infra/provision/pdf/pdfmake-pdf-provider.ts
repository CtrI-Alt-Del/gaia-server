import PdfPrinter from 'pdfmake'
import PdfFonts from 'pdfmake/build/vfs_fonts'
import path from 'node:path'
import fs from 'node:fs'

import type { PdfProvider } from '@/core/global/interfaces'
import type { StationReportPdfPayload } from '@/core/telemetry/domain/dtos'

type StationReportDetail = {
  label: string
  value: string
}

type StationReportTableRow = {
  period: string
  value: string
}

type StationReportParameterTable = {
  title: string
  rows: StationReportTableRow[]
}

type StationReportParameterSection = {
  header: string
  description: string
  tables: StationReportParameterTable[]
}

type Content = string | number | boolean | { [key: string]: any } | Content[]
type StyleDictionary = Record<
  string,
  Partial<{
    fontSize: number
    bold: boolean
    italics: boolean
    color: string
    alignment: 'left' | 'right' | 'center' | 'justify'
    margin: number | [number, number, number, number]
  }>
>
type TDocumentDefinitions = {
  content?: Content | Content[]
  styles?: StyleDictionary
  defaultStyle?: { [key: string]: any }
  pageSize?: string | { width: number; height: number }
  pageMargins?: number | [number, number, number, number]
  [key: string]: any
}

type FontSet = {
  family: string
  dir: string
  files: { normal: string; bold: string; italics: string; bolditalics: string }
}

function pathExists(p: string): boolean {
  try {
    return fs.existsSync(p)
  } catch {
    return false
  }
}

function findFontSet(): FontSet {
  const envDir = process.env.PDF_FONTS_DIR

  if (envDir && pathExists(envDir)) {
    const files = {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf',
    }
    const allExist = Object.values(files).every((f) => pathExists(path.join(envDir, f)))
    if (allExist) return { family: 'Default', dir: envDir, files }
  }

  const winFonts = 'C:\\Windows\\Fonts'
  if (process.platform === 'win32' && pathExists(winFonts)) {
    const files = {
      normal: 'arial.ttf',
      bold: 'arialbd.ttf',
      italics: 'ariali.ttf',
      bolditalics: 'arialbi.ttf',
    }
    const allExist = Object.values(files).every((f) => pathExists(path.join(winFonts, f)))
    if (allExist) return { family: 'Default', dir: winFonts, files }
  }

  const linuxDejaVu = '/usr/share/fonts/truetype/dejavu'
  if (pathExists(linuxDejaVu)) {
    const files = {
      normal: 'DejaVuSans.ttf',
      bold: 'DejaVuSans-Bold.ttf',
      italics: 'DejaVuSans-Oblique.ttf',
      bolditalics: 'DejaVuSans-BoldOblique.ttf',
    }
    const allExist = Object.values(files).every((f) =>
      pathExists(path.join(linuxDejaVu, f)),
    )
    if (allExist) return { family: 'Default', dir: linuxDejaVu, files }
  }

  const macFonts = '/System/Library/Fonts/Supplemental'
  if (pathExists(macFonts)) {
    const files = {
      normal: 'Arial.ttf',
      bold: 'Arial Bold.ttf',
      italics: 'Arial Italic.ttf',
      bolditalics: 'Arial Bold Italic.ttf',
    }
    const allExist = Object.values(files).every((f) => pathExists(path.join(macFonts, f)))
    if (allExist) return { family: 'Default', dir: macFonts, files }
  }

  const examplesDir = path.join(
    process.cwd(),
    'node_modules',
    'pdfmake',
    'examples',
    'fonts',
  )
  if (pathExists(examplesDir)) {
    const files = {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf',
    }
    const allExist = Object.values(files).every((f) =>
      pathExists(path.join(examplesDir, f)),
    )
    if (allExist) return { family: 'Default', dir: examplesDir, files }
  }

  throw new Error(
    'No TTF fonts found for pdfmake. Configure PDF_FONTS_DIR env var to a directory containing Roboto (or compatible) TTF files, or install system fonts (Arial/DejaVu).',
  )
}

const fontSet = findFontSet()

const printer = new PdfPrinter({
  Default: {
    normal: path.join(fontSet.dir, fontSet.files.normal),
    bold: path.join(fontSet.dir, fontSet.files.bold),
    italics: path.join(fontSet.dir, fontSet.files.italics),
    bolditalics: path.join(fontSet.dir, fontSet.files.bolditalics),
  },
})

export class PdfmakePdfProvider implements PdfProvider {
  async generateStationReport(payload: StationReportPdfPayload): Promise<Buffer> {
    const docDefinition: TDocumentDefinitions = {
      info: {
        title: payload.stationTitle,
        author: payload.brandName,
        subject: payload.headerTitle,
      },
      pageMargins: [40, 90, 40, 60],
      header: () => this.buildHeader(payload),
      footer: (currentPage, pageCount) =>
        this.buildFooter(payload, currentPage, pageCount),
      content: this.buildContent(payload),
      styles: this.buildStyles(),
      defaultStyle: {
        font: 'Default',
        fontSize: 11,
        color: '#1c1c1c',
      },
    }

    return this.render(docDefinition)
  }

  private buildHeader(payload: StationReportPdfPayload): Content {
    return {
      margin: [0, 0, 0, 0],
      table: {
        widths: ['*', 'auto'],
        body: [
          [
            {
              text: payload.headerTitle,
              style: 'headerTitle',
              fillColor: '#3e2a87',
              color: '#ffffff',
              margin: [40, 20, 0, 20],
              border: [false, false, false, false],
            },
            {
              text: payload.brandName.toUpperCase(),
              style: 'brand',
              alignment: 'right',
              fillColor: '#3e2a87',
              color: '#1cae4d',
              margin: [0, 20, 40, 20],
              border: [false, false, false, false],
            },
          ],
        ],
      },
      layout: 'noBorders',
    }
  }

  private buildFooter(
    payload: StationReportPdfPayload,
    currentPage: number,
    pageCount: number,
  ): Content {
    const innerWidth = 515
    return {
      margin: [40, 4, 40, 12],
      stack: [
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: innerWidth,
              y2: 0,
              lineWidth: 0.5,
              color: '#d6d6d6',
            },
          ],
          margin: [0, 0, 0, 6],
        },
        {
          columns: [
            {
              text: `Gerado em: ${this.formatDetailedDate(payload.generatedAt)}`,
              style: 'footer',
            },
            {
              text: `Página ${currentPage} de ${pageCount}`,
              alignment: 'right',
              style: 'footer',
            },
          ],
        },
      ],
    }
  }

  private buildContent(payload: StationReportPdfPayload): Content[] {
    const content: Content[] = [
      {
        text: payload.stationTitle,
        style: 'stationTitle',
        margin: [0, 8, 0, 10],
      },
      this.buildOverviewDetails(payload.overviewDetails),
      this.buildAlertSummary(payload.alerts.critical, payload.alerts.warning),
    ]

    payload.parameterSections.forEach((section) => {
      content.push(...this.buildParameterSection(section))
    })

    return content
  }

  private buildOverviewDetails(details: StationReportDetail[]): Content {
    return {
      table: {
        widths: ['auto', '*'],
        body: details.map((detail) => [
          {
            text: `${detail.label}:`,
            style: 'detailLabel',
            margin: [0, 2, 8, 2],
          },
          {
            text: detail.value,
            margin: [0, 2, 0, 2],
          },
        ]),
      },
      layout: 'noBorders',
      margin: [0, 0, 0, 16],
    }
  }

  private buildAlertSummary(critical: number, warning: number): Content {
    return {
      margin: [0, 0, 0, 16],
      stack: [
        {
          text: 'Alertas',
          style: 'sectionTitle',
          margin: [0, 0, 0, 8],
        },
        {
          columns: [
            this.buildAlertCard('Críticos', critical),
            this.buildAlertCard('Avisos', warning),
          ],
          columnGap: 16,
        },
      ],
    }
  }

  private buildAlertCard(label: string, value: number): Content {
    return {
      width: '*',
      table: {
        widths: ['*'],
        body: [
          [
            {
              text: label,
              style: 'alertLabel',
              fillColor: '#f4f4fb',
              margin: [12, 8, 12, 4],
            },
          ],
          [
            {
              text: String(value),
              style: 'alertValue',
              fillColor: '#f4f4fb',
              margin: [12, 4, 12, 8],
            },
          ],
        ],
      },
      layout: 'noBorders',
    }
  }

  private buildParameterSection(section: StationReportParameterSection): Content[] {
    const block: Content[] = [
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: section.header,
                style: 'parameterHeader',
                fillColor: '#4a37a5',
                color: '#ffffff',
                margin: [12, 6, 12, 6],
              },
            ],
          ],
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 0],
      },
    ]

    if (section.description) {
      block.push({
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: section.description,
                style: 'parameterDescription',
                margin: [0, 0, 0, 0],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: (i: number, node: { table: { body: unknown[][] } }) =>
            i === 0 || i === node.table.body.length ? 0.5 : 0,
          vLineWidth: (i: number, node: { table: { widths: unknown[] } }) =>
            i === 0 || i === node.table.widths.length ? 0.5 : 0,
          hLineColor: () => '#d6d6d6',
          vLineColor: () => '#d6d6d6',
          paddingLeft: () => 12,
          paddingRight: () => 12,
          paddingTop: () => 8,
          paddingBottom: () => 8,
        },
        margin: [0, 0, 0, 0],
      })
    }

    section.tables.forEach((table) => {
      block.push(this.buildParameterTable(table))
    })

    return block
  }

  private buildParameterTable(table: StationReportParameterTable): Content {
    const rows = table.rows.length ? table.rows : this.buildFallbackRow()
    const body = [
      [
        {
          text: 'Período',
          style: 'tableHeaderCell',
        },
        {
          text: 'Valor Médio',
          style: 'tableHeaderCell',
          alignment: 'right',
        },
      ],
      ...rows.map((row) => this.buildTableRow(row)),
    ]

    return {
      margin: [0, 4, 0, 12],
      stack: [
        {
          text: table.title,
          style: 'sectionTitle',
          margin: [0, 0, 0, 8],
        },
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  table: {
                    widths: ['*', 'auto'],
                    headerRows: 1,
                    body,
                  },
                  layout: {
                    fillColor: (rowIndex: number) =>
                      rowIndex === 0 ? '#4a37a5' : undefined,
                    hLineWidth: (i: number, node: { table: { body: unknown[][] } }) =>
                      i === 0 || i === node.table.body.length ? 0 : 0.5,
                    vLineWidth: (i: number) => (i === 0 || i === 1 ? 0 : 0.5),
                    hLineColor: () => '#d6d6d6',
                    vLineColor: () => '#d6d6d6',
                    paddingLeft: () => 12,
                    paddingRight: () => 12,
                    paddingTop: () => 8,
                    paddingBottom: () => 8,
                  },
                },
              ],
            ],
          },
          layout: {
            hLineWidth: (i: number, node: { table: { body: unknown[][] } }) =>
              i === 0 || i === node.table.body[0].length ? 0.5 : 0,
            vLineWidth: (i: number, node: { table: { widths: unknown[] } }) =>
              i === 0 || i === node.table.widths.length ? 0.5 : 0,
            hLineColor: () => '#d6d6d6',
            vLineColor: () => '#d6d6d6',
            paddingLeft: () => 0,
            paddingRight: () => 0,
            paddingTop: () => 0,
            paddingBottom: () => 0,
          },
        },
      ],
    }
  }

  private buildFallbackRow(): StationReportTableRow[] {
    return [{ period: 'Sem dados no período', value: '-' }]
  }

  private buildTableRow(row: StationReportTableRow): Array<Content> {
    return [
      {
        text: row.period,
        margin: [0, 2, 0, 2],
      },
      {
        text: row.value,
        margin: [0, 2, 0, 2],
        alignment: 'right',
      },
    ]
  }

  private buildStyles(): StyleDictionary {
    return {
      headerTitle: {
        fontSize: 16,
        bold: true,
        color: '#3e2a87',
      },
      brand: {
        fontSize: 18,
        bold: true,
        color: '#1cae4d',
      },
      stationTitle: {
        fontSize: 14,
        bold: true,
        color: '#4a37a5',
      },
      sectionTitle: {
        fontSize: 12,
        bold: true,
        color: '#4a37a5',
      },
      detailLabel: {
        bold: true,
        color: '#5c5c5c',
      },
      alertLabel: {
        fontSize: 11,
        bold: true,
        color: '#5c5c5c',
      },
      alertValue: {
        fontSize: 20,
        bold: true,
        color: '#4a37a5',
      },
      parameterHeader: {
        fontSize: 12,
        bold: true,
      },
      parameterDescription: {
        color: '#5c5c5c',
      },
      tableHeaderCell: {
        color: '#ffffff',
        bold: true,
      },
      footer: {
        fontSize: 9,
        color: '#5c5c5c',
      },
    }
  }

  private formatDetailedDate(date: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0')
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} às ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  private render(docDefinition: TDocumentDefinitions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const pdfDoc = printer.createPdfKitDocument(docDefinition)
      const chunks: Buffer[] = []

      pdfDoc.on('data', (chunk) => chunks.push(chunk))
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)))
      pdfDoc.on('error', (error) => reject(error))

      pdfDoc.end()
    })
  }
}
