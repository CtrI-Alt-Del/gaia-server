function escapePdfText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

type Section = {
  header: string
  lines: string[]
}

import { Buffer } from 'node:buffer'

export function generateSimplePdf(title: string, sections: Section[]): Buffer {
  const objects: string[] = []
  const offsets: number[] = []

  const EOL = '\n'
  const header = `%PDF-1.4${EOL}`

  const contentParts: string[] = []
  contentParts.push('BT')
  contentParts.push('/F1 12 Tf')
  contentParts.push('1 0 0 1 72 760 Tm')
  contentParts.push('14 TL')

  contentParts.push('/F1 18 Tf')
  contentParts.push(`(${escapePdfText(title)}) Tj`)
  contentParts.push('T*')
  contentParts.push('T*')
  contentParts.push('/F1 12 Tf')

  for (const section of sections) {
    contentParts.push(`(${escapePdfText(section.header)}) Tj`)
    contentParts.push('T*')
    for (const line of section.lines) {
      const safe = escapePdfText(line)
      contentParts.push(`(${safe}) Tj`)
      contentParts.push('T*')
    }
    contentParts.push('T*')
  }

  contentParts.push('ET')
  const contentStream = contentParts.join(EOL) + EOL

  objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj')

  objects.push('2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj')

  objects.push(
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj',
  )

  const contentLength = Buffer.byteLength(contentStream, 'utf8')
  objects.push(
    `4 0 obj << /Length ${contentLength} >> stream${EOL}${contentStream}endstream endobj`,
  )

  objects.push('5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj')

  let body = ''
  let cursor = Buffer.byteLength(header, 'utf8')

  for (const obj of objects) {
    offsets.push(cursor)
    const chunk = obj + EOL
    body += chunk
    cursor += Buffer.byteLength(chunk, 'utf8')
  }

  const xrefStart = cursor
  const size = objects.length + 1

  let xref = `xref${EOL}`
  xref += `0 ${size}${EOL}`
  xref += `0000000000 65535 f ${EOL}`
  for (const off of offsets) {
    xref += `${off.toString().padStart(10, '0')} 00000 n ${EOL}`
  }

  let trailer = `trailer${EOL}`
  trailer += `<< /Size ${size} /Root 1 0 R >>${EOL}`
  trailer += `startxref${EOL}`
  trailer += `${xrefStart}${EOL}`
  trailer += `%%EOF${EOL}`

  const pdfString = header + body + xref + trailer
  return Buffer.from(pdfString, 'utf8')
}
