import { FC, MouseEventHandler } from 'react'
import { Avatar, Box } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'
import { useTranslation } from 'react-i18next'

import { CurrencyItem } from '@revolut/rwa-core-components'

import { ACCOUNT_ITEM_AVATAR_SIZE } from './constants'

type AccountItemProps = {
  currency: string
  amount?: number
  selected?: boolean
  onClick: MouseEventHandler<HTMLDivElement>
}

export const AllAccountsItem: FC<AccountItemProps> = ({
  currency,
  selected,
  onClick,
  amount,
}) => {
  const { t } = useTranslation('pages.Accounts')

  return (
    <Box data-testid="homeWidgetAccountsPopupAllAccountsOption">
      <CurrencyItem
        title={t('Header.allAccounts')}
        currency={currency}
        isSelected={selected}
        onClick={onClick}
        amount={amount}
        avatar={
          <Avatar
            bg="primary"
            color="white"
            size={ACCOUNT_ITEM_AVATAR_SIZE}
            useIcon={Icons.Coins}
          >
            {selected && <Avatar.Badge useIcon={Icons.Check} />}
          </Avatar>
        }
      />
    </Box>
  )
}
