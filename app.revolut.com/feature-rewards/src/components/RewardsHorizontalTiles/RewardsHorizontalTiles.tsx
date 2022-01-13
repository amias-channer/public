import { last } from 'lodash'
import { FC, Children, forwardRef, Ref, useRef, cloneElement, ReactElement } from 'react'
import { Box, CardProps } from '@revolut/ui-kit'

import {
  RewardsListTrackingEvent,
  useTrackEventWhenElementIsVisible,
} from '@revolut/rwa-core-analytics'

import { RewardsGroupTitle } from '../RewardsGroupTitle'
import { RewardsCarousel } from './RewardsCarousel'
import { RewardTileVariant } from './types'

const SHOW_ITEMS_AMOUNT = 5

type Props = {
  groupId: string
  title: string
  tilesVariant?: RewardTileVariant
  carouselWrapProps?: CardProps
  groupUrl?: string
  showAll?: boolean
  ref?: Ref<HTMLDivElement>
  trackLastItemVisibility?: boolean
}

export const RewardsHorizontalTiles: FC<Props> = forwardRef<HTMLDivElement, Props>(
  (
    {
      title,
      tilesVariant,
      groupUrl,
      showAll,
      carouselWrapProps,
      groupId,
      children,
      trackLastItemVisibility = false,
    },
    ref,
  ) => {
    const lastItemRef = useRef(null)

    const childrenArray = Children.toArray(children)
    const isCropped = !showAll && childrenArray.length > SHOW_ITEMS_AMOUNT
    const shownItems = showAll ? childrenArray : childrenArray.slice(0, SHOW_ITEMS_AMOUNT)
    const lastShownItem = last(shownItems)

    useTrackEventWhenElementIsVisible(
      lastItemRef,
      RewardsListTrackingEvent.lastItemInVerticalCategoryViewed,
      { verticalCategoryId: groupId },
      trackLastItemVisibility,
    )

    return (
      <Box ref={ref}>
        <RewardsGroupTitle
          title={title}
          allGroupRewardsLink={isCropped ? groupUrl : undefined}
        />
        <Box mt="s-12">
          <RewardsCarousel
            wrapperCardProps={carouselWrapProps}
            tilesVariant={tilesVariant}
          >
            {Children.map(shownItems, (shownItem) =>
              cloneElement(shownItem as ReactElement, {
                ref: shownItem === lastShownItem ? lastItemRef : undefined,
              }),
            )}
          </RewardsCarousel>
        </Box>
      </Box>
    )
  },
)
