import { useCallback } from 'react'
import { ShevronDown as IconShevronDown } from '@revolut/icons'
import { ButtonBase } from '@revolut/ui-kit'

import { IconSize } from '@revolut/rwa-core-utils'

// this hack is needed to render custom InputSelect button which will allow to focus search input on that button click

export const useButtonWithInputFocus = (input: HTMLInputElement | null) => {
  const onDropdownIconClick = useCallback(
    (select) => () => {
      if (select.isOpen) {
        select.closeMenu()
      } else {
        input?.focus()
      }
    },
    [input],
  )

  return useCallback(
    (select) => (
      <ButtonBase
        {...select.getToggleButtonProps()}
        onClick={onDropdownIconClick(select)}
      >
        <IconShevronDown
          size={IconSize.Medium}
          color="grey-50"
          {...(select.isOpen && {
            color: 'primary',
            transform: 'rotate(180)',
          })}
          {...(select.disabled && {
            color: 'grey-80',
          })}
        />
      </ButtonBase>
    ),
    [onDropdownIconClick],
  )
}
