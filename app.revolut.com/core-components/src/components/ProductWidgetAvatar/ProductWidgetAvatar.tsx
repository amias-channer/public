import { VFC } from 'react'
import { AppIcon, AppIconSkeleton, ProductWidget } from '@revolut/ui-kit'

import { AssetProject, getAsset } from '@revolut/rwa-core-utils'
import { ImageLoader } from '../ImageLoader'

// Available icons can be found here: https://ui-kit.revolut.codes/assets/hub-icons

type Category = 'main' | 'wealth'

type Props = {
  category: Category
  iconName: string
}

const getBackgroundColor = (category: Category) => {
  if (category === 'wealth') {
    return 'terracotta'
  }

  return undefined
}

export const ProductWidgetAvatar: VFC<Props> = ({ category, iconName }) => {
  const imageSrc = getAsset(`hub-icons/${iconName}`, AssetProject.Assets)

  return (
    <ProductWidget.Avatar>
      <ImageLoader src={imageSrc} loader={<AppIconSkeleton size={40} />}>
        <AppIcon size={40} bg={getBackgroundColor(category)} image={imageSrc} />
      </ImageLoader>
    </ProductWidget.Avatar>
  )
}
