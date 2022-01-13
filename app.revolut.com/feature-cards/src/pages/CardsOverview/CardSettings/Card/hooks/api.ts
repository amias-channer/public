import { useEffect, useRef } from 'react'
import { useQuery } from 'react-query'

import { useHandleVerificationProcess } from '@revolut/rwa-core-auth'
import { ConfigKey, FeatureKey, getConfigValue } from '@revolut/rwa-core-config'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'
import {
  HttpHeader,
  QueryKey,
  decryptImage,
  decryptText,
  useNavigateToErrorPage,
} from '@revolut/rwa-core-utils'

import { getUserCardImageData, getUserCardImageDataV2 } from '../../../../../api'

export const useGetUserCardImageData = ({
  id,
  shouldFetchCardData,
}: {
  id: string
  shouldFetchCardData: boolean
}) => {
  const isCookieAuth = getConfigValue<boolean>(ConfigKey.CookieAuth)
  const { isFeatureActive } = useFeaturesConfig()
  const navigateToErrorPage = useNavigateToErrorPage()
  const decryptionKeyRef = useRef<string>()

  const {
    config,
    onError: handleVerificationError,
    onSuccess: handleVerificationPassed,
    verificationStepsProps,
  } = useHandleVerificationProcess((error) => navigateToErrorPage(error))

  const handleSuccess = () => {
    if (config) {
      decryptionKeyRef.current = config.headers[HttpHeader.VerifyCode]
    }

    handleVerificationPassed()
  }

  const { data, remove, refetch } = useQuery(
    [QueryKey.UserCardImageData, id],
    () =>
      (isCookieAuth ? getUserCardImageDataV2 : getUserCardImageData)({
        cardId: id,
        config,
      }),
    {
      cacheTime: 0,
      enabled: isFeatureActive(FeatureKey.ShowCardDetails) && shouldFetchCardData,
      refetchOnWindowFocus: false,
      retry: false,
      onError: handleVerificationError,
      onSuccess: handleSuccess,
    },
  )

  useEffect(() => {
    const checkAndRefetchWithAuthData = () => {
      if (config) {
        refetch()
      }
    }

    checkAndRefetchWithAuthData()
  }, [config, refetch])

  return {
    cardNumber: data ? decryptText(data.pan, decryptionKeyRef.current) : undefined,
    unmaskedCardImage: data
      ? decryptImage(data.image, decryptionKeyRef.current)
      : undefined,
    verificationStepsProps,
    clearCardImageDataCache: remove,
  }
}
