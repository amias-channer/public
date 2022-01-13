import * as React from 'react'
import { Circle } from '@revolut/ui-kit'

export const Container = ({ children, ...rest }: React.ComponentProps<typeof Circle>) => (
  <Circle size={{ all: 'avatar.md', md: '3.5rem' }} {...rest}>
    {children}
  </Circle>
)
