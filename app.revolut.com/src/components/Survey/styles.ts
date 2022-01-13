import styled from 'styled-components'
import { Flex, Box, DURATIONS } from '@revolut/ui-kit'
import * as React from 'react'
import { themeGet } from 'styled-system'

import { fadeIn } from '../keyframes'

export const SurveyRateWrapper = styled<React.ElementType>(Box).attrs({
  width: '100%',
  bg: 'white',
  maxHeight: '100%',
  flexDirection: 'column',
})`
  border-top: 1px solid ${themeGet('colors.grey-95')};
  bottom: 0;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  animation: ${fadeIn} ${DURATIONS.sm};
  animation-fill-mode: both;
  overflow-y: auto;
`

export const SurveyStarsWrapper = styled(Box).attrs({
  flex: '0 0 11rem',
  height: '11rem',
  width: '100%',
})`
  animation: ${fadeIn} ${DURATIONS.sm};
  animation-fill-mode: both;
`

export const StarButton = styled.button`
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0 0.5rem;
  width: 2rem;
  height: 2rem;
  box-sizing: content-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  &:first-child {
    padding-left: 0;
  }
  &:nth-last-child(2) {
    padding-right: 0;
    /* increase last star's padding to improve its clickability :) */
  }
  &:last-child {
    padding-left: 1rem;
    padding-right: 0;
  }
`

export const SurveyFeedback = styled(Flex).attrs({
  flexDirection: 'column',
  height: '367px',
  flex: '0 0 367px',
  px: '1.5rem',
  width: '100%',
})`
  animation: ${fadeIn} ${DURATIONS.sm};
  animation-fill-mode: both;
`

export const ResolvedAndRatedWrapper = styled<React.ElementType>(Flex).attrs({
  width: '100%',
  height: '100%',
  bg: 'white',
  flexDirection: 'column',
})`
  position: absolute;
  z-index: 1;
  box-sizing: content-box;
  top: -4rem;
  border-radius: 1rem;
`
ResolvedAndRatedWrapper.displayName = 'ResolvedAndRatedWrapper'

export const ChatButtonWrapper = styled(Box)`
  user-select: none;
`
ChatButtonWrapper.displayName = 'ChatButtonWrapper'

export const FloatingButtonWrapper = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 1rem 2rem;
`
FloatingButtonWrapper.displayName = 'FloatingButtonWrapper'
