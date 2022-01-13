import { FormikErrors } from 'formik'
import { MutableRefObject, useCallback, useRef } from 'react'

import { checkRequired } from '@revolut/rwa-core-utils'

import { FormFieldName, FormValues } from '../form'

export type Rule = {
  self: FormFieldName
  next: FormFieldName
}

export const useFormAutoFocus = (
  rules: readonly Rule[],
  refs: { [name: string]: MutableRefObject<HTMLInputElement | undefined> },
) => {
  const isInitialCallRef = useRef(true)

  return useCallback(
    (errors: FormikErrors<FormValues>) => {
      const activeElement = document.activeElement

      rules.some((item) => {
        if (refs[item.self].current !== activeElement) {
          return false
        }

        if (errors[item.self]) {
          return true
        }

        const nextRefCurrent = checkRequired(
          refs[item.next].current,
          '"nextRefCurrent" can not be empty',
        )

        nextRefCurrent.focus()

        return true
      })

      if (isInitialCallRef.current) {
        rules.some((item) => {
          if (!errors[item.self]) {
            return false
          }

          const selfRefCurrent = checkRequired(
            refs[item.self].current,
            '"selfRefCurrent" can not be empty',
          )

          isInitialCallRef.current = false
          selfRefCurrent.focus()

          return true
        })
      }
    },
    [rules, refs],
  )
}
