import { FC, useMemo } from 'react'
import { Box, Flex, Select, TextBox } from '@revolut/ui-kit'

import { prepareCurrencyOptions } from './helpers'

type CurrencySelectProps = {
  currenciesList: string[]
  selectedIndex: number
  onChange: (currency: string) => void
}

export const CurrencySelect: FC<CurrencySelectProps> = ({
  currenciesList,
  selectedIndex,
  onChange,
}) => {
  const options = useMemo(() => prepareCurrencyOptions(currenciesList), [currenciesList])

  return (
    <Box display="inline-block">
      <Select
        dropdown={{ fitInAnchor: false }}
        hasSearch={false}
        options={options}
        placeholder=""
        preserveOptionsOrder
        value={currenciesList[selectedIndex]}
        renderOption={(item, select) => (
          <Select.Option key={item.value} {...select.getOptionProps(item)}>
            <Flex>
              <TextBox flex="1 1 auto" mr={5}>
                {item.currency}
              </TextBox>
              <TextBox color="grey-50">{item.label}</TextBox>
            </Flex>
          </Select.Option>
        )}
        onChange={onChange}
      />
    </Box>
  )
}
