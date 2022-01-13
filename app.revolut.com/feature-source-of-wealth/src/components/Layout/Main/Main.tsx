import { FC } from 'react'

import { Layout } from '@revolut/ui-kit'
import { AbsoluteLoader } from '@revolut/rwa-core-components'

import { TestIds } from '../../../utils'

type MainProps = {
  isLoading?: boolean
}

export const Main: FC<MainProps> = ({ children, isLoading = false }) => {
  return (
    <Layout.Main>
      {isLoading ? <AbsoluteLoader data-testid={TestIds.MainLoader} /> : children}
    </Layout.Main>
  )
}
