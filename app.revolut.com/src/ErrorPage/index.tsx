import React, { FC } from 'react'
import { H3, Flex, Box } from '@revolut/ui-kit'

import { useIsWidgetMode } from '../providers'

type Props = {
  text?: string
}

export const ERROR_DEFAULT_MESSAGE = 'Something went wrong'

export const ErrorPage: FC<Props> = ({ text }) => {
  const isWidgetMode = useIsWidgetMode()

  return (
    <Flex flexDirection="column" height="100%" px={isWidgetMode ? 's-16' : 0}>
      <Box m="5rem auto" px="s-16" maxWidth={600}>
        <H3>{text || ERROR_DEFAULT_MESSAGE}</H3>
      </Box>
    </Flex>
  )
}
