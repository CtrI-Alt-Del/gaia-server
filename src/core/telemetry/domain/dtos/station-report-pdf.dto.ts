export type StationReportPdfPayload = {
  headerTitle: string
  brandName: string
  stationTitle: string
  overviewDetails: Array<{
    label: string
    value: string
  }>
  alerts: {
    critical: number
    warning: number
  }
  parameterSections: Array<{
    header: string
    description: string
    tables: Array<{
      title: string
      rows: Array<{
        period: string
        value: string
      }>
    }>
  }>
  generatedAt: Date
}
