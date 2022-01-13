import styled from "styled-components"
import Flex, { FlexProps } from "../Flex"
import SpaceBetween from "../SpaceBetween"

const SkeletonRow = SpaceBetween

type VariantProps =
  | {
      variant?: "full"
      direction?: never
    }
  | {
      variant?: "gradient"
      direction?: "rtl" | "ltr"
    }

export type SkeletonProps = VariantProps & {
  height?: string
  width?: string
}

const SkeletonBlock = styled.div<SkeletonProps>`
  border-radius: inherit;
  height: ${props => props.height || "100%"};
  width: ${props => props.width || "100%"};
  background: ${({ theme, variant, direction = "ltr" }) =>
    variant === "full"
      ? theme.type === "light"
        ? theme.colors.fog
        : theme.colors.oil
      : `linear-gradient(to ${direction === "ltr" ? "right" : "left"}, ${
          theme.type === "light" ? theme.colors.fog : theme.colors.oil
        }, rgba(255, 255, 255, 0))`};
`

const SkeletonCircle = styled(SkeletonBlock)<SkeletonProps>`
  border-radius: ${props => props.theme.borderRadius.circle};
`

const SkeletonLine = styled(SkeletonBlock)<SkeletonProps>`
  border-radius: 100px;
  height: ${props => props.height || "18px"};
  width: ${props => props.width || "100%"};
`

const SkeletonBase = styled(Flex)<FlexProps>`
  flex-direction: column;
  flex: 1 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;

  > :not(:first-child) {
    margin-top: 10px;
  }
`

export const Skeleton = Object.assign(SkeletonBase, {
  Row: SkeletonRow,
  Line: SkeletonLine,
  Block: SkeletonBlock,
  Circle: SkeletonCircle,
})

export default Skeleton
