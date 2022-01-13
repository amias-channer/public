import { FC } from 'react'
import { useHistory } from 'react-router-dom'

import { useFormState, FormStateAction } from '../../hooks'

import { FormStep, incomeFormState } from './constants'
import { IncomeSourceProvider } from './providers'
import { getComponentFromStep } from './utils'

export const IncomeSource: FC = () => {
  const history = useHistory()
  const {
    state: currentState,
    transition,
    reset,
  } = useFormState<FormStep>(incomeFormState)

  const Component = getComponentFromStep(currentState)

  const handleForward = () => {
    transition(FormStateAction.Forward)
  }

  const handleAdditional = () => {
    transition(FormStateAction.Additional)
  }

  const handleBack = () => {
    transition(FormStateAction.Back, history.goBack)
  }

  const handleReset = () => {
    reset()
  }

  return (
    <IncomeSourceProvider>
      <Component
        onBack={handleBack}
        onForward={handleForward}
        onAdditional={handleAdditional}
        onReset={handleReset}
      />
    </IncomeSourceProvider>
  )
}
