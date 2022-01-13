import React, { FC, useEffect } from 'react'
import { Button, Flex, Text } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { BooleanValue, YesNoInputItem } from '../../../types'
import {
  useMoveToTheNextView,
  useSetIsContinueButtonVisible,
} from '../../../providers/FlowContext'

type Props = Pick<YesNoInputItem, 'yesTitle' | 'noTitle' | 'value'> & {
  disabled: boolean
  yesTitle: string
  noTitle: string
  required: boolean
  changeValue: (value: BooleanValue['value']) => void
}

export enum YesNoOption {
  Yes = 'yes',
  No = 'no',
}

const YesNoInput: FC<Props> = ({
  yesTitle,
  noTitle,
  required,
  changeValue,
  disabled,
}) => {
  const setIsContinueButtonVisible = useSetIsContinueButtonVisible()
  useEffect(() => {
    if (required) {
      setIsContinueButtonVisible(false)
    }
    return () => {
      setIsContinueButtonVisible(true)
    }
  })
  const moveToTheNextView = useMoveToTheNextView()

  return (
    <>
      <Button
        variant="white"
        disabled={disabled}
        onClick={() => {
          changeValue(true)
          moveToTheNextView()
        }}
      >
        <Flex width="100%" justifyContent="space-between">
          <Text fontWeight={400}>{yesTitle || YesNoOption.Yes}</Text>
          <Icons.ShevronRight size={24} color="grey-tone-50" hoverColor="grey-tone-50" />
        </Flex>
      </Button>
      <Button
        mt="s-8"
        variant="white"
        disabled={disabled}
        onClick={() => {
          changeValue(false)
          moveToTheNextView()
        }}
      >
        <Flex width="100%" justifyContent="space-between">
          <Text fontWeight={400}>{noTitle || YesNoOption.No}</Text>
          <Icons.ShevronRight size={24} color="grey-tone-50" hoverColor="grey-tone-50" />
        </Flex>
      </Button>
    </>
  )
}

export default YesNoInput
