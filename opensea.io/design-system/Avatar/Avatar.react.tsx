import React, { CSSProperties, forwardRef } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import styled, { css } from "styled-components"
import CenterAligned from "../../components/common/CenterAligned.react"
import Icon, {
  IconProps,
  MaterialIcon,
} from "../../components/common/Icon.react"
import { resizeImage } from "../../lib/helpers/urls"
import Block, { BlockProps } from "../Block"
import Skeleton from "../Skeleton"

const AVATAR_PADDING = 8
export const AVATAR_DEFAULT_SIZE = 24

export const calculateContainerSize = (
  size: number,
  outline: boolean | number,
) => {
  if (!outline) {
    return size
  }
  return size + 2 * (typeof outline === "number" ? outline : AVATAR_PADDING)
}

type BaseProps = Omit<BlockProps, "size"> & {
  size?: number
  outline?: boolean | number
  borderRadius?: CSSProperties["borderRadius"]
  backgroundColor?: CSSProperties["backgroundColor"]
}

type AvatarImageProps = BaseProps & {
  src: string
  icon?: undefined
  $objectFit?: CSSProperties["objectFit"]
} & Omit<JSX.IntrinsicElements["img"], "ref">

type AvatarIconProps = BaseProps & {
  icon: MaterialIcon
  src?: undefined
} & Omit<IconProps, "value">

export type AvatarProps = AvatarImageProps | AvatarIconProps | BaseProps

const isImage = (props: AvatarProps): props is AvatarImageProps => {
  return (props as AvatarImageProps).src !== undefined
}

const isIcon = (props: AvatarProps): props is AvatarIconProps => {
  return (props as AvatarIconProps).icon !== undefined
}

export const AvatarContainer = styled(CenterAligned)<BaseProps>`
  overflow: hidden;

  ${props =>
    (props.outline || typeof props.outline === "number") &&
    css`
      border: 1px solid ${props => props.theme.colors.border};
      border-radius: ${props => props.theme.borderRadius.circle};
      padding: ${typeof props.outline === "number"
        ? props.outline
        : AVATAR_PADDING}px;
    `}
`

const ImgAvatar = styled(Block).attrs<AvatarImageProps>(props => ({
  as: LazyLoadImage,
  src: resizeImage(props.src, { size: props.size }),
}))<AvatarImageProps>`
  object-fit: ${props => props.$objectFit || "contain"};
`

export const AvatarBase = forwardRef<
  HTMLDivElement | HTMLImageElement,
  AvatarProps
>(function AvatarBase(props, ref) {
  if (isImage(props)) {
    return <ImgAvatar {...props} ref={ref} />
  } else if (isIcon(props)) {
    const { icon, ...rest } = props
    return <Icon {...rest} ref={ref} value={icon} />
  } else {
    return <CenterAligned {...props} ref={ref} />
  }
})

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    size = AVATAR_DEFAULT_SIZE,
    borderRadius,
    backgroundColor,
    outline = false,
    ...props
  },
  ref,
) {
  return (
    <AvatarContainer
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      outline={outline}
      ref={ref}
      size={calculateContainerSize(size, outline)}
    >
      <AvatarBase {...props} size={size} />
    </AvatarContainer>
  )
})

export const AvatarSkeleton = forwardRef<HTMLDivElement, AvatarProps>(
  function AvatarSkeleton(
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
      <AvatarContainer
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
        outline={outline}
        ref={ref}
        size={calculateContainerSize(size, outline)}
      >
        <Skeleton.Circle height={paramSize} width={paramSize} />
      </AvatarContainer>
    )
  },
)
