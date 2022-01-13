import React from "react"
import styled from "styled-components"
import Tooltip from "../../design-system/Tooltip"
import { capitalize } from "../../lib/helpers/stringUtils"
import { Values } from "../../lib/helpers/type"
import { VerificationStatus } from "../../lib/helpers/verification"
import Icon from "../common/Icon.react"
import VerifiedIcon from "../common/VerifiedIcon.react"

const statusesWithBadges = ["verified", "mintable"]

export const verificationStatusHasBadge = (status: VerificationStatus) => {
  return statusesWithBadges.includes(status)
}

export const ICON_SIZE = {
  small: "small",
  medium: "medium",
  large: "large",
} as const

export type IconSize = Values<typeof ICON_SIZE>

interface Props {
  verificationStatus: VerificationStatus
  size?: IconSize
  className?: string
}

export const VerificationIcon = ({
  verificationStatus,
  size = "medium",
  className,
}: Props) => {
  if (!verificationStatusHasBadge(verificationStatus)) {
    return null
  }
  const child =
    verificationStatus === "verified" ? (
      <div className="VerificationIcon--icon">
        <VerifiedIcon size={size} />
      </div>
    ) : (
      <Icon
        className="VerificationIcon--icon"
        color={
          verificationStatus === "mintable" ? "yellow" : "gray" // "gray" Should never happen.
        }
        value={
          verificationStatus === "mintable" ? "report" : "warning" // "warning" Should never happen
        }
        variant={verificationStatus === "mintable" ? "outlined" : undefined}
      />
    )

  return (
    <DivContainer $size={size} className={className}>
      <Tooltip
        content={`${capitalize(verificationStatus)} Collection`}
        placement="right"
      >
        {child}
      </Tooltip>
    </DivContainer>
  )
}

const DivContainer = styled.div<{ $size: IconSize }>`
  .VerificationIcon--icon {
    display: flex;
    font-size: 24px;
    margin: 0 4px;
    cursor: pointer;
  }
`
