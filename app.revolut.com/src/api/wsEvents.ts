import { TakeableChannel } from 'redux-saga'

export const ServiceTypes = ({
  SERVICE_RESOLVED: 'service_resolved',
  SERVICE_ASSIGNED: 'service_assigned',
  SERVICE_RATED: 'service_rated',
  SERVICE_CLOSED: 'service_closed',
  SERVICE_INITIALIZED: 'service_initialized',
  SERVICE_ESCALATED: 'service_escalated',
  SERVICE_DELETED: 'service_deleted',
} as unknown) as Record<string, TakeableChannel<string>>
