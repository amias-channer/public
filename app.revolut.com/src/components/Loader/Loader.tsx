import * as React from 'react'
import * as Icons from '@revolut/icons'

import { LoaderWrapper, Spinner } from './styles'

type Prop = {
  delay?: number
}
export const Loader = ({ delay = 0 }: Prop) => (
  <LoaderWrapper delay={delay}>
    <Icons.Revolut color='lightGrey' size={48} />
    <Spinner />
  </LoaderWrapper>
)
