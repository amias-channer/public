import { ReactNode } from 'react'
import styled from 'styled-components'
import { Colors } from '@revolut/icons'
import { Media, Card, TextBox, ElevationLevel } from '@revolut/ui-kit'

import { Bullet } from '@revolut/rwa-core-components'

import { CARD_HEIGHT } from './constants'

const CardStyled = styled(Card)`
  &:hover {
    cursor: pointer;
  }
`

export type PaymentCardProps = {
  title: ReactNode
  amount: ReactNode
  avatar?: ReactNode
  bullet?: ReactNode
  bulletColor?: Colors
  bulletContentColor?: Colors
  comment?: ReactNode
  details?: ReactNode
  secondaryValue?: ReactNode
} & React.HTMLAttributes<HTMLElement> &
  React.ComponentPropsWithoutRef<typeof Card>

export const PaymentCard: React.FC<PaymentCardProps> = ({
  title,
  amount,
  onClick,
  avatar,
  bullet,
  bulletColor = 'error',
  bulletContentColor = 'white',
  comment,
  details,
  secondaryValue,
  ...rest
}) => (
  <CardStyled
    p={{ all: 2, md: '1.5rem' }}
    pr={{ all: 2, md: 3 }}
    color="black"
    {...rest}
    elevationOnHover={ElevationLevel.NONE}
    height={CARD_HEIGHT}
    onClick={onClick}
    role="button"
  >
    <Media>
      <Media.Side
        display="flex"
        pr={{ all: 2, md: '1.25rem' }}
        ml={{ all: 0, md: '0.25rem' }}
        my={{ all: 0, md: '-0.25rem' }}
      >
        <Bullet.Anchor>
          {avatar}

          <Bullet bg={bulletColor} color={bulletContentColor}>
            {bullet}
          </Bullet>
        </Bullet.Anchor>
      </Media.Side>
      <Media.Content>
        <TextBox variant="primary" fontWeight={500} data-testid="payment-card-title">
          {title}
        </TextBox>
        {details && (
          <TextBox mt="0.25rem" variant="secondary" color="grey-50">
            {details}
          </TextBox>
        )}
        {comment && <TextBox>{comment}</TextBox>}
      </Media.Content>
      <Media.Side pl={1}>
        <TextBox variant="primary" textAlign="right" data-testid="payment-card-amount">
          {amount}
        </TextBox>
        {secondaryValue && (
          <TextBox mt="0.25rem" variant="secondary" color="grey-50" textAlign="right">
            {secondaryValue}
          </TextBox>
        )}
      </Media.Side>
    </Media>
  </CardStyled>
)
