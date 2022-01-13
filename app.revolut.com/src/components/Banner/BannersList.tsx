import * as React from 'react'
import { Box } from '@revolut/ui-kit'

import { Banner } from '../index'

import { BannerType } from './Banner'

type Props = {
  banners: BannerType[]
}

export class BannersList extends React.Component<Props> {
  render() {
    const { banners, ...props } = this.props

    return (
      <Box width='100%' {...props}>
        {banners.map((banner) => (
          <Banner key={banner.id} {...banner} />
        ))}
      </Box>
    )
  }
}
