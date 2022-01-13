import { FC } from 'react'
import * as Icons from '@revolut/icons'

import { IconSize } from '@revolut/rwa-core-utils'

import { LogoDinersIcon, LogoDiscoverIcon, LogoJcbIcon } from '../../Icons'
import { CardNumberInputTestId } from './constants'
import { CardType } from './types'

type CardTypeIconProps = {
  cardType: CardType
}

export const CardTypeIcon: FC<CardTypeIconProps> = ({ cardType }) => {
  switch (cardType) {
    case 'american-express':
      return (
        <Icons.LogoAmex
          data-testid={CardNumberInputTestId.AmericanExpressIcon}
          size={IconSize.Medium}
        />
      )
    case 'diners-club':
      return (
        <LogoDinersIcon
          data-testid={CardNumberInputTestId.DinersClubIcon}
          size={IconSize.Medium}
        />
      )
    case 'discover':
      return (
        <LogoDiscoverIcon
          data-testid={CardNumberInputTestId.DiscoverIcon}
          size={IconSize.Medium}
        />
      )
    case 'jcb':
      return (
        <LogoJcbIcon data-testid={CardNumberInputTestId.JcbIcon} size={IconSize.Medium} />
      )
    case 'maestro':
      return (
        <Icons.LogoMa
          data-testid={CardNumberInputTestId.MaestroIcon}
          size={IconSize.Medium}
        />
      )
    case 'mastercard':
      return (
        <Icons.LogoMc
          data-testid={CardNumberInputTestId.MasterCardIcon}
          size={IconSize.Medium}
        />
      )
    case 'visa':
      return (
        <Icons.LogoVisaColour
          data-testid={CardNumberInputTestId.VisaIcon}
          size={IconSize.Medium}
        />
      )
    default:
      return null
  }
}
