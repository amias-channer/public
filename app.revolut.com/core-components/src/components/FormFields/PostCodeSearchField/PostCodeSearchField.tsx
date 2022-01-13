import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import { useCallback, FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AddressResponseItemDto } from '@revolut/rwa-core-types'
import { I18nNamespace, useDebouncedAction } from '@revolut/rwa-core-utils'

import { FormSearchSelect } from '../FormSearchSelect'
import { usePostCodeSearch } from './api'
import { PostCodeSearchValue } from './types'

const MINIMUM_INPUT_LENGTH = 4

type PostCodeSearchFieldProps = {
  countryCode: string
  value: PostCodeSearchValue
  initialIsOpen?: boolean
  onChange: (value: PostCodeSearchValue) => void
}

export const PostCodeSearchField: FC<PostCodeSearchFieldProps> = ({
  countryCode,
  value,
  initialIsOpen,
  onChange,
}) => {
  const { t } = useTranslation(I18nNamespace.Common)

  const [searchValue, setSearchValue] = useState('')
  const [isSelectOpen, setSelectOpen] = useState(Boolean(initialIsOpen))

  const [search, data] = usePostCodeSearch()
  const debounceAction = useDebouncedAction()

  const handleSelectChange = useCallback(
    (selectValue: string) => {
      if (isEmpty(selectValue)) {
        return
      }

      onChange(
        data?.find((val) => val.fullAddress === selectValue) as AddressResponseItemDto,
      )
    },
    [data, onChange],
  )

  const handleSelectSearchChange = useCallback(
    (currentSearchValue: string) => {
      setSearchValue(currentSearchValue.toUpperCase())

      debounceAction(() => {
        if (currentSearchValue.length >= MINIMUM_INPUT_LENGTH) {
          search({
            countryCode,
            searchValue: currentSearchValue,
          })
        }
      })
    },
    [countryCode, search, debounceAction],
  )

  const formatSelectOptions = useCallback((options: AddressResponseItemDto[] = []) => {
    return options.map((option) => ({
      label: option.fullAddress,
      value: option.fullAddress,
    }))
  }, [])

  const closeSelect = () => {
    setSelectOpen(false)
  }

  const handleDefaultOptionClick = () => {
    if (searchValue) {
      onChange(searchValue)
      closeSelect()
    }
  }

  const handleDropdownItemClick = (itemValue: string) => {
    handleSelectChange(itemValue)
    closeSelect()
  }

  const inputValue = isObject(value) ? value.postcode : value

  return (
    <FormSearchSelect
      isOpen={isSelectOpen}
      value={inputValue}
      options={formatSelectOptions(data)}
      placeholder={t('fields.postCode')}
      searchValue={searchValue}
      onClickAway={closeSelect}
      onDefaultClick={handleDefaultOptionClick}
      onDropdownItemClick={handleDropdownItemClick}
      onInputClick={() => setSelectOpen(!isSelectOpen)}
      onSearchChange={handleSelectSearchChange}
    />
  )
}
