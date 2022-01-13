import * as React from 'react'
import { Absolute, Flex, Loader } from '@revolut/ui-kit'

type Props = React.ComponentPropsWithoutRef<typeof Absolute>

export const AbsoluteLoader = (props: Props) => (
  <Absolute left={0} top={0} size="100%" {...props}>
    <Flex height="100%">
      <Loader m="auto" />
    </Flex>
  </Absolute>
)
