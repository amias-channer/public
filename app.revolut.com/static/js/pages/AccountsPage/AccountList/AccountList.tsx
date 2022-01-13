import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Box } from '@revolut/ui-kit'

import { InfiniteGrid } from 'components/InfiniteGrid'

import { AccountPreview } from '../AccountPreview'
import { PocketConvertedForDisplay } from '../types'
import { ACCOUNT_CARD_HEIGHT } from './constants'

type AccountListProps = {
  pockets: PocketConvertedForDisplay[]
}

export const AccountList: FC<AccountListProps> = ({ pockets }) => {
  return (
    <Box width={1}>
      <InfiniteGrid cols={[1, 1, 2]} elementHeight={ACCOUNT_CARD_HEIGHT} items={pockets}>
        {(pocket: PocketConvertedForDisplay) => (
          <Link to={`/accounts/${pocket.id}/transactions`}>
            <Box py="1rem">
              <AccountPreview {...pocket} />
            </Box>
          </Link>
        )}
      </InfiniteGrid>
    </Box>
  )
}
