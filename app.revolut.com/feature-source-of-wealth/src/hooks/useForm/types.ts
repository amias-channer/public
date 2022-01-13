import { FormikTouched, FormikProps, FormikHelpers } from 'formik'
import { FC } from 'react'

import { FormFieldProps } from '@revolut/rwa-core-components'

export type FormInitialValues = {
  [name: string]: any
}

export type FormSchemeComponent<T extends string> = {
  name: T
  Component: FC<FormFieldProps & any>
  props?: any
  initialValue: any
}

export type UseFormHookReturn = FormikProps<FormInitialValues> & {
  isSubmitEnabled: boolean
}

export type UseFormHookArguments<T> = {
  initialValues: T
  validationSchema?: any
  initialTouched?: FormikTouched<T>
  validateOnMount?: boolean
  onSubmit: (values: any, helpers: FormikHelpers<any>) => void
}

export enum FormStateAction {
  Forward = 'Forward',
  Back = 'Back',
  Additional = 'Additional',
}

export type FormState<T> = {
  actions: {
    [key in FormStateAction]?: {
      target: T
      onAction?: VoidFunction
    }
  }
}

export type FormStates<T extends string> = Partial<Record<T, FormState<T>>>

export type FormStateDefinition<T extends string> = {
  initialState?: T
  states: FormStates<T>
}

export type FormValues = {
  title: string
  description: string
  label?: string
  isLast?: boolean
}

export type FormInfo<T extends string> = Record<T, FormValues>

export type FormNavigationTransition = (
  action: FormStateAction,
  fallbackAction?: VoidFunction,
) => void

export type UseFormNavigationArgs = {
  isAdditional?: boolean
  handleSubmit: VoidFunction
  transition: FormNavigationTransition
  onBack?: VoidFunction
  onNext?: VoidFunction
  onAdditional?: VoidFunction
  isLast?: boolean
}
