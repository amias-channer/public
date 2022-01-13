import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DetailsCell, Group } from '@revolut/ui-kit'

import { AccountFieldType } from '@revolut/rwa-core-types'

import { getFieldValueByAccountKey, mapAccountKeyToLokaliseKey } from './utils'

type Props = {
  account: Partial<Record<AccountFieldType, string>>
}

export const BENEFICIARY_ACCOUNT_FIELD_TEST_ID = 'beneficiary-account-field'

export const BeneficiaryAccountDetails: FC<Props> = ({ account, children }) => {
  const { t } = useTranslation('components.BeneficiaryAccount')
  const fields = Object.entries(account) as Array<[AccountFieldType, string]>

  return (
    <Group>
      {fields.map(([key, value]) => {
        const lokaliseKey = mapAccountKeyToLokaliseKey(key)
        const fieldValue = getFieldValueByAccountKey(key, value)

        return (
          lokaliseKey && (
            <DetailsCell key={key} data-testid={BENEFICIARY_ACCOUNT_FIELD_TEST_ID}>
              <DetailsCell.Title>{t(lokaliseKey)}</DetailsCell.Title>
              <DetailsCell.Content>{fieldValue}</DetailsCell.Content>
            </DetailsCell>
          )
        )
      })}

      {children}
    </Group>
  )
}
