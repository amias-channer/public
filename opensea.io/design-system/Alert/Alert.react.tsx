import styled from "styled-components"
import { variant } from "styled-system"
import Frame from "../../components/layout/Frame.react"
import { Values } from "../../lib/helpers/type"

export interface AlertProps {
  variant?: AlertVariant
}

export const ALERT_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TERTIARY: "tertiary",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const

type AlertVariant = Values<typeof ALERT_VARIANTS>

export const Alert = styled(Frame)<AlertProps>`
  background-color: ${props => props.theme.colors.surface};
  padding: 16px;

  ${props =>
    variant({
      variants: {
        [ALERT_VARIANTS.PRIMARY]: {
          backgroundColor: props.theme.colors.withOpacity.primary.veryLight,
          borderColor: props.theme.colors.primary,
        },
        [ALERT_VARIANTS.SECONDARY]: {
          backgroundColor: props.theme.colors.withOpacity.secondary.veryLight,
          borderColor: props.theme.colors.secondary,
        },
        [ALERT_VARIANTS.TERTIARY]: {
          backgroundColor: props.theme.colors.withOpacity.tertiary.veryLight,
          borderColor: props.theme.colors.tertiary,
        },
        [ALERT_VARIANTS.SUCCESS]: {
          backgroundColor: props.theme.colors.withOpacity.success.veryLight,
          borderColor: props.theme.colors.success,
        },
        [ALERT_VARIANTS.WARNING]: {
          backgroundColor: props.theme.colors.withOpacity.warning.veryLight,
          borderColor: props.theme.colors.warning,
        },
        [ALERT_VARIANTS.ERROR]: {
          backgroundColor: props.theme.colors.withOpacity.error.veryLight,
          borderColor: props.theme.colors.error,
        },
      },
    })}
`

export default Alert
