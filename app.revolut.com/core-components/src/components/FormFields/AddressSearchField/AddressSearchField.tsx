import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import { useCallback, FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AddressSuggestionResponseItemDto } from '@revolut/rwa-core-types'
import {
  I18nNamespace,
  useDebouncedAction,
  useMountedState,
} from '@revolut/rwa-core-utils'

import { FormSearchSelect } from '../FormSearchSelect'
import { useAddressSuggestions, useGetAddressForSuggestion } from './api'
import { AddressSearchFieldProps } from './types'
import { AddressSearchPopup } from '../AddressSearchPopup'

const MINIMUM_INPUT_LENGTH = 2

export const AddressSearchField: FC<AddressSearchFieldProps> = ({
  countryCode,
  initialIsOpen,
  onChange,
  variant = 'floating',
}) => {
  const { t } = useTranslation(I18nNamespace.Common)

  const [searchValue, setSearchValue] = useState('')
  const [isSelectOpen, setSelectOpen] = useState(Boolean(initialIsOpen))

  const [availableAddressSuggestions, setAvailableAddressSuggestions] = useMountedState<
    AddressSuggestionResponseItemDto[]
  >([])

  const [updateAvailableSuggestions, suggestionsFetching] = useAddressSuggestions()
  const [getAddressForSuggestion, addressIsFetching] = useGetAddressForSuggestion()
  const debounceAction = useDebouncedAction()

  const closeSelect = () => {
    setSelectOpen(false)
  }

  const updateAddressSuggestions = useCallback(
    (data: AddressSuggestionResponseItemDto[]) => {
      setAvailableAddressSuggestions(uniqBy(data, 'id'))
    },
    [setAvailableAddressSuggestions],
  )

  const handleDropdownItemClick = async (itemValue: string) => {
    if (suggestionsFetching || isEmpty(itemValue)) {
      return
    }

    const selectedAddress = availableAddressSuggestions?.find(
      (suggestion) => suggestion.id === itemValue,
    )

    if (selectedAddress?.hasChildren) {
      await updateAvailableSuggestions(
        {
          countryCode,
          searchValue,
          parent: itemValue,
        },
        {
          onSuccess: updateAddressSuggestions,
        },
      )
    } else if (!addressIsFetching) {
      closeSelect()
      await getAddressForSuggestion(itemValue, {
        onSuccess: ({ address }) =>
          onChange({
            id: itemValue,
            ...address,
          }),
      })
    }
  }

  const handleSelectSearchChange = useCallback(
    (currentSearchValue: string) => {
      setSearchValue(currentSearchValue)

      if (currentSearchValue.length >= MINIMUM_INPUT_LENGTH) {
        debounceAction(() => {
          updateAvailableSuggestions(
            {
              countryCode,
              searchValue: currentSearchValue,
            },
            {
              onSuccess: updateAddressSuggestions,
            },
          )
        })
      } else {
        setAvailableAddressSuggestions([])
      }
    },
    [
      countryCode,
      debounceAction,
      setAvailableAddressSuggestions,
      updateAddressSuggestions,
      updateAvailableSuggestions,
    ],
  )

  const formatSelectOptions = useCallback(
    (options: AddressSuggestionResponseItemDto[] = []) => {
      return options.map((option) => ({
        label: `${option.result}, ${option.description}`,
        value: option.id,
      }))
    },
    [],
  )

  const handleDefaultOptionClick = () => {
    onChange('')
    closeSelect()
  }

  const handleInputClick = () => {
    setSelectOpen(!isSelectOpen)
  }

  if (variant === 'floating') {
    return (
      <FormSearchSelect
        isOpen={isSelectOpen}
        value=""
        options={formatSelectOptions(availableAddressSuggestions)}
        placeholder={t('fields.addressSearch')}
        searchValue={searchValue}
        onClickAway={closeSelect}
        onDefaultClick={handleDefaultOptionClick}
        onDropdownItemClick={handleDropdownItemClick}
        onInputClick={handleInputClick}
        onSearchChange={handleSelectSearchChange}
      />
    )
  }

  if (variant === 'popup') {
    return (
      <AddressSearchPopup
        isOpen={isSelectOpen}
        setOpen={setSelectOpen}
        suggestionsFetching={suggestionsFetching}
        addressIsFetching={addressIsFetching}
        options={formatSelectOptions(availableAddressSuggestions)}
        placeholder={t('fields.addressSearch')}
        onDefaultClick={handleDefaultOptionClick}
        onItemClick={handleDropdownItemClick}
        searchValue={searchValue}
        onSearchChange={handleSelectSearchChange}
      />
    )
  }

  return null
}
