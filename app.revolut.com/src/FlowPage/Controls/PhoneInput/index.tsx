import React, { ChangeEvent, FC, useCallback, useState } from 'react'
import Infinite from 'react-infinite'
import styled from 'styled-components'
import * as Icons from '@revolut/icons'
import { Box, Flex, Group, Input, Item, Popup, Search, Sticky } from '@revolut/ui-kit'

import { PhoneInputItem, PhoneValue, Region } from '../../../types'
import { includesSubstringCaseInsensitive } from '../../helpers'
import useScrollToRef from '../../useScrollToRef'
import { FALLBACK_REGIONS } from '../common/constants/fallbackRegions'
import CountryFlag from '../common/CountryFlag/CountryFlag'
import { useDebouncedSearch } from '../common/hooks/useDebouncedSearch'
import { useWidgetInputVariant } from '../../../providers'

export const INPUT_NUMBER_TESTID = 'input-number-testid'
export const INPUT_CODE_TESTID = 'input-code-testid'
const DEFAULT_PHONE_CODE = '44'
const CONTAINER_HEIGHT = 530
const ELEMENT_HEIGHT = 76

type Props = {
  value?: Pick<PhoneValue, 'code' | 'number'>
  disabled: boolean
  hint: string
  regions: Region[]
  dropdownHint: PhoneInputItem['dropdownHint']
  searchHint: PhoneInputItem['searchHint']
  changeValue: (value: {
    code?: PhoneValue['code']
    number?: PhoneValue['number']
  }) => void
}

const StyledInput = styled(Input)`
  cursor: pointer;

  & input {
    cursor: pointer;
  }
`

const searchRegions = (regions: Region[], filterValue: string) =>
  regions.filter(
    region =>
      includesSubstringCaseInsensitive(String(region.code), filterValue) ||
      includesSubstringCaseInsensitive(region.description, filterValue),
  )

const PhoneInput: FC<Props> = ({
  value = { code: DEFAULT_PHONE_CODE },
  regions = FALLBACK_REGIONS,
  hint,
  dropdownHint,
  searchHint,
  disabled,
  changeValue,
}) => {
  const inputVariant = useWidgetInputVariant()
  const { ref, scroll } = useScrollToRef()
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const { filterInputValue, filteredItems, debouncedSearch } = useDebouncedSearch<Region>(
    regions,
    searchRegions,
  )

  const handleChangeCode = useCallback(
    (newPhoneCode: number) => {
      changeValue({ code: String(newPhoneCode), number: value?.number })
    },
    [changeValue, value],
  )

  const handleChangePhone = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      changeValue({ code: value?.code, number: event.target.value })
    },
    [changeValue, value],
  )

  return (
    <>
      <Flex alignItems="flex-end" ref={ref}>
        <Box mr="s-16">
          <StyledInput
            data-testid={INPUT_CODE_TESTID}
            variant={inputVariant}
            placeholder={dropdownHint || 'Country'}
            value={`+${value?.code}`}
            disabled={disabled}
            renderAction={() => <Icons.ShevronDown size={24} color="grey-50" />}
            onClick={() => setIsPopupOpen(true)}
          />
        </Box>
        <Input
          data-testid={INPUT_NUMBER_TESTID}
          variant={inputVariant}
          placeholder={hint || 'Number'}
          value={value?.number || ''}
          onChange={handleChangePhone}
          maxLength={16}
          disabled={disabled}
          onFocus={() => scroll()}
        />
      </Flex>
      <Popup
        isOpen={isPopupOpen}
        variant="modal-view"
        onExit={() => setIsPopupOpen(false)}
      >
        <Sticky mb="s-24" zIndex={1}>
          <Search
            value={filterInputValue}
            placeholder={searchHint || 'Search region'}
            onChange={debouncedSearch}
          />
        </Sticky>
        <Group>
          <Infinite containerHeight={CONTAINER_HEIGHT} elementHeight={ELEMENT_HEIGHT}>
            {filteredItems.map(({ countryCode, description, code }) => (
              <Item
                key={countryCode}
                use="button"
                onClick={() => {
                  handleChangeCode(code)
                  setIsPopupOpen(false)
                }}
                style={{ cursor: 'pointer' }}
              >
                <Item.Avatar>
                  <CountryFlag countryCode={countryCode} />
                </Item.Avatar>
                <Item.Content>
                  <Item.Title>{description}</Item.Title>
                  <Item.Description>+{code}</Item.Description>
                </Item.Content>
              </Item>
            ))}
          </Infinite>
        </Group>
      </Popup>
    </>
  )
}

export default PhoneInput
