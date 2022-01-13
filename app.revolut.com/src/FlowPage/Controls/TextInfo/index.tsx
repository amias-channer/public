import React, { FC } from 'react'
import { Text } from '@revolut/ui-kit'

type Props = {
  text: string
}

const TextInfo: FC<Props> = ({ text }) => {
  return (
    <Text mt="s-16" mb="s-32" variant="primary" color="grey-tone-50">
      {text}
    </Text>
  )
}

export default TextInfo
