import * as React from 'react'
import { Box, Card, ElevationLevel, H3, Media, TextBox } from '@revolut/ui-kit'

import { Currency } from '@revolut/rwa-core-types'

import { Balance } from '@revolut/rwa-core-components'

import { OpacityBox } from './styled'

type AccountCardProps = {
  title: string
  subtitle: string
  currency: Currency | string
  balance: number
  avatar: React.ReactElement
  disabled?: boolean
  testId?: string
}

export const AccountCard = ({
  title,
  subtitle,
  currency,
  balance,
  disabled,
  testId,
  avatar,
}: AccountCardProps) => (
  <Card
    data-testid={testId}
    p={{ all: '1.5rem', md: 3 }}
    pb={{ all: '1.25rem', md: '1.5rem' }}
    bg="white"
    elevation={ElevationLevel.LEVEL}
    elevationOnHover={ElevationLevel.HIGHER}
  >
    <OpacityBox disabled={disabled}>
      <Media>
        <Media.Content>
          <TextBox ellipsis variant="primary" fontWeight={500}>
            {title}
          </TextBox>
          <TextBox ellipsis variant="secondary" color="grey-50" mt="0.25rem">
            {subtitle}
          </TextBox>
          <Box mt={3}>
            <H3>
              <Balance amount={balance} currency={currency} />
            </H3>
          </Box>
        </Media.Content>
        <Media.Side mt={{ all: 0, md: '-0.25rem' }} mr={{ all: 0, md: '-0.25rem' }}>
          {avatar}
        </Media.Side>
      </Media>
    </OpacityBox>
  </Card>
)
