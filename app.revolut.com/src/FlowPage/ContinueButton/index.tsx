import React, { FC, MouseEventHandler } from 'react'
import ReactMarkdown from 'react-markdown/with-html'
import { Button } from '@revolut/ui-kit'

import { Footer } from '../../types'
import { useIsContinueButtonVisible, useIsWidgetMode } from '../../providers'

import { BoxStyled, TextStyled, InnerBoxWrapperStyled } from './styled'

const CONTINUE_BUTTON_WIDTH = '343px'

type Props = {
  disabled?: boolean
  nextText?: string
  onClick: MouseEventHandler<HTMLButtonElement>
  termsAndConditions?: Footer
}

export const BUTTON_CONTINUE_TESTID = 'button-continue-testid'
export const TERMS_TEXT_TESTID = 'terms-text-testid'

const ContinueButton: FC<Props> = ({
  onClick,
  termsAndConditions,
  disabled,
  nextText,
}) => {
  const isContinueButtonVisible = useIsContinueButtonVisible()
  const isWidgetMode = useIsWidgetMode()

  if (!isContinueButtonVisible) {
    return null
  }

  const continueButton = (
    <Button
      data-testid={BUTTON_CONTINUE_TESTID}
      elevation
      disabled={disabled}
      title={nextText || 'Continue'}
      onClick={onClick}
    >
      {nextText || 'Continue'}
    </Button>
  )

  return (
    <BoxStyled>
      <InnerBoxWrapperStyled width={isWidgetMode ? 'auto' : CONTINUE_BUTTON_WIDTH}>
        {termsAndConditions && (
          <TextStyled data-testid={TERMS_TEXT_TESTID}>
            <ReactMarkdown source={termsAndConditions.value} escapeHtml={false} />
          </TextStyled>
        )}
        {continueButton}
      </InnerBoxWrapperStyled>
    </BoxStyled>
  )
}

export default ContinueButton
