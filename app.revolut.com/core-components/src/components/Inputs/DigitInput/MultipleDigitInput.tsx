import { Fragment, FC, RefObject } from 'react'
import { Flex } from '@revolut/ui-kit'

import { DigitInput } from './DigitInput'
import { SeparatorStyled } from './styled'

type InputsProps = {
  ref: RefObject<HTMLInputElement>
  key: string
  isFilled: boolean
  onChange: (value: string) => void
  autoFocus?: boolean
}

type MultipleDigitInputProps = {
  size: 4 | 6
  disabled?: boolean
  inputsProps: InputsProps[]
}

export const MultipleDigitInput: FC<MultipleDigitInputProps> = ({
  inputsProps,
  size,
  disabled,
}) => (
  <Flex alignItems="center">
    {inputsProps.map(({ key, ...rest }, index) => {
      const CodeInputComponent = (
        <DigitInput key={key} size={size} index={index} disabled={disabled} {...rest} />
      )

      if (size === 6 && index === 3) {
        return (
          <Fragment key={key}>
            <SeparatorStyled> - </SeparatorStyled>
            {CodeInputComponent}
          </Fragment>
        )
      }

      return CodeInputComponent
    })}
  </Flex>
)
