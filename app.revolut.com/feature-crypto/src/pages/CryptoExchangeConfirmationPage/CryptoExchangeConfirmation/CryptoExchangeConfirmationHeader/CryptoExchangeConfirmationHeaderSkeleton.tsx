import { VFC } from 'react'
import { HeaderSkeleton } from '@revolut/ui-kit'

export const CryptoExchangeConfirmationHeaderSkeleton: VFC = () => (
  <HeaderSkeleton variant="item" labelBackButton="Back">
    <HeaderSkeleton.BackButton />
    <HeaderSkeleton.Title />
    <HeaderSkeleton.Subtitle />
    <HeaderSkeleton.Avatar />
  </HeaderSkeleton>
)
