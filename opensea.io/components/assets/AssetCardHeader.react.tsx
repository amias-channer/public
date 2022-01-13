import React, { memo } from "react"
import { useFragment } from "react-relay"
import styled from "styled-components"
import Skeleton from "../../design-system/Skeleton"
import SpaceBetween from "../../design-system/SpaceBetween"
import { AssetCardHeader_data$key } from "../../lib/graphql/__generated__/AssetCardHeader_data.graphql"
import { graphql } from "../../lib/graphql/graphql"
import Icon from "../common/Icon.react"
import FavoriteItem from "../favorites/FavoriteItem.react"
import { useAssetFavorite } from "../favorites/useAssetFavorite"

type Props = {
  iconSize?: number
  dataKey: AssetCardHeader_data$key
}

const AssetCardHeader = ({ iconSize = 20, dataKey }: Props) => {
  const {
    favoritesCount: favoriteCountInitial,
    isDelisted: isDelisted,
    isFavorite: isFavoriteInitial,
    relayId: assetId,
  } = useFragment(
    graphql`
      fragment AssetCardHeader_data on AssetType {
        relayId
        favoritesCount
        isDelisted
        isFavorite
      }
    `,
    dataKey,
  )

  const { toggleIsFavorite, isFavorite, favoritesCount, isAuthenticated } =
    useAssetFavorite({ assetId, favoriteCountInitial, isFavoriteInitial })

  if (isDelisted) {
    return (
      <StyledContainer>
        <span />
        <Icon className="AssetCardHeader--hidden" value="cancel" />
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <span />
      <FavoriteItem
        favoritesCount={favoritesCount}
        iconSize={iconSize}
        isAuthenticated={isAuthenticated}
        isFavorite={isFavorite}
        toggleIsFavorite={toggleIsFavorite}
      />
    </StyledContainer>
  )
}

const AssetTopbarSkeleton = memo(function AssetTopbarSkeleton() {
  return (
    <StyledContainer>
      <Skeleton>
        <Skeleton.Row>
          <Skeleton.Line width="0px" />
          <Skeleton.Line direction="rtl" width="25%" />
        </Skeleton.Row>
      </Skeleton>
    </StyledContainer>
  )
})

const StyledContainer = styled(SpaceBetween).attrs({ as: "header" })`
  background: ${props => props.theme.colors.card};
  padding: 12px 16px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  .AssetCardHeader--hidden {
    cursor: default;
    opacity: 0;
  }
`

export default Object.assign(AssetCardHeader, {
  Skeleton: AssetTopbarSkeleton,
  Container: StyledContainer,
})
