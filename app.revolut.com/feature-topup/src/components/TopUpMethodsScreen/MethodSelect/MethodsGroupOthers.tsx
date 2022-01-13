import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { I18N_NAMESPACE, TopUpMethod } from '../../constants'
import { getTopUpMethodProps } from '../utils'
import { MethodsGroup } from './MethodsGroup'
import { MethodsGroupItem } from './MethodsGroupItem'
import { TopUpMethodOnChangeArgs } from './types'

type MethodsGroupOthersProps = {
  hasLinkedCards: boolean
  showApplePay: boolean
  showGooglePay: boolean
  onSelect: (args: TopUpMethodOnChangeArgs) => void
}

export const MethodsGroupOthers: FC<MethodsGroupOthersProps> = ({
  hasLinkedCards,
  showApplePay,
  showGooglePay,
  onSelect,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return (
    <MethodsGroup
      groupTitle={
        hasLinkedCards
          ? t('facelift.TopUpMethodsScreen.MethodSelect.popup.group.others.title')
          : undefined
      }
      isFirst={!hasLinkedCards}
    >
      {!hasLinkedCards && (
        <MethodsGroupItem
          {...getTopUpMethodProps(t, { method: TopUpMethod.DebitOrCreditCard })}
          onClick={() => onSelect({ method: TopUpMethod.DebitOrCreditCard })}
        />
      )}

      <MethodsGroupItem
        {...getTopUpMethodProps(t, { method: TopUpMethod.RegularBankTransfer })}
        onClick={() => onSelect({ method: TopUpMethod.RegularBankTransfer })}
      />

      {showApplePay && (
        <MethodsGroupItem
          {...getTopUpMethodProps(t, { method: TopUpMethod.ApplePay })}
          onClick={() => onSelect({ method: TopUpMethod.ApplePay })}
        />
      )}

      {showGooglePay && (
        <MethodsGroupItem
          {...getTopUpMethodProps(t, { method: TopUpMethod.GooglePay })}
          onClick={() => onSelect({ method: TopUpMethod.GooglePay })}
        />
      )}
    </MethodsGroup>
  )
}
