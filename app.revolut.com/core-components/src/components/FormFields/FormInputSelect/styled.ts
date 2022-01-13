import styled from 'styled-components'
import { OptionType } from '@revolut/ui-kit'

import { themeSpace } from '@revolut/rwa-core-styles'

import { InputSelect, InputSelectProps } from '../../Inputs'

export const InputSelectStyled: new <
  Value,
  Option extends OptionType<Value> = OptionType<Value>,
>() => React.Component<InputSelectProps<Value, Option>> = styled(InputSelect)`
  margin-bottom: ${themeSpace('px24')};
` as any
