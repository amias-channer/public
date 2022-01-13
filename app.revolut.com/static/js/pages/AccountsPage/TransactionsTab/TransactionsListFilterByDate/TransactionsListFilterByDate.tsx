import { FC, useContext } from 'react'
import { Select, Box, Flex } from '@revolut/ui-kit'

import {
  TransactionsListFilterContext,
  FilterValue,
} from '@revolut/rwa-feature-transactions'

import { fromISOInterval, toISOInterval } from './helpers'
import { TextBoxStyled } from './styled'
import { TransactionsListFilterLabel } from './TransactionsListFilterLabel'

type TransactionsListFilterByDate = {
  isRestrictedAccessToken?: boolean
}

export const TransactionsListFilterByDate: FC<TransactionsListFilterByDate> = ({
  isRestrictedAccessToken,
}) => {
  const { dateFilter } = useContext(TransactionsListFilterContext)

  if (!dateFilter) {
    return null
  }

  const convertedOptions = dateFilter.options.map((option) => ({
    ...option,
    value: toISOInterval(option.value),
  }))

  const convertedValue = toISOInterval(dateFilter.value as FilterValue)

  return (
    <Select
      dropdown={{ fitInAnchor: false }}
      hasSearch={false}
      options={convertedOptions}
      preserveOptionsOrder
      value={convertedValue}
      onChange={(value) => {
        // @ts-expect-error
        dateFilter.setFilterValue(fromISOInterval(value))
      }}
      filterFn={() => (items) => items}
      renderLabel={({ selectedItem }) => (
        <TransactionsListFilterLabel
          isRestrictedAccessToken={isRestrictedAccessToken}
          selectedItem={selectedItem}
        />
      )}
      renderOption={(item, select) => (
        <Select.Option
          key={item.value}
          data-testid={`transactions-list-filter-date-option-${item.value}`}
          {...select.getOptionProps(item)}
        >
          <Flex>
            <Box flex="1 1 auto">{item.optionLabel}</Box>
            <TextBoxStyled color="grey-50">{item.hint}</TextBoxStyled>
          </Flex>
        </Select.Option>
      )}
    />
  )
}
