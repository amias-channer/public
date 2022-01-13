import { FC, forwardRef, Ref, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { useHistory } from 'react-router-dom'
import { Box, Tile } from '@revolut/ui-kit'

import { useCombinedRef } from '@revolut/rwa-core-utils'

import { getRewardCategoryIcon } from '../../utils'
import { LOAD_TILE_IMAGE_OBSERVER_SETTINGS } from '../constants'
import { RewardMerchantLogo } from '../RewardMerchantLogo'

type Props = {
  backgroundImgSrc: string
  categoryId?: string
  title: string
  logoImgSrc?: string
  brief?: string
  linkUrl: string
  ref?: Ref<HTMLDivElement>
}

export const RewardSmallTile: FC<Props> = forwardRef(
  ({ backgroundImgSrc, logoImgSrc, categoryId, linkUrl, title, brief }, ref) => {
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

    return (
      <Box data-cy="rewards-small-tile" ref={setRefs} width={168}>
        <Tile
          use="button"
          variant="small"
          image={inView ? backgroundImgSrc : undefined}
          onClick={onTileClick}
        >
          <Tile.Avatar>
            {logoImgSrc && <RewardMerchantLogo logoImgSrc={logoImgSrc} />}
          </Tile.Avatar>
          <Tile.Title>{title}</Tile.Title>
          {categoryId && brief && (
            <Tile.Status useIcon={getRewardCategoryIcon(categoryId)}>{brief}</Tile.Status>
          )}
        </Tile>
      </Box>
    )
  },
)
