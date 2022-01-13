import { FC } from 'react'
import { Box, Subheader, Group, Text } from '@revolut/ui-kit'
import { useTranslation } from 'react-i18next'

import { I18nNamespace } from '@revolut/rwa-core-utils'
import { TransactionDto } from '@revolut/rwa-core-types'

import { TransactionCard } from '../../components'

type Props = {
  transactions: TransactionDto[]
}

export const SuspiciousTransactionsGroup: FC<Props> = ({ transactions }) => {
  const { t } = useTranslation(['pages.TransactionsList', I18nNamespace.Domain])

  return (
    <Box mb="s-16" role="suspicious-transactions-group">
      <Subheader>
        <Subheader.Title>
          {t('pages.TransactionsList:groupHeaders.suspicious')}
        </Subheader.Title>
      </Subheader>
      <Group>
        {transactions.map((transaction) => (
          <TransactionCard
            transaction={transaction}
            key={transaction.legId}
            showDate
            additionalText={
              <Text color="warning">
                {t(`${I18nNamespace.Domain}:card-suspicious-was_this_you`)}
              </Text>
            }
          />
        ))}
      </Group>
    </Box>
  )
}
