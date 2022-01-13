import React, { FC } from 'react'
import { RouteComponentProps } from '@reach/router'
import { H2, Flex, Box, Text } from '@revolut/ui-kit'

export const NOT_FOUND_TITLE_TESTID = 'not-found-title-testid'
export const NOT_FOUND_TEXT_TESTID = 'not-found-text-testid'

export const NotFoundPage: FC<RouteComponentProps> = () => (
  <Flex flexDirection="column" height="100%">
    <Box m="5rem auto" px="s-16" maxWidth={600}>
      <H2 data-testid={NOT_FOUND_TITLE_TESTID}>Form not found</H2>
      <Text
        display="block"
        variant="primary"
        my="s-8"
        data-testid={NOT_FOUND_TEXT_TESTID}
      >
        It seems this form does not exist or is closed.
      </Text>
    </Box>
  </Flex>
)
