import { createContext } from 'react'

type FormState = {
  openForm: (formId: string) => void
}

const initialFormState = {
  openForm: (_: string) => {},
}

export const FormsContext = createContext<FormState>(initialFormState)
