import * as React from 'react'
import { TransitionSlideDown } from '@revolut/ui-kit'

export const TransitionSlideUp = ({ ...props }) => (
  <TransitionSlideDown offset={-24} {...props} />
)
