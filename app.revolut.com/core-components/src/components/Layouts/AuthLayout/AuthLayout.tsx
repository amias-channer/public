import isString from 'lodash/isString'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex } from '@revolut/ui-kit'

import { H2 } from '../../H2'
import { MobileAppBanner } from '../../MobileAppBanner'
import { Paragraph } from '../../Paragraph'
import { Spacer } from '../../Spacer'
import { TextBox } from '../../TextBox'
import {
  ButtonsBox,
  CenterContentContainer,
  ContainerStyled,
  InnerContainerStyled,
  PrimaryButtonStyled,
  SecondaryButtonStyled,
  StyledBackButton,
  StyledCloseButton,
  Subtitle,
} from './styled'
import { AuthLayoutProps } from './types'

export enum AuthLayoutTestId {
  BackButton = 'back-button',
  CloseButton = 'close-button',
}

export const AuthLayout: FC<AuthLayoutProps> = ({
  className,
  title,
  subtitle,
  description,
  illustration,
  centerContent = false,
  children,
  submitButton,
  submitButtonText,
  submitButtonEnabled = false,
  submitButtonLoading = false,
  handleSubmitButtonClick,
  secondaryButtonText,
  secondaryButtonEnabled = true,
  handleSecondaryButtonClick,
  handleBackButtonClick,
  handleCloseButtonClick,
}) => {
  const { t } = useTranslation('components.AuthLayout')
  const ContentWrapper = centerContent ? CenterContentContainer : Paragraph

  return (
    <>
      <MobileAppBanner />
      <ContainerStyled>
        {handleBackButtonClick && (
          <StyledBackButton
            data-testid={AuthLayoutTestId.BackButton}
            onClick={handleBackButtonClick}
          />
        )}
        {handleCloseButtonClick && (
          <StyledCloseButton
            data-testid={AuthLayoutTestId.CloseButton}
            onClick={handleCloseButtonClick}
          />
        )}

        <InnerContainerStyled
          className={className}
          pt={{ _: 'px60', tablet: 'px100' }}
          pb="px120"
        >
          {isString(title) ? <H2>{title}</H2> : title}
          {subtitle && <Subtitle>{subtitle}</Subtitle>}

          {description && (
            <Paragraph>
              <TextBox>{description}</TextBox>
            </Paragraph>
          )}

          <Spacer h={{ _: 'px24', tablet: 'px32' }} />
          <ContentWrapper>{children}</ContentWrapper>

          <ButtonsBox>
            {submitButton ||
              (handleSubmitButtonClick && (
                <PrimaryButtonStyled
                  disabled={!submitButtonEnabled || submitButtonLoading}
                  isLoading={submitButtonLoading}
                  onClick={handleSubmitButtonClick}
                >
                  {submitButtonText || t('buttonText')}
                </PrimaryButtonStyled>
              ))}
            {handleSecondaryButtonClick && (
              <>
                <Spacer h="px32" />
                <SecondaryButtonStyled
                  disabled={!secondaryButtonEnabled}
                  onClick={handleSecondaryButtonClick}
                >
                  {secondaryButtonText}
                </SecondaryButtonStyled>
              </>
            )}
          </ButtonsBox>
        </InnerContainerStyled>

        {illustration && (
          <Flex flex={1} justifyContent="flex-end" hide="*-xl">
            {illustration}
          </Flex>
        )}
      </ContainerStyled>
    </>
  )
}
