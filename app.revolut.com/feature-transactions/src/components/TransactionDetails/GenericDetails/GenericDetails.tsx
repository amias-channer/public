import { VFC } from 'react'
import { Group } from '@revolut/ui-kit'

import { GoogleMapPointer } from '@revolut/rwa-core-components'
import { TransactionDto } from '@revolut/rwa-core-types'

import { DetailsGeneral, DetailsExchange, DetailsCard, GroupWrapper } from '../components'

type GenericDetailsProps = {
  transaction: TransactionDto
  transactionFee: string
}

const getFullBaseAmount = (transaction: TransactionDto) =>
  transaction.amount - transaction.fee

export const GenericDetails: VFC<GenericDetailsProps> = ({
  transaction,
  transactionFee,
}) => {
  return (
    <>
      {transaction.merchant?.address && (
        <GroupWrapper>
          <GoogleMapPointer address={transaction.merchant?.address} />
        </GroupWrapper>
      )}

      <GroupWrapper>
        <Group>
          <DetailsGeneral transaction={transaction} />

          {transaction.counterpart?.currency &&
            transaction.counterpart?.currency !== transaction.currency && (
              <DetailsExchange
                baseAmount={getFullBaseAmount(transaction)}
                currencyFrom={transaction.currency}
                currencyTo={transaction.counterpart.currency}
                fee={transactionFee}
                rate={transaction.rate}
                targetAmount={transaction.counterpart.amount}
              />
            )}

          {transaction.card && <DetailsCard card={transaction.card} />}
        </Group>
      </GroupWrapper>
    </>
  )
}
