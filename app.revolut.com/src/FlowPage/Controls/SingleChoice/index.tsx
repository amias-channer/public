import React, { FC, Fragment, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Search,
  Text,
  mq,
} from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { includesSubstringCaseInsensitive } from '../../helpers'
import { SingleChoiceInputItem, SingleChoiceTextInputItem } from '../../../types'
import { Actions } from '../../useFlowPage'
import { FlowViewItemType } from '../../../appConstants'
import { useMoveToTheNextView, useSetIsContinueButtonVisible } from '../../../providers'
import { useWidgetInputVariant } from '../../../providers'

import useSingleChoice from './useSingleChoice'

const ButtonStyled = styled(Button)`
  height: auto;
  min-height: 3rem;

  @media ${mq('*-md')} {
    min-height: '3.5rem';
  }
`

export type Props = {
  items: (SingleChoiceInputItem | SingleChoiceTextInputItem)[]
  disabled: boolean
  changeViewItemValues: Actions['changeViewItemValues']
}

export const CUSTOM_ANSWER_INPUT_TESTID = 'custom-answer-input-testid'

const SingleChoice: FC<Props> = ({ items = [], disabled, changeViewItemValues }) => {
  const inputVariant = useWidgetInputVariant()
  const [
    { customValue, showCustomInput, defaultValue },
    { changeRadioGroup, changeCustomValue },
  ] = useSingleChoice({
    items,
    changeViewItemValues,
  })

  const setIsContinueButtonVisible = useSetIsContinueButtonVisible()
  const moveToTheNextView = useMoveToTheNextView()

  const [filterValue, setFilterValue] = useState('')
  const [isMoveToTheNextViewPending, setIsMoveToTheNextViewPending] = useState(false)

  const hasTextInputOption = items.some(
    item => item.type === FlowViewItemType.SingleChoiceTextInput,
  )
  const isRequired = items.some(item => item.required)

  useEffect(() => {
    // Do move after the state got updated.
    if (isMoveToTheNextViewPending) {
      moveToTheNextView()
      setIsMoveToTheNextViewPending(false)
    }
    if (isRequired && !hasTextInputOption) {
      setIsContinueButtonVisible(false)
    }
    return () => setIsContinueButtonVisible(true)
  }, [
    hasTextInputOption,
    isMoveToTheNextViewPending,
    isRequired,
    moveToTheNextView,
    setIsContinueButtonVisible,
  ])

  const filteredItems = useMemo(
    () =>
      items.filter(item =>
        item.type === FlowViewItemType.SingleChoice &&
        typeof item.description === 'string'
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
      <Box mt="s-16" radius={hasTextInputOption ? 'card' : 'button-lg'} bg="white">
        <RadioGroup
          onChange={changeRadioGroup}
          disabled={disabled}
          defaultValue={defaultValue}
        >
          {group =>
            filteredItems.map(item => (
              <Fragment key={item.id}>
                {item.type === FlowViewItemType.SingleChoice && (
                  <>
                    {hasTextInputOption ? (
                      <Box p="s-16">
                        <Radio
                          {...group.getInputProps({ value: item.id })}
                          data-testid={item.id}
                        >
                          <Text>{item.description}</Text>
                        </Radio>
                      </Box>
                    ) : (
                      <ButtonStyled
                        variant="white"
                        disabled={disabled}
                        onClick={() => {
                          group
                            .getInputProps({ value: item.id })
                            .onChange?.({} as React.ChangeEvent<HTMLInputElement>)
                          setIsMoveToTheNextViewPending(true)
                        }}
                      >
                        <Flex
                          width="100%"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Text
                            display="block"
                            fontWeight={400}
                            style={{ textAlign: 'start' }}
                          >
                            {item.description}
                          </Text>
                          <Icons.ShevronRight
                            size={24}
                            color="grey-50"
                            hoverColor="grey-50"
                            style={{ flexShrink: 0 }}
                          />
                        </Flex>
                      </ButtonStyled>
                    )}
                  </>
                )}
                {item.type === FlowViewItemType.SingleChoiceTextInput && (
                  <Flex p="s-16" pt={showCustomInput ? 0 : 's-16'} alignItems="center">
                    <Radio
                      {...group.getInputProps({ value: item.id })}
                      data-testid={item.id}
                    >
                      {!showCustomInput && <Text>{item?.hint || 'Other'}</Text>}
                    </Radio>
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
        </RadioGroup>
      </Box>
    </>
  )
}

export default SingleChoice
