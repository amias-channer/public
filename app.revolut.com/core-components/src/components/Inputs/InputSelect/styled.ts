import styled from 'styled-components'
import { InputSelect, OptionType, InputSelectProps } from '@revolut/ui-kit'

export const InputSelectStyled: new <
  Value,
  Option extends OptionType<Value> = OptionType<Value>,
>() => React.Component<InputSelectProps<Value, Option>> = styled(InputSelect)`
  width: 100%;
` as any
