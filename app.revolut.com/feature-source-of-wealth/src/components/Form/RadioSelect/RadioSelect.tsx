import { useCallback } from 'react'
import { RadioGroup, Radio, Item } from '@revolut/ui-kit'

import { RadioSelectFieldProps } from '../types'

export const RadioSelect = <T extends string>({
  onChange,
  value,
  options,
  name,
}: RadioSelectFieldProps<T>) => {
  const handleChange = useCallback(
    (passedValue: T | null) => {
      onChange({ target: { value: passedValue, name } })
    },
    [name, onChange],
  )

  return (
    <RadioGroup value={value} onChange={handleChange}>
      {(group) => (
        <>
          {options.map((option) => (
            <Item use="label" role="button" data-testid={option.value} key={option.value}>
              <Item.Content>
                <Radio {...group.getInputProps({ value: option.value })}>
                  {option.label}
                </Radio>
              </Item.Content>
            </Item>
          ))}
        </>
      )}
    </RadioGroup>
  )
}
