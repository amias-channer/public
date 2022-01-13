import * as React from 'react'
import { Box, Flex, Text } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { BannerVariant } from '../../constants/banners'
import { SideEffect } from '../../helpers/types'

import { BannerButtonBase, BannerWrapper } from './styles'

export type BannerType = {
  id: string
  bannerTitle?: React.ReactNode
  bannerText?: React.ReactNode
  variant?: typeof BannerVariant[keyof typeof BannerVariant]
  onClose?: SideEffect | null
  isHidden: boolean
}

type Props = BannerType

export const Banner: React.FC<Props> = ({
  onClose,
  isHidden,
  bannerTitle,
  bannerText,
  variant,
}: Props) => {
  const isWarning = () => variant === BannerVariant.WARNING
  const isDefault = () => variant === BannerVariant.DEFAULT

  const renderTitle = () => {
    if (!bannerTitle) {
      return null
    }

    return (
      <Text variant='secondary' fontWeight={500}>
        {bannerTitle}
      </Text>
    )
  }

  const renderInfoIcon = () => {
    if (isDefault()) {
      return null
    }

    const infoIconColor = isWarning() ? 'error' : 'primary'

    return (
      <Box mr='0.75rem'>
        <Icons.Info color={infoIconColor} size={24} />
      </Box>
    )
  }

  return isHidden ? null : (
    <BannerWrapper>
      <Flex justifyContent='space-between'>
        <Flex alignItems='center'>
          {renderInfoIcon()}
          <Box>{renderTitle()}</Box>
        </Flex>
        {onClose && (
          <BannerButtonBase
            onClick={onClose}
            data-testid='TEST_ID_CLOSE_BANNER_BUTTON'
          >
            <Icons.Cross color='grey-80' size={24} />
          </BannerButtonBase>
        )}
      </Flex>
      {bannerText && (
        <Box my={1}>
          <Text variant='secondary' color='grey-35'>
            {bannerText}
          </Text>
        </Box>
      )}
    </BannerWrapper>
  )
}
