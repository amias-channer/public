import styled, { css } from 'styled-components'
import { ifProp } from 'styled-tools'
import { Box, Dropdown, DropdownItemProps } from '@revolut/ui-kit'

import { themeColor } from '@revolut/rwa-core-styles'

export const DropdownItemContainer = styled(Dropdown.Item).attrs<DropdownItemProps>({
  width: '19rem',
  minHeight: 'components.Sidebar.UserMenu.minHeight',
  use: 'a',
})<{ active?: boolean; isUDS?: boolean }>`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1.5rem;
  color: ${themeColor('sidebarDropdownItemColor')};
  display: flex;
  align-items: center;
  padding-right: 30px;

  & > div {
    display: flex;

    ${ifProp(
      'isUDS',
      css`
        min-width: 150px;
      `,
    )}

    &:hover {
      cursor: pointer;
    }
  }

  ${ifProp(
    'active',
    css`
      border-left: 2px solid ${themeColor('primary')};
      color: ${themeColor('primary')};
    `,
  )}
`

export const DropdownIconContainer = styled(Box).attrs({
  mr: '14px',
})``
