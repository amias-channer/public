import { createContext } from 'react'

import { Filter } from './types'

export const TransactionsListFilterContext = createContext<{ [key: string]: Filter }>({
  dateFilter: {
    name: 'dateFilter',
    options: [],
    value: '',
    setFilterValue: () => {},
  },
})
