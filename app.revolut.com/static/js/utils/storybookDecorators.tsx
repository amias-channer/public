import { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import {
  Box,
  BreakpointsProvider,
  Flex,
  ThemeProvider,
  UnifiedTheme,
  Layout,
} from '@revolut/ui-kit'
import { StoryFn } from '@storybook/addons'

import { FlexProp } from '@revolut/rwa-core-utils'

export const spaceBoxWrapper = (storyFn: StoryFn<ReactElement>) => (
  <Box ml="px16" mt="px16" mr="px16">
    {storyFn()}
  </Box>
)

export const atBottomWrapper = (storyFn: StoryFn<ReactElement>) => (
  <Flex flexDirection="column" minHeight="100vh">
    <Box flex={FlexProp.Auto} />
    {storyFn()}
  </Flex>
)

export const unifiedThemeWrapper = (storyFn: StoryFn<ReactElement>) => (
  <ThemeProvider theme={UnifiedTheme}>{storyFn()}</ThemeProvider>
)

export const layoutWrapper = (storyFn: StoryFn<ReactElement>) => (
  <Layout>
    <Layout.Main>{storyFn()}</Layout.Main>
  </Layout>
)

export const breakpointsProvider = (storyFn: StoryFn<ReactElement>) => (
  <BreakpointsProvider>{storyFn()}</BreakpointsProvider>
)

export const memoryRouterProvider = (storyFn: StoryFn<ReactElement>) => (
  <MemoryRouter>{storyFn()}</MemoryRouter>
)
