import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import * as Icons from '@revolut/icons'
import { Dropdown } from '@revolut/ui-kit'

import { SignOutCause, signOutWithRedirect } from '@revolut/rwa-core-auth'
import { FeatureKey } from '@revolut/rwa-core-config'
import { Url } from '@revolut/rwa-core-utils'

import { useFeaturesConfig } from '../../../../hooks'
import { SidebarProps } from '../../types'
import { DropdownItem } from './DropdownItem'

type UserMenuProps = {
  isOpen: boolean
  isUDS?: boolean
} & Pick<SidebarProps, 'hasBusinessAccount' | 'onBusinessAccountButtonClick'>

export const UserMenu: FC<UserMenuProps> = ({
  isOpen,
  hasBusinessAccount,
  onBusinessAccountButtonClick,
  isUDS,
}) => {
  const { t } = useTranslation('components.Sidebar')

  const history = useHistory()
  const { isFeatureActive } = useFeaturesConfig()

  const isSettingsItemAvailable = isFeatureActive(FeatureKey.AllowUserSettings)

  const handleSettingsButtonClick = () => {
    history.push(Url.Settings)
  }

  const handleLogoutButtonClick = () => {
    signOutWithRedirect(SignOutCause.User)
  }

  const handleDevicesButtonClick = () => {
    history.push(Url.DeviceManagement)
  }

  return (
    <Dropdown isOpen={isOpen} mt="0rem" ml="-1rem" maxHeight="27rem">
      {hasBusinessAccount && (
        <Dropdown.Group>
          <DropdownItem isUDS={isUDS} onClick={onBusinessAccountButtonClick}>
            {t('businessAccountButtonText')}
          </DropdownItem>
        </Dropdown.Group>
      )}

      <Dropdown.Group>
        {isSettingsItemAvailable && (
          <DropdownItem
            isUDS={isUDS}
            iconColor="userDropdownSettingsIcon"
            Icon={Icons.Gear}
            onClick={handleSettingsButtonClick}
          >
            {t('settingsButtonText')}
          </DropdownItem>
        )}
        <DropdownItem
          isUDS={isUDS}
          iconColor="primary"
          Icon={Icons.SmartphoneShield}
          onClick={handleDevicesButtonClick}
        >
          {t('deviceManagementButtonText_plural')}
        </DropdownItem>
        <DropdownItem
          isUDS={isUDS}
          color="userDropdownLogOutButton"
          Icon={Icons.LogoutDoor}
          onClick={handleLogoutButtonClick}
        >
          {t('logoutButtonText')}
        </DropdownItem>
      </Dropdown.Group>
    </Dropdown>
  )
}
