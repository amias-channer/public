import { AxiosError } from 'axios'
import { useCallback } from 'react'
import { useQueryClient, useMutation } from 'react-query'

import { CardItemDto, CardDeliveryUpdateErrorDto } from '@revolut/rwa-core-types'
import { QueryKey, useNavigateToErrorPage } from '@revolut/rwa-core-utils'

import { getCardDeliveryMethods, updateCardDeliverySettings } from '../../../api'
import { UpdateCardDeliverySettingsArgs } from '../../../api/cards'

type UseGetCardDeliveryMethodsArgs = {
  cardId: string
  country: string
  postcode: string
}

export const useGetCardDeliveryMethods = () => {
  const navigateToErrorPage = useNavigateToErrorPage()
  const queryClient = useQueryClient()

  return useCallback(
    (params: UseGetCardDeliveryMethodsArgs) =>
      queryClient
        .fetchQuery([QueryKey.CardDeliveryMethods, params], () =>
          getCardDeliveryMethods(params),
        )
        .catch((error) => {
          navigateToErrorPage(error)

          return { deliveryMethods: undefined }
        }),
    [queryClient, navigateToErrorPage],
  )
}

export const useUpdateCardDeliverySettings = () => {
  const { mutate, error } = useMutation<
    CardItemDto,
    AxiosError<CardDeliveryUpdateErrorDto>,
    UpdateCardDeliverySettingsArgs
  >(updateCardDeliverySettings)

  return {
    updateCardDeliverySettings: mutate,
    errorParams: error?.response?.data?.params,
  }
}
