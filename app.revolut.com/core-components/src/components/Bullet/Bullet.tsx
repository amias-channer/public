import * as React from 'react'
import { Absolute, Badge } from '@revolut/ui-kit'

import { getPlacementProps } from './helpers'
import { RoundBullet, Anchor } from './styled'
import { BulletPlacement } from './types'

type BulletProps = {
  placement?: BulletPlacement
} & React.ComponentPropsWithoutRef<typeof Badge>

export const Bullet = ({
  placement = 'bottom-right',
  children,
  ...rest
}: BulletProps) => (
  <Absolute {...getPlacementProps(placement)}>
    {children && <RoundBullet {...rest}>{children}</RoundBullet>}
  </Absolute>
)

Bullet.Anchor = Anchor
