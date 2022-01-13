import { createContext, useContext } from 'react'
import { InputVariant } from '@revolut/ui-kit'

type WidgetContextType = {
  isWidgetMode: boolean
  // TODO: Used for business web chat widget to render forms in floating widow with grey variant.
  // This could be deleted in the future, when new design will be implement for access recovery and dexter.
  inputVariant?: InputVariant
}

export const WidgetContext = createContext<WidgetContextType>({
  isWidgetMode: false,
})

export const useIsWidgetMode = () => {
  const { isWidgetMode } = useContext(WidgetContext)
  return isWidgetMode
}

export const useWidgetInputVariant = () => {
  const { inputVariant } = useContext(WidgetContext)
  return inputVariant
}
