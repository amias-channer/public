import { VFC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Flex,
  Image,
  Item,
  Popup,
  Search,
  TextButton,
  Spinner,
  Box,
} from '@revolut/ui-kit'
import { getIllustrationUrl } from '@revolut/rwa-core-utils'

import { FormSearchSelectOption } from '../FormSearchSelect/types'
import { SearchInputButton } from './SearchInputButton'
import { AddressSuggestionItem } from './AddressSuggestionItem'
import { PopupScrollableContainer } from '../../styled'

type HomeAddressSearchPopupProps = {
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
  suggestionsFetching: boolean
  addressIsFetching: boolean
  options: FormSearchSelectOption[]
  placeholder: string
  onDefaultClick: () => void
  onItemClick: (itemId: string) => void
  searchValue: string
  onSearchChange: (searchValue: string) => void
}

enum TestId {
  AddressSearchPopupSearchButton = 'AddressSearchPopupSearchButton',
}

export const AddressSearchPopup: VFC<HomeAddressSearchPopupProps> = ({
  isOpen,
  setOpen,
  suggestionsFetching,
  options,
  placeholder,
  onDefaultClick,
  onItemClick,
  searchValue,
  onSearchChange,
}) => {
  const { t } = useTranslation('components.AddressSearchPopup')

  const [selectedId, setSelectedId] = useState<string>('')
  return (
    <>
      <SearchInputButton
        data-testid={TestId.AddressSearchPopupSearchButton}
        placeholder={placeholder}
        onClick={() => setOpen(true)}
      />
      <Popup
        variant="modal-view"
        shouldKeepMaxHeight
        isOpen={isOpen}
        onExit={() => setOpen(false)}
      >
        <Flex justifyContent="space-between">
          <Box flex="1" pr="15px">
            <Search
              placeholder={t('searchInputPlaceholder')}
              value={searchValue}
              onChange={onSearchChange}
              renderAction={() => suggestionsFetching && <Spinner color="blue" />}
            />
          </Box>
          <TextButton onClick={() => setOpen(false)}>{t('closeButtonText')}</TextButton>
        </Flex>

        <PopupScrollableContainer>
          {options.length ? (
            <>
              <Box height="48px" my="4px" p="13px">
                <TextButton onClick={onDefaultClick}>{t('notFoundText')}</TextButton>
              </Box>
              {options.map(({ label, value }) => {
                return (
                  <AddressSuggestionItem
                    address={label}
                    key={value}
                    isSelected={selectedId === value}
                    onClick={() => {
                      setSelectedId(value)
                      onItemClick(value)
                    }}
                  />
                )
              })}
            </>
          ) : (
            <Flex p="12px">
              <Image mr="5px" width="52px" src={getIllustrationUrl('puzzle')} />
              <Item.Content>
                <Item.Title color="grey-tone-50">{t('initialMessage')}</Item.Title>
              </Item.Content>
            </Flex>
          )}
        </PopupScrollableContainer>
      </Popup>
    </>
  )
}
