import React, { useMemo, useRef } from "react"
import Carousel from "../../components/common/Carousel.react"
import CenterAligned from "../../components/common/CenterAligned.react"
import { useSize } from "../../hooks/useSize"
import { UnreachableCaseError } from "../../lib/helpers/type"
import Block from "../Block"
import ScrollingPaginator, {
  ScrollingPaginatorProps,
} from "../ScrollingPaginator"
import { calculateItemWidth } from "./calculateItemWidth"
import { GalleryVariant } from "./types"

export type GalleryChildrenProps<T> = {
  item: T
  itemWidth: number
  containerWidth: number
  index: number
}

export type GalleryProps<T> = {
  gridGap: number
  itemMinWidth: number
  items: T[]
  getKey: (item: T, index: number) => React.Key
  children: (props: GalleryChildrenProps<T>) => React.ReactNode
  variant?: GalleryVariant
  pagination?: Omit<ScrollingPaginatorProps, "intersectionOptions">
  evenSidePadding?: boolean
}

export const Gallery = <T,>({
  gridGap,
  itemMinWidth,
  items,
  getKey,
  children,
  evenSidePadding,
  variant = "horizontal",
  pagination,
}: GalleryProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth] = useSize(containerRef)

  const { itemWidth, numItems: itemsToShow } = useMemo(
    () =>
      calculateItemWidth({
        gridGap,
        width: containerWidth,
        itemMinWidth,
        evenSidePadding,
        variant,
      }),
    [gridGap, containerWidth, itemMinWidth, evenSidePadding, variant],
  )
  const padding = `${gridGap}px`
  const rootMargin = `${2 * itemWidth}px`

  // Carousel pagination
  const afterChange = async (newIndex: number) => {
    if (!pagination) {
      return
    }

    // Load more once the last loaded assets (less LOADMORE_THRESHOLD) are shown
    const lastItemLoadedIdx = items.length - 1
    const lastItemShownIdx = newIndex + itemsToShow - 1
    const LOADMORE_THRESHOLD = 2
    if (
      lastItemShownIdx >= lastItemLoadedIdx - LOADMORE_THRESHOLD &&
      pagination.page.hasMore()
    ) {
      await pagination.page.loadMore(pagination.size)
    }
  }

  // Width === 0 only on SSR. If that is the case, we need to use CSS grid to correctly fill the width content on SSR at the expense of non perfect aspect ratio
  // Once client side code kicks in and width !== 0 we switch to our own positoning
  const isSSR = containerWidth === 0

  switch (variant) {
    case "carousel":
      return (
        <Block
          overflow="visible"
          paddingX={evenSidePadding ? `${gridGap}px` : undefined}
          ref={containerRef}
        >
          <Carousel
            afterChange={afterChange}
            arrows={itemsToShow !== 1}
            dotType="below"
            dots={!pagination}
            overflow={itemsToShow === 1}
            slidesToShow={itemsToShow}
          >
            {items.map((item, index) => (
              <div key={getKey(item, index)}>
                <CenterAligned>
                  {children({ item, itemWidth, containerWidth, index })}
                </CenterAligned>
              </div>
            ))}
          </Carousel>
        </Block>
      )
    case "grid":
      return (
        <Block
          ref={containerRef}
          style={
            isSSR
              ? {
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
                  gridGap: padding,
                  padding: gridGap,
                }
              : {
                  display: "flex",
                  flexWrap: "wrap",
                  padding: evenSidePadding ? `0 ${gridGap}px` : undefined,
                }
          }
        >
          {/* <Window
            getKey={getKey}
            items={items}
            renderItem={(item, itemRef, index) => (
              <Block
                key={getKey(item, index)}
                ref={itemRef}
                style={isSSR ? undefined : { padding }}
              >
                {children({ item, itemWidth, containerWidth, index })}
              </Block>
            )}
          /> */}
          {items.map((item, index) => (
            <Block
              key={getKey(item, index)}
              style={isSSR ? undefined : { padding }}
            >
              {children({ item, itemWidth, containerWidth, index })}
            </Block>
          ))}
          {pagination && (
            <ScrollingPaginator
              {...pagination}
              intersectionOptions={{ rootMargin }}
            />
          )}
        </Block>
      )
    case "horizontal":
      return (
        <Block overflow="auto" ref={containerRef}>
          <Block
            display="inline-flex"
            style={{ padding: evenSidePadding ? `0 ${gridGap}px` : undefined }}
          >
            {items.map((item, index) => (
              <Block key={getKey(item, index)} role="card" style={{ padding }}>
                {children({ item, itemWidth, containerWidth, index })}
              </Block>
            ))}
            {pagination && (
              <ScrollingPaginator
                {...pagination}
                intersectionOptions={{
                  rootMargin,
                  root: containerRef.current,
                }}
              />
            )}
          </Block>
        </Block>
      )
    default:
      throw new UnreachableCaseError(variant)
  }
}

export default Gallery
