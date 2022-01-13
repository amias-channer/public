/**
 * Why we should use this component?
 * revolut/ui-kit doesn't include default browser's select in InputSelect component.
 * On mobile devices we must use default options list behavior for better user experience.
 * This component could be useless when we start to use other UI library.
 */

import React, { FC, useEffect, useMemo, useCallback } from 'react'
import { Box, InputSelect, Text, Media } from '@revolut/ui-kit'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'
import { ifProp } from 'styled-tools'

const StyledSelect = styled.select`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
`

const RelativeBox = styled(Box)`
  position: relative;
`

const CustomLabel = styled(Text)<{ hasPlaceholder?: boolean }>`
  position: absolute;
  left: 1rem;
  right: 1.5rem;
  bottom: ${ifProp('hasPlaceholder', '6px', 'inherit')};
  height: 1.5rem;
  overflow: hidden;
  white-space: nowrap;
`

type Props = {
  options: { value: string; label: string }[]
  value?: string
  disabled?: boolean
  placeholder?: string
  onChange: (value: string) => void
}

const HiddenSelect: FC<Props> = ({ options, onChange, value, disabled }) => {
  const optionsList = options.map(item => <option key={item.value}>{item.label}</option>)

  return (
    <StyledSelect
      onChange={event => onChange(event.target.value)}
      value={value}
      disabled={disabled}
    >
      {optionsList}
    </StyledSelect>
  )
}

const EMPTY_VALUE = 'empty'

const AdaptiveSelect: FC<Props> = ({
  options,
  value,
  onChange,
  disabled,
  placeholder,
}) => {
  const labelText = useMemo(
    () => options.reduce((acc, item) => (item.value === value ? item.label : acc), value),
    [value, options],
  )
  const renderLabel = useCallback(
    () =>
      isMobile ? (
        <CustomLabel hasPlaceholder={Boolean(placeholder)}>
          {labelText || options[0].label}
        </CustomLabel>
      ) : (
        ''
      ),
    [placeholder, labelText, options],
  )
  const defaultValue = isMobile ? EMPTY_VALUE : (options.length && options[0].value) || ''
  const inputSelectValue = isMobile ? EMPTY_VALUE : value
  const inputSelectOptions = useMemo(
    () => (isMobile ? [...options, { value: EMPTY_VALUE, label: ' ' }] : options),
    [options],
  )

  const renderOptions = (select: any) =>
    select
      .matchOptions(inputSelectOptions, { keys: ['title', 'label'] })
      .map((item: any) => (
        <InputSelect.Option
          key={item.value}
          {...select.getOptionProps(item)}
          style={{ padding: '1.5rem 1rem' }}
        >
          <Media>{item.label}</Media>
        </InputSelect.Option>
      ))

  useEffect(() => {
    if (isMobile && !value && options.length) {
      onChange(options[0].value)
    }
  }, [onChange, options, value])

  return (
    <RelativeBox>
      <InputSelect
        variant="filled"
        value={inputSelectValue}
        defaultValue={defaultValue}
        onChange={onChange}
        options={inputSelectOptions}
        placeholder={placeholder || ''}
        disabled={disabled}
        renderLabel={renderLabel}
        dropdown={{
          fitInAnchor: true,
          flip: true,
          maxHeight: 220,
          zIndex: 101,
        }}
      >
        {renderOptions}
      </InputSelect>
      {isMobile && (
        <HiddenSelect
          options={options}
          onChange={onChange}
          value={value || options[0].value}
        />
      )}
    </RelativeBox>
  )
}

export default AdaptiveSelect
