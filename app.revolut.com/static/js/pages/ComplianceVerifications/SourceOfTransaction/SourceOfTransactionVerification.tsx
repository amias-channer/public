import { FC } from 'react'

import { Router } from '@revolut/rwa-feature-source-of-wealth'

import { VerificationLayout } from '../components'

export const SourceOfTransactionVerification: FC = () => {
  return (
    <VerificationLayout>
      <Router />
    </VerificationLayout>
  )
}
