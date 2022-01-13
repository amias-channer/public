import { FC } from 'react'
import { Header, Text, Flex } from '@revolut/ui-kit'

import { Time } from '@revolut/rwa-core-components'
import { TransactionDto } from '@revolut/rwa-core-types'
import { getFormattedDate } from '@revolut/rwa-core-utils'

import { getMoneyProps } from '../../../utils'
import { MoneyLabel } from '../../MoneyLabel'
import { TransactionAvatar } from '../../TransactionAvatar'
import { HeaderSubtitle } from './HeaderSubtitle'
import { HeaderActions } from './HeaderActions'

type Props = {
  transaction: TransactionDto
  onBackButtonClick?: VoidFunction
}

export const DetailsHeader: FC<Props> = ({ transaction, onBackButtonClick }) => {
  return (
    <Header variant="item">
      {onBackButtonClick ? (
        <Header.BackButton onClick={onBackButtonClick} />
      ) : (
        <Header.CloseButton />
      )}

      <Header.Avatar>
        <TransactionAvatar transaction={transaction} />
      </Header.Avatar>

      <Header.Title>
        <MoneyLabel {...getMoneyProps(transaction).main} />
      </Header.Title>

      <Header.Subtitle>
        <HeaderSubtitle transaction={transaction} />
      </Header.Subtitle>

      <Header.Description>
        <Flex>
          <Text mr="s-8">{getFormattedDate(new Date(transaction.startedDate))}</Text>{' '}
          <Time value={transaction.startedDate} />
        </Flex>
      </Header.Description>

      <HeaderActions transaction={transaction} />
    </Header>
  )
}
