import React, { FC, useContext } from 'react'
import { Flex, Loader, mq, StatusPopup } from '@revolut/ui-kit'
import { RouteComponentProps } from '@reach/router'
import styled from 'styled-components'

import { ErrorPage } from '../ErrorPage'
import { NotFoundPage } from '../NotFoundPage'
import { NoCameraPage } from '../NoCameraPage'
import {
  FlowContextProvider,
  useIsWidgetMode,
  NavigationObstacleContext,
} from '../providers'

import ContinueButton from './ContinueButton'
import ControlsView from './ControlsView'
import Navbar from './Navbar'
import useFlowPage from './useFlowPage'

type Props = RouteComponentProps & {
  flowId: string
  onFlowComplete?: (...args: any[]) => void
  onBackButtonClick?: () => void
}

const ContainerStyled = styled(Flex)<{ isWidgetMode?: boolean }>`
  flex-direction: column;
  margin: 0 auto;
  height: 100%;
  width: ${props => (props.isWidgetMode ? '100%' : '536px')};
  padding: 0;

  @media ${mq('*-md')} {
    width: 100%;
    padding: ${props => (props.isWidgetMode ? '0' : '0 1rem')};
  }
`

export const LOADER_TESTID = 'loader-testid'

export const FlowPage: FC<Props> = ({ flowId, onFlowComplete, onBackButtonClick }) => {
  const isWidgetMode = useIsWidgetMode()
  const { navigationObstacle } = useContext(NavigationObstacleContext)
  const [
    {
      canMoveToTheNext,
      currentView,
      errorText,
      successText,
      history,
      isFetching,
      isFlowNotFound,
      isNoCamera,
      isTransition,
      isViewDataFetching,
      isFlowDone,
      termsAndConditions,
    },
    {
      changeViewItemValues,
      moveToTheNextView,
      moveToThePreviousView,
      setViewDataFetching,
    },
  ] = useFlowPage(flowId, onFlowComplete, onBackButtonClick)

  const backHidden = history.length === 0 && !onBackButtonClick
  const continueDisabled = !canMoveToTheNext || isViewDataFetching || isFlowDone

  if (isFlowNotFound) {
    return <NotFoundPage />
  }

  if (isNoCamera) {
    return <NoCameraPage />
  }

  if (errorText) {
    return isWidgetMode ? (
      <ContainerStyled isWidgetMode>
        <Navbar backHidden={false} moveToThePreviousView={moveToThePreviousView} />
        <ErrorPage text={errorText} />
      </ContainerStyled>
    ) : (
      <ErrorPage text={errorText} />
    )
  }

  if (isFetching) {
    return (
      <ContainerStyled isWidgetMode={isWidgetMode}>
        <Flex height="100%" data-testid={LOADER_TESTID}>
          <Loader m="auto" size={120} color="grey-80" />
        </Flex>
      </ContainerStyled>
    )
  }

  const tryMoveToTheNextView = () => {
    if (navigationObstacle) {
      navigationObstacle(moveToTheNextView)
    } else {
      moveToTheNextView()
    }
  }

  return (
    <FlowContextProvider flowId={flowId} moveToTheNextView={moveToTheNextView}>
      <ContainerStyled isWidgetMode={isWidgetMode}>
        <Navbar backHidden={backHidden} moveToThePreviousView={moveToThePreviousView} />
        {currentView && (
          <>
            <ControlsView
              key={currentView.id}
              changeViewItemValues={changeViewItemValues}
              isTransition={isTransition}
              setDataFetching={setViewDataFetching}
              view={currentView}
            />
            <ContinueButton
              disabled={continueDisabled}
              onClick={tryMoveToTheNextView}
              termsAndConditions={termsAndConditions}
              nextText={currentView.nextText}
            />
          </>
        )}
      </ContainerStyled>
      <StatusPopup
        variant="success-optional"
        onExit={moveToTheNextView}
        isOpen={isFlowDone}
      >
        <StatusPopup.Title>{successText}</StatusPopup.Title>
      </StatusPopup>
    </FlowContextProvider>
  )
}
