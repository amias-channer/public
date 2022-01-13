import React, {
  ContextType,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { isFunction, noop } from "lodash"

type RenderStep =
  | React.ReactNode
  | ((context: MultiStepContext) => React.ReactNode)

export type MultiStepFlowProps = {
  children: RenderStep
  onPrevious?: () => unknown
}

export type MultiStepContext = {
  onPrevious?: () => unknown
  onNext: (render: RenderStep) => unknown
  onReplace: (render: RenderStep) => unknown
}

const DEFAULT_CONTEXT: MultiStepContext = {
  onPrevious: undefined,
  onNext: noop,
  onReplace: noop,
}

export const MultiStepFlowContext = createContext(DEFAULT_CONTEXT)

export type ThemeContextType = ContextType<typeof MultiStepFlowContext>

export const useMultiStepFlowContext = () => useContext(MultiStepFlowContext)

export const MultiStepFlow = ({ children, onPrevious }: MultiStepFlowProps) => {
  const [steps, setSteps] = useState<RenderStep[]>([children])

  const handlePrevious = useCallback(() => {
    onPrevious?.()
    setSteps(prev => prev.slice(0, -1))
  }, [onPrevious])

  const onNext = useCallback((render: RenderStep) => {
    setSteps(prev => [...prev, render])
  }, [])

  const onReplace = useCallback((render: RenderStep) => {
    setSteps([render])
  }, [])

  const currentStep = steps[steps.length - 1]

  const value = useMemo(
    () => ({
      onPrevious: steps.length <= 1 ? undefined : handlePrevious,
      onNext,
      onReplace,
    }),
    [onNext, onReplace, handlePrevious, steps.length],
  )

  return (
    <MultiStepFlowContext.Provider value={value}>
      {isFunction(currentStep) ? currentStep(value) : currentStep}
    </MultiStepFlowContext.Provider>
  )
}

export const withMultiStepFlowContext = <
  T extends MultiStepContext = MultiStepContext,
>(
  WrappedComponent: React.ComponentType<T>,
) => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component"

  const ComponentWithMultiStepFlowContext = (
    props: Omit<T, keyof MultiStepContext>,
  ) => {
    const context = useMultiStepFlowContext()
    return <WrappedComponent {...context} {...(props as T)} />
  }

  ComponentWithMultiStepFlowContext.displayName = displayName

  return ComponentWithMultiStepFlowContext
}
