import React, { forwardRef } from "react"
import styled from "styled-components"
import {
  AvatarBase,
  AvatarProps,
  AvatarContainer,
  calculateContainerSize,
  AVATAR_DEFAULT_SIZE,
} from "../Avatar"

export const ItemAvatarContainer = styled(AvatarContainer)`
  align-self: center;
  order: 2;
  margin-right: 16px;
`

export const ItemAvatar = forwardRef<HTMLDivElement, AvatarProps>(
  function ItemAvatar(
    {
      size = AVATAR_DEFAULT_SIZE,
      borderRadius,
      backgroundColor,
      outline = false,
      style,
      ...props
    },
    ref,
  ) {
    return (
      <ItemAvatarContainer
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
        outline={outline}
        ref={ref}
        size={calculateContainerSize(size, outline)}
        style={style}
      >
        <AvatarBase {...props} size={size} />
      </ItemAvatarContainer>
    )
  },
)
