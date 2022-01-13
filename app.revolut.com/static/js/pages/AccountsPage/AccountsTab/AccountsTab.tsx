import { FC } from 'react'
import { Box } from '@revolut/ui-kit'

import { IncidentBanners } from 'components'
import { useGetPendingCardPayment } from 'hooks'

import { AccountList } from '../AccountList'
import { PendingActions } from '../PendingActions'
import { PocketConvertedForDisplay } from '../types'
import { GridStyled } from './styled'

type AccountsTabProps = {
  pockets: PocketConvertedForDisplay[]
}

export const AccountsTab: FC<AccountsTabProps> = ({ pockets }) => {
  const { pendingCardPayment } = useGetPendingCardPayment()

  const isCardPaymentRequired = Boolean(pendingCardPayment)

  return (
    <GridStyled maxWidth="60rem">
      <Box>
        <IncidentBanners />
        {isCardPaymentRequired && <PendingActions />}
        <AccountList pockets={pockets} />
      </Box>
    </GridStyled>
  )
}
