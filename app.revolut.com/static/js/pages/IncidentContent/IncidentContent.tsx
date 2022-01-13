import { FC, useEffect, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Box } from '@revolut/ui-kit'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'
import { checkRequired, Url } from '@revolut/rwa-core-utils'

import { useIncidents } from 'hooks'
import { getIncidentContent } from 'utils'

type UrlParams = {
  incidentId: string
}
export const DESCRIPTION_NODE_TEST_ID = 'incident-description-node-testid'

export const IncidentContent: FC = () => {
  const { incidentId } = useParams<UrlParams>()
  const { incidents, isFetched } = useIncidents()
  const history = useHistory()

  const handleBackButtonClick = useCallback(() => {
    history.push(Url.Home)
  }, [history])

  const currentIncident = incidents.find(({ id }) => incidentId === id)

  const { title, description, footer, hasContent } = getIncidentContent(currentIncident)

  // handling the cases if page has been loaded by direct link, but incident has been already resolved.
  // or content has not been parsed.
  const noContent = !currentIncident || !hasContent
  useEffect(() => {
    if (isFetched && noContent) {
      handleBackButtonClick()
    }
  }, [handleBackButtonClick, isFetched, noContent])

  if (noContent) {
    return null
  }

  const descriptionNode = (
    <Box data-testid={DESCRIPTION_NODE_TEST_ID}>
      <Box
        dangerouslySetInnerHTML={{
          __html: checkRequired(description, 'description should exist'),
        }}
      />
      {footer && <Box mt="px16" dangerouslySetInnerHTML={{ __html: footer }} />}
    </Box>
  )

  return (
    <StatusLayout
      iconType={StatusIconType.Warning}
      title={title as string}
      authLayoutProps={{
        description: descriptionNode,
        handleBackButtonClick,
      }}
    />
  )
}
