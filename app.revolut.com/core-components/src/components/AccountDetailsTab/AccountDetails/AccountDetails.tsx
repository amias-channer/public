import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Details, Text, Widget } from '@revolut/ui-kit'

import { AccountDetail, AccountDetailsType } from '../types'
import { I18N_NAMESPACE } from './constants'
import { Detail } from './Detail'
import { CopyDetailsButton } from './CopyDetailsButton'

type AccountDetailsProps = {
  details: AccountDetail[]
  tab: AccountDetailsType
  bg?: string
}

export const AccountDetails: FC<AccountDetailsProps> = ({ tab, details }) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return (
    <Box>
      <Details>
        <Details.Title>
          {t(`facelift.TopUpViaBankTransferScreen.AccountDetails.${tab}.title`)}
        </Details.Title>
        <Details.Content>
          <Text use="p" fontSize="caption" fontWeight="bolder">
            <CopyDetailsButton details={details} />
          </Text>
        </Details.Content>
      </Details>

      <Widget data-testid="account-details-container">
        <Box px="16px">
          {details.map((detail) => (
            <Detail key={detail.title} detail={detail} />
          ))}
        </Box>
      </Widget>
    </Box>
  )
}
