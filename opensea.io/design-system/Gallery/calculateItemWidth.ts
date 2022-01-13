import { GalleryVariant } from "./types"

export type UseItemWidthOptions = {
  gridGap: number
  itemMinWidth: number
  width: number
  evenSidePadding?: boolean
  variant: GalleryVariant
}

export type UseItemWidthResult = {
  itemWidth: number
  numItems: number
}

export const calculateItemWidth = ({
  gridGap,
  width,
  itemMinWidth,
  evenSidePadding,
  variant,
}: UseItemWidthOptions): UseItemWidthResult => {
  if (!width) {
    return { itemWidth: itemMinWidth, numItems: 1 }
  }

  const minBlockWidth = itemMinWidth + gridGap * 2
  const sidePaddingWidth = evenSidePadding ? gridGap * 2 : 0
  const widthWithoutSidePadding = width - sidePaddingWidth

  const numItems = Math.max(
    1,
    Math.floor(widthWithoutSidePadding / minBlockWidth),
  )
  const gapsWidth = numItems * gridGap * 2
  const widthWithoutGaps = width - gapsWidth - sidePaddingWidth

  const itemWidth =
    variant === "grid"
      ? Math.floor(widthWithoutGaps / numItems)
      : Math.ceil(widthWithoutGaps / numItems)

  return { itemWidth, numItems }
}
