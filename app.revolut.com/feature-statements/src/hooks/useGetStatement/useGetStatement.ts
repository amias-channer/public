import { useCallback, useEffect, useState, useRef } from 'react'
import { useQuery } from 'react-query'
import isEqual from 'lodash/isEqual'

import { StatementState } from '@revolut/rwa-core-types'
import { checkRequired, openUrlInNewTab, QueryKey } from '@revolut/rwa-core-utils'
import { useAuthContext } from '@revolut/rwa-core-auth'

import { fetchStatement } from '../../api'
import { GenerateRequestArgs } from '../../types'

const PENDING_DOC_REFETCH_TIMEOUT = 1_000
const READY_DOC_REFETCH_TIMEOUT = 10_000 // statement url lifetime is 15 sec https://bitbucket.org/revolut/squirrel/src/51ee654abb3e21977955ba963d98b8ec12d3de20/squirrel-core/src/main/java/com/revolut/squirrel/StatementGenerator.java#lines-35

type RequestArgs = {
  url: string
  params: Object
}

type ExternalHandlers = {
  onError?: VoidFunction
  onDownload?: VoidFunction
}

export const useGetStatement = () => {
  const { isAuthorized } = useAuthContext()

  const externalHandlers = useRef<ExternalHandlers>({})

  const [requestArgs, setRequestArgs] = useState<RequestArgs>()
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false)

  const { data, isFetching, isError } = useQuery(
    [QueryKey.Statement, requestArgs],
    () =>
      fetchStatement(
        checkRequired(requestArgs?.url, 'request arg url can not be empty'),
        checkRequired(requestArgs?.params, 'request arg params can not be empty'),
      ),
    {
      enabled: isAuthorized && Boolean(requestArgs),
      staleTime: 0,
      cacheTime: 0,
      refetchInterval,
      refetchIntervalInBackground: Boolean(refetchInterval),
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    if (data?.state === StatementState.InPreparation && isAuthorized) {
      setRefetchInterval(PENDING_DOC_REFETCH_TIMEOUT)
    } else if (data?.state === StatementState.Ready && isAuthorized) {
      setRefetchInterval(READY_DOC_REFETCH_TIMEOUT)
    }
  }, [data?.state, isAuthorized])

  useEffect(() => {
    if (isError) {
      externalHandlers.current.onError?.()
      externalHandlers.current = {}
      setRequestArgs(undefined)
    }
  }, [isError])

  useEffect(() => {
    if (!isAuthorized || !data) {
      setRefetchInterval(false)
    }
  }, [data, isAuthorized])

  const generateStatement = useCallback(
    ({ fetchUrl, queryParams, urlParams, onError, onDownload }: GenerateRequestArgs) => {
      const newRequestArgs = {
        url: `${fetchUrl}${urlParams ? `/${urlParams}` : ''}`,
        params: queryParams,
      }

      if (requestArgs && isEqual(newRequestArgs, requestArgs)) {
        openUrlInNewTab(checkRequired(data?.url, 'statement url can not be empty'))
        externalHandlers.current.onDownload?.()
        externalHandlers.current = {}
        setRequestArgs(undefined)
      } else {
        setRequestArgs(newRequestArgs)
        externalHandlers.current = {
          onError,
          onDownload,
        }
      }
    },
    [data?.url, requestArgs],
  )

  return {
    response: isAuthorized ? data : undefined,
    isFetching,
    isError,
    generateStatement,
  }
}
