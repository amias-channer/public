import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { Circle, Color } from '@revolut/ui-kit'

import { Bullet } from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

import { ImgStyled } from './styled'

export const MERCHANT_LOGO_TESTID = 'merchant-logo-testid'
export const BULLET_TESTID = 'bullet-testid'

type Props = {
  logoImgSrc: string
  bulletIcon?: string
  size?: string
}

export const RewardMerchantLogo: FC<Props> = ({
  logoImgSrc,
  bulletIcon,
  size = 'components.MerchantLogo.size',
}) => {
  const BulletIcon = bulletIcon && Icons[bulletIcon]
  return (
    <Bullet.Anchor>
      <Circle size={size}>
        <ImgStyled src={logoImgSrc} data-testid={MERCHANT_LOGO_TESTID} />
      </Circle>
      {bulletIcon && (
        <Bullet bg="primary" color={'primaryWhite' as Color}>
          <BulletIcon size={IconSize.Small} data-testid={BULLET_TESTID} />
        </Bullet>
      )}
    </Bullet.Anchor>
  )
}
