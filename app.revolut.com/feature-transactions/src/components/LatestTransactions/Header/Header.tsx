import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Subheader, Action } from '@revolut/ui-kit'
import { getTransactionsListUrl } from '@revolut/rwa-core-utils'

type Props = {
  shouldShowSeeAllButton: boolean
  accountId?: string
}

export const Header: FC<Props> = ({ shouldShowSeeAllButton, accountId }) => {
  const { t } = useTranslation('components.LatestTransactions')

  return (
    <Subheader>
      <Subheader.Title>{t('header.title')}</Subheader.Title>
      <Subheader.Side>
        {shouldShowSeeAllButton && (
          <Action use={Link} to={getTransactionsListUrl(accountId)}>
            {t('button.seeAll')}
          </Action>
        )}
      </Subheader.Side>
    </Subheader>
  )
}
