import React, { forwardRef } from "react"
import styled, { keyframes } from "styled-components"
import Icon, { IconProps } from "../common/Icon.react"

export type FavoriteIconProps = Omit<IconProps, "color" | "value" | "title"> & {
  isFavorite: boolean
}

export const FavoriteIcon = forwardRef<HTMLDivElement, FavoriteIconProps>(
  function FavoriteIcon({ isFavorite, ...rest }, ref) {
    return (
      <StyledIcon
        {...rest}
        aria-label={isFavorite ? "Unfavorite" : "Favorite"}
        isFavorite={isFavorite}
        ref={ref}
        value={isFavorite ? "favorite" : "favorite_border"}
      />
    )
  },
)

const likeButtonAnimation = keyframes`
    0%,
    to {
      transform: scale(1);
    }
    25% {
      transform: scale(1.2);
    }
    50% {
      transform: scale(0.95);
    }
`

const StyledIcon = styled(Icon)<FavoriteIconProps>`
  animation: ${likeButtonAnimation} 0.45s ease-in-out;
  color: ${({ isFavorite, theme }) =>
    isFavorite ? theme.colors.coral : theme.colors.gray};

  :hover {
    color: ${props => props.theme.colors.coral};
  }
`

export default FavoriteIcon
