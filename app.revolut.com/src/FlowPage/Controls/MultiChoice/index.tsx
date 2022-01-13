import React, { FC, Fragment, useMemo, useState } from 'react'
import { Box, Checkbox, CheckboxGroup, Text, Input, Flex, Search } from '@revolut/ui-kit'

import { includesSubstringCaseInsensitive } from '../../helpers'
import { FlowViewItemType } from '../../../appConstants'
import { MultiChoiceItem, SingleChoiceTextInputItem } from '../../../types'
import { Actions } from '../../useFlowPage'
import { useWidgetInputVariant } from '../../../providers'

import { useMultiChoice } from './useMultiChoice'

export const CUSTOM_ANSWER_INPUT_TESTID = 'custom-answer-input-testid'

export type Props = {
  items: (MultiChoiceItem | SingleChoiceTextInputItem)[]
  disabled: boolean
  changeViewItemValues: Actions['changeViewItemValues']
}

const MultiChoice: FC<Props> = ({ items = [], disabled, changeViewItemValues }) => {
  const inputVariant = useWidgetInputVariant()
  const [
    { customValue, showCustomInput, defaultValue },
    { changeCheckboxGroup, changeCustomValue },
  ] = useMultiChoice({
    items,
    changeViewItemValues,
  })

  const [filterValue, setFilterValue] = useState('')

  const filteredItems = useMemo(
    () =>
      items.filter(item =>
        item.type === FlowViewItemType.MultiChoice && typeof item.description === 'string'
          ? includesSubstringCaseInsensitive(item.description, filterValue)
          : true,
      ),
    [filterValue, items],
  )

  return (
    <>
      <Search
        value={filterValue}
        placeholder={items[0]?.searchHint || 'Search'}
        onChange={setFilterValue}
      />
      <Box mt="s-16" radius="card" bg="white">
        <CheckboxGroup
          onChange={changeCheckboxGroup}
          disabled={disabled}
          defaultValue={defaultValue}
        >
          {group =>
            filteredItems.map(item => (
              <Fragment key={item.id}>
                {item.type === FlowViewItemType.MultiChoice && (
                  <Box p="s-16">
                    <Checkbox
                      {...group.getInputProps({ value: item.id })}
                      data-testid={item.id}
                    >
                      <Text>{item.description}</Text>
                    </Checkbox>
                  </Box>
                )}
                {item.type === FlowViewItemType.SingleChoiceTextInput && (
                  <Flex p="s-16" pt={showCustomInput ? 0 : 's-16'} alignItems="center">
                    <Checkbox
                      {...group.getInputProps({ value: item.id })}
                      data-testid={item.id}
                    >
                      {!showCustomInput && <Text>{item?.hint || 'Other'}</Text>}
                    </Checkbox>
                    {showCustomInput && (
                      <Box width="100%">
                        <Input
                          variant={inputVariant}
                          autoFocus
                          placeholder={item?.hint || 'Other'}
                          value={customValue}
                          onChange={changeCustomValue}
                          disabled={disabled}
                          data-testid={CUSTOM_ANSWER_INPUT_TESTID}
                        />
                      </Box>
                    )}
                  </Flex>
                )}
              </Fragment>
            ))
          }
        </CheckboxGroup>
      </Box>
    </>
  )
}

export default MultiChoice
