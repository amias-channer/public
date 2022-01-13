import { Box } from '@revolut/ui-kit'

import { EmptyStateCard, FormattedMessage } from '@revolut/rwa-core-components'

type Props = {
  outlined?: boolean
}

export const TransactionsListEmptyState = ({ outlined = true }: Props) => (
  <Box data-testid="transactions-list-empty-state" mt={3} mb={2}>
    <EmptyStateCard
      outlined={outlined}
      title={
        <FormattedMessage
          namespace="components.TransactionsList"
          id="noTransactionsFound"
          defaultMessage="No transactions found for selected period"
        />
      }
    />
  </Box>
)
