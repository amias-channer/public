import { useMemo, useState, useEffect, useCallback } from 'react'
import { navigate } from '@reach/router'
import { useBoolean, useArray } from 'react-hanger/array'
import { first, isEmpty, last } from 'lodash'
import { useLocation } from '@reach/router'

import {
  staticItemTypes,
  Route,
  REVOLUT_WEBSITE,
  FlowState,
  FlowViewType,
} from '../appConstants'
import { Flow, FlowView, FlowViewItemDymamic, FlowViewItemValue, Footer } from '../types'
import { useIsWidgetMode, useApi } from '../providers'
import { useTransition } from './useTransition'

import { useCamera } from './useCamera'
import validateValue from './validateValue'

export type Values = {
  amountOfLoadedViews: number
  canMoveToTheNext: boolean
  currentView?: FlowView
  currentViewIndex?: number
  errorText?: string
  successText?: string
  history: FlowView['id'][]
  isFetching: boolean
  isFlowDone: boolean
  isFlowNotFound: boolean
  isNoCamera: boolean
  isTransition: boolean
  isViewDataFetching: boolean
  termsAndConditions?: Footer
}

export type Actions = {
  changeViewItemValues: (values: { [itemId: string]: FlowViewItemValue }) => void
  moveToTheNextView: () => void
  moveToThePreviousView: () => void
  setViewDataFetching: (state: boolean) => void
}

export const UNABLE_LOAD_FLOW_TEXT = 'Unable to load the form.'
export const UNABLE_SUBMIT_TEXT = 'Unable to submit the form.'

export default function useFlowPage(
  flowId: string,
  onFlowComplete?: (...args: any) => void,
  onBackButtonClick?: () => void,
): [Values, Actions] {
  const [flow, setFlow] = useState<Flow>()
  const [isFetching, setIsFetching] = useBoolean(true)
  const [errorText, setErrorText] = useState<string | undefined>()
  const [successText, setSuccessText] = useState<string | undefined>()
  const [isFlowDone, isFlowDoneActions] = useBoolean(false)
  const [isFlowNotFound, setIsFlowNotFound] = useBoolean(false)
  const [isNoCamera, setIsNoCamera] = useBoolean(false)
  const [isUpdated, isUpdatedActions] = useBoolean(false)
  const isCameraSupport = useCamera()
  const [isViewDataFetching, setViewDataFetching] = useState(false)
  const [currentView, setCurrentView] = useState<FlowView>()
  const [history, historyActions] = useArray<FlowView['id']>([])
  const isWidgetMode = useIsWidgetMode()
  const api = useApi()
  const { search: queryString } = useLocation()

  const [{ isTransition }, { setTransition }] = useTransition()

  const getFormFlowViews = (item?: Flow) =>
    item?.views?.filter((view): view is FlowView => view.type === FlowViewType.Form)

  useEffect(() => {
    async function fetchFlow() {
      setTransition()

      try {
        const fetchedFlow = await api.loadFlow(flowId, queryString)

        if (!fetchedFlow || isEmpty(fetchedFlow.views)) {
          isWidgetMode ? setIsFlowNotFound.setTrue() : navigate(Route.NotFound)
          return
        }

        if (!fetchedFlow?.views?.length) {
          throw new Error(UNABLE_LOAD_FLOW_TEXT)
        }

        setIsFetching.setFalse()

        setFlow(fetchedFlow)

        const firstView = first(fetchedFlow.views)

        if (firstView && firstView.type === FlowViewType.Form) {
          setCurrentView(firstView)
        }

        if (!isWidgetMode) {
          document.title = `${fetchedFlow.name} | Revolut`
        }

        const formFlowViews = getFormFlowViews(fetchedFlow)
        if (formFlowViews && !isCameraSupport(formFlowViews)) {
          isWidgetMode ? setIsNoCamera.setTrue() : navigate(Route.NoCamera)
        }
      } catch (err) {
        console.error(err)
        setErrorText(UNABLE_LOAD_FLOW_TEXT)
      }
    }

    fetchFlow()
  }, [
    api,
    isWidgetMode,
    setIsFetching,
    setIsFlowNotFound,
    setIsNoCamera,
    isCameraSupport,
    flowId,
    setTransition,
    queryString,
  ])

  const amountOfLoadedViews = flow?.views?.length || 0
  const currentViewIndex = flow?.views?.findIndex(view => view.id === currentView?.id)

  const canMoveToTheNext = useMemo(
    () => {
      const items = getFormFlowViews(flow)?.find(({ id }) => id === currentView?.id)
        ?.items
      isUpdatedActions.setFalse()
      return Boolean(items?.some(validateValue))
    },
    // Use isUpdated flag in deps to trigger validation of values
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flow, currentView, isUpdated],
  )

  const moveToView = useCallback(
    async (viewId: FlowView['id']) => {
      if (!flow || !currentView) {
        return
      }

      setViewDataFetching(true)

      try {
        if (isFlowDone) {
          if (isWidgetMode && onFlowComplete) {
            onFlowComplete()
          } else {
            window.location.assign(REVOLUT_WEBSITE)
          }
          return
        }

        isWidgetMode && setViewDataFetching(true)
        const response = await api.submitFlow({ ...flow, currentViewId: viewId })
        isWidgetMode && setViewDataFetching(false)

        // Handling "destination: chat" forms
        if (isWidgetMode && onFlowComplete && response.id) {
          // Business web:
          if (!response.views) {
            onFlowComplete(response)
            return
          }

          // Retail web:
          if (response.state === FlowState.Complete) {
            const deepLink = response?.views[0]?.dialogActionDeepLink
            if (deepLink) {
              const id = deepLink.split('revolut://app/chat/')[1]
              if (id) {
                onFlowComplete({ id })
                return
              }
            }
          }
        }

        setFlow(response)
        const next = response.views.find(
          (view: Flow) => response.currentViewId === view.id,
        )

        if (response.state === FlowState.Complete) {
          const firstView = response.views?.[0]
          if (firstView?.type === FlowViewType.DeepLink) {
            window.location.assign(firstView.webLink)
          } else {
            isFlowDoneActions.setTrue()
            setSuccessText(response.views[0].title)
            historyActions.clear()
          }
        } else {
          setCurrentView(next)
          historyActions.push(viewId)
        }
      } catch (err) {
        console.error(err)
        setErrorText(flow?.attributes?.failedSubmissionMessage ?? 'Something went wrong')
      } finally {
        setViewDataFetching(false)
      }
    },
    [
      api,
      currentView,
      flow,
      historyActions,
      isFlowDone,
      isFlowDoneActions,
      isWidgetMode,
      onFlowComplete,
    ],
  )

  const moveToTheNextView = useCallback(() => {
    if (currentView) {
      setTransition()
      moveToView(currentView.id)
    }
  }, [currentView, moveToView, setTransition])

  const moveToThePreviousView = useCallback(() => {
    const previousViewId = last(history)

    if (previousViewId) {
      setTransition()
      const view = getFormFlowViews(flow)?.find(item => item.id === previousViewId)
      setCurrentView(view)
      history.pop()
    } else if (onBackButtonClick) {
      onBackButtonClick()
    }
  }, [history, onBackButtonClick, setTransition, flow])

  const termsAndConditions = useMemo(() => currentView?.footer, [currentView]) as Footer

  const changeViewItemValues = useCallback(
    (newValues: { [itemId: string]: any }) => {
      if (!currentView?.id) {
        return
      }

      setFlow(currentFlow => {
        const items = getFormFlowViews(currentFlow)?.find(
          ({ id }) => id === currentView.id,
        )?.items

        const dynamicItems = items?.filter(
          ({ type }) => !staticItemTypes.includes(type),
        ) as FlowViewItemDymamic[]

        Object.keys(newValues).forEach(key => {
          const currentItem = dynamicItems?.find(({ id }) => id === key)

          if (currentItem) {
            currentItem.value = newValues[key]
            isUpdatedActions.setTrue()
          }
        })

        return currentFlow
      })
    },
    [currentView, isUpdatedActions],
  )

  return useMemo(
    () => [
      {
        amountOfLoadedViews,
        canMoveToTheNext,
        currentView,
        currentViewIndex,
        errorText,
        successText,
        history,
        isFetching,
        isFlowDone,
        isFlowNotFound,
        isNoCamera,
        isTransition,
        isViewDataFetching,
        termsAndConditions,
      },
      {
        changeViewItemValues,
        moveToTheNextView,
        moveToThePreviousView,
        setViewDataFetching,
      },
    ],
    [
      amountOfLoadedViews,
      canMoveToTheNext,
      changeViewItemValues,
      currentView,
      currentViewIndex,
      errorText,
      history,
      isFetching,
      isFlowDone,
      isFlowNotFound,
      isNoCamera,
      isTransition,
      isViewDataFetching,
      moveToTheNextView,
      moveToThePreviousView,
      successText,
      termsAndConditions,
    ],
  )
}
