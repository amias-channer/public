import { AxiosError } from 'axios'
import { FC, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import * as Icons from '@revolut/icons'
import { Box, Button, Flex, Media, TextBox, TextButton } from '@revolut/ui-kit'

import { H2, PrimaryButton, Spacer } from '@revolut/rwa-core-components'
import { trackEvent, SignInTrackingEvent } from '@revolut/rwa-core-analytics'
import { COLORS } from '@revolut/rwa-core-styles'
import { GeneralErrorDto } from '@revolut/rwa-core-types'
import {
  ApiErrorCode,
  checkRequired,
  HttpCode,
  IconSize,
  Url,
  useNavigateToErrorPage,
  getApiErrorCode,
} from '@revolut/rwa-core-utils'
import { redirectAfterSignIn, useAuthContext } from '@revolut/rwa-core-auth'

import { useHideCookiesBannerOnMount } from 'hooks'

import { SelfieHeading } from '../components'
import { I18N_NAMESPACE, RequestScopedTokenScreen } from '../constants'
import { FaceMask } from '../FaceMask'
import { RequestScopedTokenContext } from '../RequestScopedTokenProvider'
import { RequestScopedTokenScreenProps } from '../types'
import { base64ImageToBlob } from '../utils'
import { SUBMIT_SELFIE_BUTTON_TEST_ID } from './constants'
import { useUploadSelfie } from './hooks'
import {
  ActionsContainerStyled,
  BackButton,
  ContainerStyled,
  SelfieImageStyled,
  SubmitSelfieButtonStyled,
} from './styled'

const isUserUnauthorized = (status?: HttpCode) => status === HttpCode.Unauthorized

export const ConfirmSelfieScreen: FC<RequestScopedTokenScreenProps> = ({
  onScreenChange,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { selfie } = useContext(RequestScopedTokenContext)
  const { signInFlowChannel } = useAuthContext()
  const history = useHistory()
  const navigateToErrorPage = useNavigateToErrorPage()

  const { uploadSelfie, isUploading: isSubmitSelfieLoading } = useUploadSelfie()

  useHideCookiesBannerOnMount()

  const handleBackButtonClick = () => {
    onScreenChange(RequestScopedTokenScreen.TakeSelfie)
  }

  const handleSubmitSuccess = () => {
    trackEvent(SignInTrackingEvent.selfieSubmissionSuccess, {
      source: signInFlowChannel,
    })
    history.push(redirectAfterSignIn.restoreUrl())
  }

  const handleSubmitError = (error?: AxiosError<GeneralErrorDto>) => {
    const apiErrorCode = error ? getApiErrorCode(error) : undefined

    trackEvent(SignInTrackingEvent.selfieSubmissionFailed, {
      source: signInFlowChannel,
      reason: apiErrorCode,
    })

    const shouldRedirectToErrorScreen =
      (!apiErrorCode && isUserUnauthorized(error?.response?.status)) ||
      !error?.response?.status

    if (shouldRedirectToErrorScreen) {
      navigateToErrorPage(error ?? 'Unknown selfie submission error')
      return
    }

    if (!apiErrorCode) {
      onScreenChange(RequestScopedTokenScreen.SelfieUploadFailedScreen)

      return
    }

    switch (apiErrorCode) {
      case ApiErrorCode.ActionRequiresKyc:
        history.push(Url.VerifyYourIdentity)
        break
      case ApiErrorCode.SelfieNotMatch:
        onScreenChange(RequestScopedTokenScreen.SelfieDidNotMatch)
        break
      case ApiErrorCode.IdentityVerificationFailed:
        onScreenChange(RequestScopedTokenScreen.IdentityVerificationFailed)
        break
      default:
        onScreenChange(RequestScopedTokenScreen.SelfieUploadFailedScreen)
    }
  }

  const handleSubmitSelfieButtonClick = async () => {
    const selfieBlob = await base64ImageToBlob(
      checkRequired(selfie, '"selfie" can not be empty'),
    )

    await uploadSelfie({
      selfieBlob,
      onSuccess: handleSubmitSuccess,
      onError: handleSubmitError,
    })
  }

  return (
    <ContainerStyled>
      <SelfieImageStyled src={selfie} alt="" />
      <FaceMask bg={COLORS.primaryWhite} opacity={1.0} />

      <SelfieHeading>
        <BackButton onClick={handleBackButtonClick} />
        <Spacer h="px8" />
        <H2>{t('ConfirmSelfieScreen.title')}</H2>
        <Spacer h="px8" />
        <TextBox fontSize="smaller" color="textInactive">
          {t('ConfirmSelfieScreen.description')}
        </TextBox>
      </SelfieHeading>

      <ActionsContainerStyled>
        <Box hide="*-md">
          <SubmitSelfieButtonStyled
            data-testid={`${SUBMIT_SELFIE_BUTTON_TEST_ID}.desktop`}
            disabled={isSubmitSelfieLoading}
            isLoading={isSubmitSelfieLoading}
            onClick={handleSubmitSelfieButtonClick}
          >
            <Box>
              <Media alignItems="center">
                <Icons.Check size={IconSize.Medium} />
                <Media.Content ml="px10">
                  {t('ConfirmSelfieScreen.submitButtonText.desktop')}
                </Media.Content>
              </Media>
            </Box>
          </SubmitSelfieButtonStyled>

          <Spacer h={{ _: 'px20', md: 'px28' }} />

          <TextButton disabled={isSubmitSelfieLoading} onClick={handleBackButtonClick}>
            <Media alignItems="center">
              <Icons.Retry size={IconSize.Medium} />
              <Media.Content ml="px10">
                {t('ConfirmSelfieScreen.retakePhotoButtonText.desktop')}
              </Media.Content>
            </Media>
          </TextButton>
        </Box>

        <Flex width="100%" hide="md-*">
          <Button
            disabled={isSubmitSelfieLoading}
            onClick={handleBackButtonClick}
            variant="secondary"
            mr="px10"
          >
            {t('ConfirmSelfieScreen.retakePhotoButtonText.mobile')}
          </Button>
          <PrimaryButton
            data-testid={`${SUBMIT_SELFIE_BUTTON_TEST_ID}.mobile`}
            disabled={isSubmitSelfieLoading}
            isLoading={isSubmitSelfieLoading}
            onClick={handleSubmitSelfieButtonClick}
          >
            {t('ConfirmSelfieScreen.submitButtonText.mobile')}
          </PrimaryButton>
        </Flex>
      </ActionsContainerStyled>
    </ContainerStyled>
  )
}
