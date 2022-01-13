import { FC } from 'react'
import { Avatar, AvatarProps } from '@revolut/ui-kit'

import { getAsset, AssetProject } from '@revolut/rwa-core-utils'

interface CountryFlagProps extends Omit<AvatarProps, 'image'> {
  country: string
}

export const CountryFlag: FC<CountryFlagProps> = ({ country, children, ...props }) => {
  const image = getAsset(`flags/${country}.svg`, AssetProject.Business)

  return (
    <Avatar image={image} {...props} data-testid="country-flag">
      {children}
    </Avatar>
  )
}
