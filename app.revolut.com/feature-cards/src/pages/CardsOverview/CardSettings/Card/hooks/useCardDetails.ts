import { useCallback, useEffect, useState, MouseEvent, useRef, useMemo } from 'react'
import copyToClipboard from 'copy-to-clipboard'
import noop from 'lodash/noop'

import { useModal } from '@revolut/rwa-core-components'

import { useGetUserCardImageData } from './api'

const UNMASKED_IMAGE_HIDE_TIMEOUT = 60_000

export const useCardDetails = (cardId: string) => {
  const [shouldCopyCardNumber, setShouldCopyCardNumber] = useState(false)
  const [shouldShowUnmaskedImage, setShouldShowUnmaskedImage] = useState(false)
  const unmaskedImageHideTimerRef = useRef<number>()

  const [showCardOptionsDialog, cardOptionsDialogProps] = useModal()
  const [showCopiedSuccessPopup, copiedSuccessPopupProps] = useModal()

  const {
    cardNumber,
    unmaskedCardImage,
    verificationStepsProps,
    clearCardImageDataCache,
  } = useGetUserCardImageData({
    id: cardId,
    shouldFetchCardData: shouldCopyCardNumber || shouldShowUnmaskedImage,
  })

  const hideCardDetails = useCallback(() => {
    clearCardImageDataCache()
    setShouldShowUnmaskedImage(false)
  }, [clearCardImageDataCache])

  useEffect(() => {
    if (unmaskedCardImage) {
      // @ts-expect-error
      // FIXME: Rush migration
      unmaskedImageHideTimerRef.current = setTimeout(
        hideCardDetails,
        UNMASKED_IMAGE_HIDE_TIMEOUT,
      )

      return () => {
        clearTimeout(unmaskedImageHideTimerRef.current)
      }
    }

    return noop
  }, [hideCardDetails, unmaskedCardImage])

  useEffect(() => {
    if (!verificationStepsProps.verificationMethod && !unmaskedCardImage) {
      setShouldShowUnmaskedImage(false)
    }
  }, [unmaskedCardImage, verificationStepsProps.verificationMethod])

  useEffect(() => {
    if (!verificationStepsProps.verificationMethod && !cardNumber) {
      setShouldCopyCardNumber(false)
    }
  }, [cardNumber, verificationStepsProps.verificationMethod])

  useEffect(() => {
    if (cardNumber && shouldCopyCardNumber) {
      copyToClipboard(cardNumber)
      showCopiedSuccessPopup()

      if (!shouldShowUnmaskedImage) {
        clearCardImageDataCache()
      }

      setShouldCopyCardNumber(false)
    }
  }, [
    cardNumber,
    clearCardImageDataCache,
    shouldCopyCardNumber,
    shouldShowUnmaskedImage,
    showCopiedSuccessPopup,
  ])

  const handleOpenCardOptionsDialog = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    showCardOptionsDialog()
  }

  const handleShowCardDetails = () => {
    setShouldShowUnmaskedImage(true)
  }

  const handleCopyCardNumberToClipboard = () => {
    setShouldCopyCardNumber(true)
  }

  return {
    cardOptionsDialogProps: useMemo(
      () => ({
        ...cardOptionsDialogProps,
        onCopyCardNumber: handleCopyCardNumberToClipboard,
        onShowCardDetails: handleShowCardDetails,
        onHideCardDetails: hideCardDetails,
      }),
      [cardOptionsDialogProps, hideCardDetails],
    ),
    copiedSuccessPopupProps,
    isCardDetailsRevealed: shouldShowUnmaskedImage && Boolean(unmaskedCardImage),
    unmaskedCardImage,
    verificationStepsProps,
    onOpenCardOptionsDialog: handleOpenCardOptionsDialog,
  }
}
