import { FC } from 'react'
import { Flex, Loader } from '@revolut/ui-kit'

export const LoaderScreen: FC = () => (
  <Flex minHeight="100vh" flex="1" alignItems="center" justifyContent="center">
    <Loader />
  </Flex>
)
