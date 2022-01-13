import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { fetchIncidentBanners } from 'api'

export const useIncidents = () => {
  const { data, isFetched, isLoading } = useQuery(
    QueryKey.Incidents,
    fetchIncidentBanners,
  )

  return {
    incidents: data || [],
    isFetched,
    isLoading,
  }
}
