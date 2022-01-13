import React, { FC } from 'react'
import { Flex, Box, Text } from '@revolut/ui-kit'

import { StarRatingInputItem, StarRatingValue } from '../../../types'

import StarButton from './StarButton'

type Props = {
  value?: StarRatingInputItem['value']
  negativeLabel?: StarRatingInputItem['negativeLabel']
  positiveLabel?: StarRatingInputItem['positiveLabel']
  disabled: boolean
  changeValue: (value?: StarRatingValue['value']) => void
}

const StarRatingInput: FC<Props> = ({
  value,
  disabled,
  changeValue,
  negativeLabel,
  positiveLabel,
}) => {
  const rating = value?.value || 0

  const commonProps = { onClick: changeValue, disabled }

  return (
    <Flex flexDirection="column" alignItems="center" p="s-16" radius="card" bg="white">
      <Box>
        <Flex justifyContent="space-between">
          <Text variant="caption" color="grey-tone-50">
            {negativeLabel || 'Not at all likely'}
          </Text>
          <Text variant="caption" color="grey-tone-50">
            {positiveLabel || 'Extremely likely'}
          </Text>
        </Flex>
        <Flex mt="s-16" mb="s-8">
          {Array.from({ length: 5 }).map((_, index, array) => {
            const buttonIndex = index + 1
            return (
              <StarButton
                key={buttonIndex}
                index={buttonIndex}
                isActive={rating === buttonIndex}
                isLast={buttonIndex === array.length}
                {...commonProps}
              />
            )
          })}
        </Flex>
      </Box>
    </Flex>
  )
}

export default StarRatingInput
