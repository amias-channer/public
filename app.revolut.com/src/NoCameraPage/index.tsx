import React, { FC } from 'react'
import { RouteComponentProps } from '@reach/router'
import { H2, Flex, Box, Text } from '@revolut/ui-kit'

export const NO_CAMERA_TITLE_TESTID = 'no-camera-title-testid'
export const NO_CAMERA_TEXT_TESTID = 'no-camera-text-testid'

export const NoCameraPage: FC<RouteComponentProps> = () => (
  <Flex flexDirection="column" height="100%">
    <Box m="5rem auto" px="s-16" width="100%" maxWidth={600}>
      <H2 data-testid={NO_CAMERA_TITLE_TESTID}>No camera found</H2>
      <Text
        display="block"
        variant="primary"
        my="s-8"
        data-testid={NO_CAMERA_TEXT_TESTID}
      >
        A camera is required to pass the form. You don not seem to have a camera or your
        browser does not support it.
      </Text>
    </Box>
  </Flex>
)
