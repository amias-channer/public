import React, { forwardRef } from "react"
import styled from "styled-components"
import { variant } from "styled-system"
import { Icon, IconProps } from "../../components/common/Icon.react"
import Link from "../../components/common/Link.react"
import { Values } from "../../lib/helpers/type"
import { Block, BlockProps } from "../Block"
import Flex from "../Flex"
import Loader from "../Loader/Loader.react"

export const BUTTON_SIZE = {
  small: "small",
  medium: "medium",
} as const

export type ButtonSize = Values<typeof BUTTON_SIZE>

export const BUTTON_VARIANT = {
  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
} as const

export type ButtonVariant = Values<typeof BUTTON_VARIANT>

type BaseButtonProps = Omit<BlockProps, "size"> &
  Omit<JSX.IntrinsicElements["button"], "ref"> & {
    variant?: ButtonVariant
    size?: ButtonSize
    isLoading?: boolean
    href?: string
    eventSource?: string
  }

type ButtonWithIconProps = BaseButtonProps & {
  icon: IconProps["value"]
  overrides?: {
    Icon: {
      props: Partial<IconProps>
    }
  }
}

type ButtonWithCustomIconProps = BaseButtonProps & {
  icon: JSX.Element
}

export type ButtonProps =
  | BaseButtonProps
  | ButtonWithIconProps
  | ButtonWithCustomIconProps

const hasCustomIcon = (
  props: ButtonProps,
): props is ButtonWithCustomIconProps => {
  return React.isValidElement((props as ButtonWithCustomIconProps).icon)
}

const hasMaterialIcon = (props: ButtonProps): props is ButtonWithIconProps => {
  return typeof (props as ButtonWithIconProps).icon === "string"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { children, isLoading = false, size = "medium", href, ...buttonProps },
    ref,
  ) {
    const onlyIcon =
      (hasMaterialIcon(buttonProps) || hasCustomIcon(buttonProps)) && !children

    const renderContent = () => {
      if (isLoading) {
        return (
          <>
            <Flex height="0px" opacity={0}>
              {children}
            </Flex>
            <Loader size="small" />
          </>
        )
      }

      const renderIcon = () => {
        if (!hasCustomIcon(buttonProps) && !hasMaterialIcon(buttonProps)) {
          return null
        }
        return (
          <Flex marginRight={children ? 12 : 0}>
            {hasMaterialIcon(buttonProps) ? (
              <Icon
                value={buttonProps.icon}
                {...buttonProps.overrides?.Icon.props}
              />
            ) : (
              buttonProps.icon
            )}
          </Flex>
        )
      }

      return (
        <>
          {renderIcon()}
          {children}
        </>
      )
    }

    return (
      <StyledButton
        {...buttonProps}
        $isLoading={isLoading}
        $onlyIcon={onlyIcon}
        $size={size}
        href={href}
        ref={ref}
      >
        {renderContent()}
      </StyledButton>
    )
  },
)

type StyledButtonProps = Omit<JSX.IntrinsicElements["button"], "ref"> &
  BlockProps & {
    $size: ButtonSize
    $onlyIcon: boolean
    $isLoading: boolean
    href?: string
  }

const isButton = (props: StyledButtonProps) => !(props.as ?? props.href)

const StyledButton = styled(Block).attrs<StyledButtonProps>(props => ({
  as: isButton(props) ? "button" : Link,
  type: isButton(props) ? props.type ?? "button" : undefined,
}))<StyledButtonProps>`
  display: inline-flex;
  flex-direction: ${props => (props.$isLoading ? "column" : "row")};
  align-items: center;
  border-radius: ${props => props.theme.borderRadius.default};
  justify-content: center;
  color: inherit;

  :hover:not([disabled]) {
    transition: 0.2s;
    box-shadow: ${props => props.theme.shadow};
  }

  :disabled {
    opacity: 0.2;
  }

  ${props =>
    variant({
      prop: "$size",
      variants: {
        [BUTTON_SIZE.medium]: {
          fontSize: "16px",
          fontWeight: 600,
          padding: props.$onlyIcon ? "12px" : "12px 20px",
        },
        [BUTTON_SIZE.small]: {
          fontSize: "12px",
          fontWeight: 500,
          padding: props.$onlyIcon ? "10px" : "10px 20px",
        },
      },
    })}

  ${props =>
    props.theme.type === "light"
      ? variant({
          prop: "variant",
          variants: {
            [BUTTON_VARIANT.primary]: {
              backgroundColor: props.theme.colors.primary,
              border: `1px solid ${props.theme.colors.primary}`,
              color: props.theme.colors.white,

              ":hover:not([disabled])": {
                color: props.theme.colors.white,
                backgroundColor: props.theme.colors.darkSeaBlue,
              },
            },
            [BUTTON_VARIANT.secondary]: {
              backgroundColor: props.theme.colors.background,
              border: `1px solid ${props.theme.colors.primary}`,
              color: props.theme.colors.primary,

              ":hover:not([disabled])": {
                border: `1px solid ${props.theme.colors.darkSeaBlue}`,
                color: props.theme.colors.darkSeaBlue,
              },
            },

            [BUTTON_VARIANT.tertiary]: {
              backgroundColor: props.theme.colors.background,
              border: `1px solid ${props.theme.colors.border}`,
              color: props.theme.colors.darkGray,

              ":hover:not([disabled])": {
                color: props.theme.colors.oil,
              },
            },
          },
        })
      : variant({
          prop: "variant",
          variants: {
            [BUTTON_VARIANT.primary]: {
              backgroundColor: props.theme.colors.primary,
              border: `1px solid ${props.theme.colors.primary}`,
              color: props.theme.colors.white,

              ":hover:not([disabled])": {
                backgroundColor: props.theme.colors.shoreline,
                border: `1px solid ${props.theme.colors.shoreline}`,
                color: props.theme.colors.white,
              },
            },

            [BUTTON_VARIANT.secondary]: {
              backgroundColor: props.theme.colors.oil,
              border: `1px solid ${props.theme.colors.border}`,
              color: props.theme.colors.fog,

              ":hover:not([disabled])": {
                color: props.theme.colors.white,
                backgroundColor: props.theme.colors.ash,
              },
            },

            [BUTTON_VARIANT.tertiary]: {
              backgroundColor: props.theme.colors.midnight,
              border: `1px solid ${props.theme.colors.darkGray}`,
              color: props.theme.colors.fog,

              ":hover:not([disabled])": {
                color: props.theme.colors.white,
                border: `1px solid ${props.theme.colors.gray}`,
              },
            },
          },
        })}
`

Button.defaultProps = {
  variant: "primary",
}

export default Button
