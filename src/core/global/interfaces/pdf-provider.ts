import type { StationReportPdfPayload } from '@/core/telemetry/domain/dtos'

export interface PdfProvider {
  generateStationReport(payload: StationReportPdfPayload): Promise<Buffer>
}
