import React from "react"
import { Menu } from "../../../../design-system/Menu"
import Tooltip from "../../../../design-system/Tooltip"
import { useProfilePageNavigation } from "../../hooks"
import type { ProfilePageNavItemProps, TabNavItemProps } from "../../types"
import { CountSkeleton } from "./CountSkeleton.react"

export const ProfilePageMenuItem = ({
  label,
  icon,
  expanded,
  count,
  active,
  href,
  onClick,
}: ProfilePageNavItemProps) => {
  const tooltipContent =
    count === undefined || count === null ? label : `${label} (${count})`

  return (
    <Tooltip content={tooltipContent} disabled={expanded} placement="right">
      <Menu.Item $active={active} href={href} onClick={onClick}>
        <Menu.Avatar aria-label={label} icon={icon} />
        {expanded && (
          <>
            <Menu.Title>{label}</Menu.Title>
            {count !== undefined && (
              <Menu.Side>
                {count !== null ? (
                  <Menu.Extra>{count}</Menu.Extra>
                ) : (
                  <CountSkeleton />
                )}
              </Menu.Side>
            )}
          </>
        )}
      </Menu.Item>
    </Tooltip>
  )
}

export const ProfilePageTabMenuItem = ({
  tab,
  accountIdentifier,
  ...rest
}: TabNavItemProps) => {
  const { active, href } = useProfilePageNavigation({ tab, accountIdentifier })
  return <ProfilePageMenuItem {...rest} active={active} href={href} />
}
