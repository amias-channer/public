import * as React from 'react'
import { Flex } from '@revolut/ui-kit'

const GROUP_HEADER_HEIGHT = 68

export const TransactionsListGroupHeader: React.FC = ({ children }) => (
  <Flex
    alignItems="flex-end"
    px={{ all: 2, md: 0 }}
    height={GROUP_HEADER_HEIGHT}
    justifyContent="space-between"
  >
    {children}
  </Flex>
)
