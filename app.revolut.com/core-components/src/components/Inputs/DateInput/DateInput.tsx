import {
  forwardRef,
  KeyboardEvent,
  useState,
  useEffect,
  ChangeEvent,
  MouseEvent,
  FocusEvent,
} from 'react'
import ReactDOM from 'react-dom'
import { InputInnerProps } from '@revolut/ui-kit'

import { KeyboardKey, useCombinedRef } from '@revolut/rwa-core-utils'

import { TextInput } from '../TextInput'
import { DateInputMask } from './DateInputMask'
import { SupportedDateFormat, formatDate, moveInputCursorToValidPosition } from './utils'

const ARROW_KEYS = [
  KeyboardKey.ArrowUp,
  KeyboardKey.ArrowDown,
  KeyboardKey.ArrowLeft,
  KeyboardKey.ArrowRight,
]

type DateInputProps = InputInnerProps & {
  value: string
  onChange: (value: string) => void
  name?: string
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  dateFormat: SupportedDateFormat
  size?: InputInnerProps['size']
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    { value, onChange, placeholder, onBlur, dateFormat, size = 'default', ...restProps },
    ref,
  ) => {
    const [isFocused, setFocused] = useState<boolean>(false)
    const inputRef = useCombinedRef<HTMLInputElement>(null, ref)

    useEffect(() => {
      if (inputRef.current && inputRef.current.parentElement) {
        inputRef.current.parentElement.style.position = 'relative'
      }
    }, [inputRef])

    const handleInputClick = ({ target }: MouseEvent<HTMLInputElement>) => {
      moveInputCursorToValidPosition(target as HTMLInputElement)
    }

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (ARROW_KEYS.includes(e.key as KeyboardKey)) {
        e.preventDefault()
      }
    }

    const handleInputFocus = () => {
      setFocused(true)
    }

    const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      onBlur?.(e)
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(formatDate(event.target.value, value, dateFormat))
    }

    return (
      <>
        <TextInput
          autoComplete="cc-exp"
          size={size}
          placeholder={isFocused && size === 'compact' ? '' : placeholder}
          {...restProps}
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {inputRef.current?.parentElement &&
          (isFocused || value) &&
          ReactDOM.createPortal(
            <DateInputMask mask={dateFormat.toUpperCase()} currentDateValue={value} />,
            inputRef.current?.parentElement,
          )}
      </>
    )
  },
)
