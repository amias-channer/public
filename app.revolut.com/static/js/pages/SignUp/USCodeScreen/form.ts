import { USCodeScreenScheme } from './types'
import { USCodeInput } from './USCodeInput'

export const formSchema: USCodeScreenScheme = [
  {
    name: 'usCode',
    Component: USCodeInput,
    initialValue: '',
  },
]
