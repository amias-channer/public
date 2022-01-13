import { useCallback, useContext } from 'react'

import { TopUpContext } from '../../TopUpProvider'
import { FormValues } from '../form'
import { UseHandleFormSubmitArgs } from '../types'
import { useTopupByLinkedExternalCard } from './useTopupByLinkedExternalCard'
import { useTopupByNewExternalCard } from './useTopupByNewExternalCard'

export const useHandleFormSubmit = ({ onSuccess, onError }: UseHandleFormSubmitArgs) => {
  const { amount, linkedCard } = useContext(TopUpContext)

  const topupByNewExternalCard = useTopupByNewExternalCard({ onSuccess, onError })
  const topupByLinkedExternalCard = useTopupByLinkedExternalCard({ onSuccess, onError })

  return useCallback(
    (formValues: FormValues) => {
      return linkedCard
        ? topupByLinkedExternalCard(formValues, amount, linkedCard)
        : topupByNewExternalCard(formValues, amount)
    },
    [amount, linkedCard, topupByLinkedExternalCard, topupByNewExternalCard],
  )
}
