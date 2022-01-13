import { FC, FormEvent, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Box, Dropdown, Input, TextButton } from '@revolut/ui-kit'

import { I18nNamespace } from '@revolut/rwa-core-utils'

import { FormSearchSelectProps } from './types'

export const FORM_SEARCH_SELECT_TEST_ID = 'SearchSelect'

export const FormSearchSelect: FC<FormSearchSelectProps> = ({
  isOpen,
  value,
  options,
  placeholder,
  searchValue,
  onClickAway,
  onDefaultClick,
  onDropdownItemClick,
  onInputClick,
  onSearchChange,
}) => {
  const { t } = useTranslation(I18nNamespace.Common)

  const inputContainerRef = useRef(null)

  const handleSelectSearchChange = (event: FormEvent<HTMLInputElement>) => {
    onSearchChange(event.currentTarget.value)
  }

  return (
    <>
      <Box ref={inputContainerRef}>
        <Input
          type="button"
          useIcon={Icons.Search}
          placeholder={placeholder}
          value={value}
          onClick={onInputClick}
        />
      </Box>
      <Dropdown
        anchorRef={inputContainerRef}
        fitInAnchor
        isOpen={isOpen}
        onClickAway={onClickAway}
      >
        <Dropdown.Group sticky>
          <Dropdown.Search
            data-testid={FORM_SEARCH_SELECT_TEST_ID}
            autoFocus
            value={searchValue}
            onChange={handleSelectSearchChange}
          />
        </Dropdown.Group>
        <Dropdown.Group>
          <Dropdown.Item onClick={onDefaultClick}>
            <TextButton pl="px24">{t('select.defaultOption')}</TextButton>
          </Dropdown.Item>
          {options.map((option) => (
            <Dropdown.Item
              key={option.value}
              onClick={() => onDropdownItemClick(option.value)}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Group>
      </Dropdown>
    </>
  )
}
