import { FC } from 'react'
import { IconComponentType } from '@revolut/icons'
import { Circle, Media, TextBox } from '@revolut/ui-kit'

import { IconSize } from '@revolut/rwa-core-utils'

import { SettingsSectionItemContainer } from './styled'

type SettingsSectionItemProps = {
  Icon: IconComponentType
  title: string
  onClick?: VoidFunction
}

export enum SettingsSectionItemTestId {
  Container = 'SettingsSectionItem.Container',
}

export const SettingsSectionItem: FC<SettingsSectionItemProps> = ({
  Icon,
  title,
  onClick,
}) => (
  <SettingsSectionItemContainer
    data-testid={SettingsSectionItemTestId.Container}
    onClick={onClick}
  >
    <Media alignItems="center">
      <Media.Side>
        <Circle bg="iconBg" size="avatar.md">
          <Icon color="icon" size={IconSize.Medium} />
        </Circle>
      </Media.Side>
      <Media.Content ml="px20">
        <TextBox fontWeight="bolder">{title}</TextBox>
      </Media.Content>
    </Media>
  </SettingsSectionItemContainer>
)
