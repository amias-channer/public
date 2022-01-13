import * as React from 'react'
import { Text } from '@revolut/ui-kit'

export const TransactionsListGroupTitle = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <Text color="grey-50" mb={2}>
    {children}
  </Text>
)
