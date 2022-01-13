import { FC, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { TextBox } from '@revolut/ui-kit'
import Webcam from 'react-webcam'

import { H2, Spacer } from '@revolut/rwa-core-components'
import { COLORS } from '@revolut/rwa-core-styles'
import { checkRequired } from '@revolut/rwa-core-utils'

import { useHideCookiesBannerOnMount } from 'hooks'

import { I18N_NAMESPACE, VIDEO_CONSTRAINTS, RequestScopedTokenScreen } from '../constants'
import { FaceMask } from '../FaceMask'
import { RequestScopedTokenContext } from '../RequestScopedTokenProvider'
import { RequestScopedTokenScreenProps } from '../types'
import { SCREENSHOT_FORMAT } from './constants'
import { BackButton, ContainerStyled, WebcamStyled, Heading } from './styled'
import { TakeSelfieButton } from './TakeSelfieButton'
import { WebcamInstance } from './types'

export const WEBCAM_TEST_ID = 'Webcam'

export const TakeSelfieScreen: FC<RequestScopedTokenScreenProps> = ({
  onScreenChange,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { setSelfie } = useContext(RequestScopedTokenContext)
  const webcamRef = useRef<Webcam>(null)

  useHideCookiesBannerOnMount()

  const stopWebcam = () => {
    const webcam = webcamRef.current

    if (!webcam || !webcam.video) {
      return
    }

    const videoSrcObject = webcam.video.srcObject

    if (!videoSrcObject) {
      return
    }

    const stream = videoSrcObject as MediaStream

    // for unsupported browsers
    if (!stream.getTracks) {
      return
    }

    const tracks = stream.getTracks()

    tracks.forEach((track) => track.stop())
    webcam.video.srcObject = null
  }

  const handleBackButtonClick = () => {
    onScreenChange(RequestScopedTokenScreen.BeforeYouStart)
  }

  const handleTakeSelfieButtonClick = () => {
    const webcamInstance: WebcamInstance = checkRequired(
      webcamRef.current,
      '"webcamInstance" can not be empty',
    )

    const screenshot = webcamInstance.getScreenshot()

    if (!screenshot) {
      // Camera is still initializing
      return
    }

    setSelfie(screenshot)
    stopWebcam()
    onScreenChange(RequestScopedTokenScreen.ConfirmSelfie)
  }

  return (
    <ContainerStyled>
      <WebcamStyled
        data-testid={WEBCAM_TEST_ID}
        ref={webcamRef}
        mirrored
        audio={false}
        screenshotFormat={SCREENSHOT_FORMAT}
        videoConstraints={VIDEO_CONSTRAINTS}
      />
      <FaceMask bg={COLORS.primaryBlack} opacity={0.8} />
      <TakeSelfieButton onClick={handleTakeSelfieButtonClick} />

      <Heading>
        <BackButton onClick={handleBackButtonClick} />
        <Spacer h="px8" />
        <H2>{t('TakeSelfieScreen.title')}</H2>
        <TextBox>{t('TakeSelfieScreen.description')}</TextBox>
      </Heading>
    </ContainerStyled>
  )
}
