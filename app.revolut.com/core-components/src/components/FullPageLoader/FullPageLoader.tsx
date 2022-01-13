import { FC } from 'react'

import { Z_INDICES } from '@revolut/rwa-core-styles'

import { AbsoluteLoader } from '../AbsoluteLoader'

export const FullPageLoader: FC = () => (
  <AbsoluteLoader bg="primaryWhite" minHeight="100vh" zIndex={Z_INDICES.fullPageLoader} />
)
