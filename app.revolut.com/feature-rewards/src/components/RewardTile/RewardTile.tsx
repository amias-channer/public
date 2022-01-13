import { FC, forwardRef, Ref, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { useHistory } from 'react-router-dom'
import { Box, Tile } from '@revolut/ui-kit'

import { useCombinedRef } from '@revolut/rwa-core-utils'

import { getRewardCategoryIcon } from '../../utils'
import { LOAD_TILE_IMAGE_OBSERVER_SETTINGS } from '../constants'
import { RewardLikes } from '../RewardLikes'
import { RewardMerchantLogo } from '../RewardMerchantLogo'

type Props = {
  backgroundImgSrc: string
  logoImgSrc: string
  merchantName: string
  categoryId?: string
  title: string
  likes?: number
  linkUrl: string
  ref?: Ref<HTMLDivElement>
}

export const REWARD_LIKES_BOX_PLACEHOLDER = 'likesPlaceholder'

export const RewardTile: FC<Props> = forwardRef<HTMLDivElement, Props>(
  (
    { backgroundImgSrc, logoImgSrc, categoryId, merchantName, title, linkUrl, likes = 0 },
    ref,
  ) => {
    const { inView, ref: inViewRef } = useInView(LOAD_TILE_IMAGE_OBSERVER_SETTINGS)
    const innerRef = useCombinedRef(null, ref)

    const setRefs = useCallback(
      (node) => {
        innerRef.current = node
        inViewRef(node)
      },
      [inViewRef, innerRef],
    )

    const history = useHistory()

    const onTileClick = () => {
      history.push(linkUrl)
    }

    const showLikes = likes > 0
    return (
      <Box width={343} ref={setRefs}>
        <Tile
          variant="large"
          use="button"
          onClick={onTileClick}
          image={inView ? backgroundImgSrc : undefined}
        >
          <Tile.Avatar>
            {logoImgSrc && <RewardMerchantLogo logoImgSrc={logoImgSrc} />}
          </Tile.Avatar>
          <Tile.Status useIcon={getRewardCategoryIcon(categoryId)}>
            {merchantName}
          </Tile.Status>
          <Tile.Title>{title}</Tile.Title>
          <Tile.Description>
            <Box role={REWARD_LIKES_BOX_PLACEHOLDER}>
              {showLikes ? (
                <RewardLikes amount={likes} />
              ) : (
                <Box height="components.Rewards.LikeBox.height" />
              )}
            </Box>
          </Tile.Description>
        </Tile>
      </Box>
    )
  },
)
