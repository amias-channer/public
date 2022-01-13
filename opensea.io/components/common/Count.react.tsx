import React from "react"
import BigNumber from "bignumber.js"
import styled, { css } from "styled-components"
import Block from "../../design-system/Block"
import Tooltip from "../../design-system/Tooltip"
import UnstyledButton from "../../design-system/UnstyledButton"
import {
  quantityDisplay,
  shortSymbolDisplay,
} from "../../lib/helpers/numberUtils"
import { pluralize } from "../../lib/helpers/stringUtils"
import CenterAligned from "./CenterAligned.react"
import Icon, { MaterialIcon } from "./Icon.react"

export type CountOptions = {
  unit?: string
  prefix?: string
  onClick?: () => void
  pluralize?: boolean
  tooltipPrefix?: string
  "aria-label"?: string
}
export type CountProps = {
  icon: MaterialIcon
  count: BigNumber
  options: CountOptions
}

const Count = ({
  icon,
  count,
  options: {
    unit = "",
    prefix = "",
    onClick,
    pluralize: shouldPluralize = true,
    tooltipPrefix,
    "aria-label": ariaLabel,
  },
}: CountProps) => {
  if (count.isZero()) {
    return null
  }

  const suffix =
    unit && shouldPluralize ? pluralize(unit, count.toNumber()) : unit
  const tooltipContent = count.greaterThanOrEqualTo(1000)
    ? `${tooltipPrefix ?? prefix} ${quantityDisplay(count)} ${suffix}`
    : undefined

  return (
    <Tooltip content={tooltipContent}>
      <Container
        alignItems="center"
        aria-label={ariaLabel}
        as={onClick ? UnstyledButton : undefined}
        display="flex"
        marginRight="20px"
        onClick={onClick}
      >
        <CenterAligned marginRight="8px">
          <Icon value={icon} />
        </CenterAligned>
        {prefix} {shortSymbolDisplay(count.toNumber())} {suffix}
      </Container>
    </Tooltip>
  )
}

const Container = styled(Block)`
  ${props =>
    props.onClick &&
    css`
      :hover {
        color: ${props.theme.colors.text.heading};
      }
    `}
`

export default Count
