import React, { forwardRef } from "react"
import styled from "styled-components"
import {
  AvatarProps,
  calculateContainerSize,
  AVATAR_DEFAULT_SIZE,
} from "../Avatar"
import { Item, ItemProps } from "../Item"
import { ItemAvatarContainer } from "../Item/ItemAvatar.react"
import { Skeleton, SkeletonProps } from "../Skeleton"

const ItemSkeletonBase = styled(Item)`` as React.ComponentType<ItemProps>

const ItemSkeletonContent = styled(Item.Content)``

const ItemSkeletonSide = styled(Item.Side)`
  width: 50%;
  align-items: flex-end;
`

const ItemSkeletonAvatar = forwardRef<HTMLDivElement, AvatarProps>(
  function ItemSkeletonAvatar(
    {
      size = AVATAR_DEFAULT_SIZE,
      backgroundColor,
      borderRadius,
      outline = false,
    },
    ref,
  ) {
    const paramSize = `${size}px`
    return (
      <ItemAvatarContainer
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
        outline={outline}
        ref={ref}
        size={calculateContainerSize(size, outline)}
      >
        <Skeleton.Circle height={paramSize} width={paramSize} />
      </ItemAvatarContainer>
    )
  },
)

const ItemSekeletonAction = forwardRef<HTMLDivElement, SkeletonProps>(
  function ItemSekeletonAction(props, ref) {
    return (
      <Item.Action ref={ref}>
        <Skeleton.Circle {...props} />
      </Item.Action>
    )
  },
)

const ItemSkeletonTitle = styled(Skeleton.Line)<SkeletonProps>`
  margin-bottom: 3px;
  width: 50%;
  max-width: 180px;
`

const ItemSkeletonDescription = styled(Skeleton.Line)<SkeletonProps>`
  width: 35%;
  max-width: 150px;
  height: 14px;
  margin-top: 3px;
`

export const ItemSkeleton = Object.assign(ItemSkeletonBase, {
  Content: ItemSkeletonContent,
  Title: ItemSkeletonTitle,
  Description: ItemSkeletonDescription,
  Side: ItemSkeletonSide,
  Avatar: ItemSkeletonAvatar,
  Action: ItemSekeletonAction,
})

export default ItemSkeleton
