export const DEPENDENCIES = {
  queue: {
    alertingQueue: 'ALERTING_QUEUE',
    alertingBroker: 'ALERTING_BROKER',
    authQueue: 'AUTH_QUEUE',
    authBroker: 'AUTH_BROKER',
    membershipQueue: 'MEMBERSHIP_QUEUE',
    membershipBroker: 'MEMBERSHIP_BROKER',
    telemetryQueue: 'TELEMETRY_QUEUE',
    telemetryBroker: 'TELEMETRY_BROKER',
  },
  provision: {
    cacheProvider: 'CACHE_PROVIDER',
    datetimeProvider: 'DATETIME_PROVIDER',
    pdfProvider: 'PDF_PROVIDER',
  },
} as const
