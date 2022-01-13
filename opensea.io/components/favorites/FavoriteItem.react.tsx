import React from "react"
import Text from "../../design-system/Text"
import Tooltip from "../../design-system/Tooltip"
import { shortSymbolDisplay } from "../../lib/helpers/numberUtils"
import VerticalAligned from "../common/VerticalAligned.react"
import FavoriteIcon from "./FavoriteIcon.react"

export type FavoriteItemProps = {
  isFavorite: boolean
  favoritesCount: number
  toggleIsFavorite: (event: React.MouseEvent<HTMLElement>) => Promise<void>
  isAuthenticated: boolean
  iconSize?: number
}

export const FavoriteItem = React.forwardRef<HTMLDivElement, FavoriteItemProps>(
  function FavoriteItem(
    {
      isFavorite,
      favoritesCount,
      toggleIsFavorite,
      // isAuthenticated,
      iconSize = 20,
    },
    ref,
  ) {
    const countDisplay = (
      <VerticalAligned
        color={isFavorite ? "coral" : undefined}
        marginLeft="5px"
      >
        {shortSymbolDisplay(favoritesCount)}
      </VerticalAligned>
    )

    const favoriteIconTooltip = isFavorite ? "Unfavorite" : "Favorite"

    // TODO: Set up auth logic to make this logic more foolproof
    // if (!isAuthenticated) {
    //   favoriteIconTooltip = `Sign in to ${favoriteIconTooltip.toLowerCase()}`
    // }

    return (
      <Text as="span" display="flex" ref={ref} variant="info">
        <Tooltip content={favoriteIconTooltip}>
          <FavoriteIcon
            isFavorite={isFavorite}
            size={iconSize}
            onClick={toggleIsFavorite}
          />
        </Tooltip>

        {countDisplay}
      </Text>
    )
  },
)

export default FavoriteItem
