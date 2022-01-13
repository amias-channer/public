import { FC } from 'react'
import { Check as CheckIcon } from '@revolut/icons'
import { Avatar, AvatarProps, AvatarSkeleton } from '@revolut/ui-kit'

import {
  checkIfCommodityCurrency,
  checkIfCryptoCurrency,
  getAsset,
  getCountryByCurrency,
  AssetProject,
} from '@revolut/rwa-core-utils'
import { ImageLoader } from '../ImageLoader'

type Props = {
  currency: string
  selected?: boolean
  avatarSize?: AvatarProps['size']
}

// taken from https://ui-kit.revolut.codes/assets/cryptos
enum CurrencyAssetPaths {
  Commodities = 'commodities',
  Crypto = 'cryptos',
  Fiat = 'flags',
}

export const getCurrencyAssetPath = (currency: string): string => {
  if (checkIfCryptoCurrency(currency)) {
    return `${CurrencyAssetPaths.Crypto}/${currency}.svg`
  }

  if (checkIfCommodityCurrency(currency)) {
    return `${CurrencyAssetPaths.Commodities}/${currency}.png`
  }

  const country = getCountryByCurrency(currency)

  return `${CurrencyAssetPaths.Fiat}/${country}.svg`
}

const DEFAULT_CURRENCY_AVATAR_SIZE = 40

export const CurrencyItemAvatar: FC<Props> = ({
  currency,
  selected,
  avatarSize = DEFAULT_CURRENCY_AVATAR_SIZE,
}) => {
  const currencyAssetPath = getCurrencyAssetPath(currency)

  const image = getAsset(currencyAssetPath, AssetProject.Assets)

  const bg = checkIfCommodityCurrency(currency) ? 'background' : undefined

  return (
    <ImageLoader src={image} loader={<AvatarSkeleton />}>
      <Avatar bg={bg} image={image} size={avatarSize}>
        {selected && <Avatar.Badge useIcon={CheckIcon} />}
      </Avatar>
    </ImageLoader>
  )
}
