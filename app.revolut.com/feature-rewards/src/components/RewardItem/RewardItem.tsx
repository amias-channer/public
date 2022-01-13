import { FC, forwardRef, Ref } from 'react'
import { Box, Flex, Text } from '@revolut/ui-kit'

import { Link } from '@revolut/rwa-core-components'

import { RewardMerchantLogo } from '../RewardMerchantLogo'
import { RewardItemWrapper } from './styled'

type Props = {
  linkUrl: string
  logoImgSrc: string
  merchantName: string
  tinyDescription: string
  isCashback?: boolean
  ref?: Ref<HTMLDivElement>
}

const CASHBACK_ICON = 'Coins'

export const RewardItem: FC<Props> = forwardRef(
  ({ linkUrl, logoImgSrc, merchantName, tinyDescription, isCashback }, ref) => (
    <RewardItemWrapper>
      <Link to={linkUrl}>
        <Flex justifyContent="center" ref={ref}>
          <RewardMerchantLogo
            logoImgSrc={logoImgSrc}
            bulletIcon={isCashback ? CASHBACK_ICON : undefined}
          />
        </Flex>
        <Box mt="s-8">
          <Box>
            <Text use="p" variant="small" ellipsis color="rewardItemMerchantName">
              {merchantName}
            </Text>
          </Box>
          <Box>
            <Text use="p" variant="small" ellipsis color="rewardsText">
              {tinyDescription}
            </Text>
          </Box>
        </Box>
      </Link>
    </RewardItemWrapper>
  ),
)
