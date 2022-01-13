import { VFC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TextButton } from '@revolut/ui-kit'

import { TransactionDto } from '@revolut/rwa-core-types'
import { getBeneficiaryName } from '@revolut/rwa-core-utils'

import { useLocalisedTransactionData } from '../../../../hooks'
import { I18N_NAMESPACE } from '../../constants'

type HeaderSubtitleProps = {
  transaction: TransactionDto
}

export const HeaderSubtitle: VFC<HeaderSubtitleProps> = ({ transaction }) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { getTitle } = useLocalisedTransactionData(transaction)

  const beneficiaryName = getBeneficiaryName(transaction)

  if (beneficiaryName) {
    return (
      <Trans
        t={t}
        i18nKey="transferTo.title"
        values={{
          beneficiaryName,
        }}
        components={{
          action: <TextButton />,
        }}
      />
    )
  }

  return <>{getTitle()}</>
}
