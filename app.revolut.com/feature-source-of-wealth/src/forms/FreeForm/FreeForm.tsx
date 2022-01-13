import { FC, useMemo } from 'react'
import { Button, Layout } from '@revolut/ui-kit'

import { EntityBlock, Header, Main } from '../../components'
import { useFormNavigation, useFormState, useTranslation, useForm } from '../../hooks'
import { I18nNamespace } from '../../utils'
import { getFreeForm } from './form'
import { FreeFormProps } from './types'

export const FreeForm: FC<FreeFormProps> = ({
  isLoading,
  onSubmit,
  questions,
  initialValues = {},
}) => {
  const { t: tCommon } = useTranslation(I18nNamespace.Common)
  const { form, formState, formInfo, validations } = getFreeForm(questions)
  const { state: currentState, transition } = useFormState(formState)

  const currentFormState = form[currentState] ?? {}
  const currentFormInfo = formInfo[currentState] ?? {}

  const { Component, name, props: currentFormProps } = currentFormState
  const { description, title, isLast } = currentFormInfo

  const {
    values,
    errors,
    touched,
    isSubmitEnabled,
    handleSubmit,
    handleBlur,
    handleChange,
    isSubmitting,
  } = useForm({
    initialValues,
    validationSchema: validations,
    onSubmit,
  })

  const { goBack, onContinue } = useFormNavigation({
    handleSubmit,
    transition,
    isLast,
  })

  const isNavigationDisabled = useMemo(() => {
    if (!currentState) {
      return true
    }

    if (isLast) {
      return !isSubmitEnabled
    }

    return Boolean(errors[currentState])
  }, [currentState, errors, isLast, isSubmitEnabled])

  return (
    <>
      <Main isLoading={isLoading}>
        <Header onBack={goBack} description={description}>
          {title}
        </Header>

        <EntityBlock>
          {Component ? (
            <Component
              data-testid={name}
              key={name}
              name={name}
              placeholder={title}
              value={values[name]}
              error={errors[name]}
              isTouched={touched[name]}
              component={Component}
              autoFocus
              onBlur={handleBlur}
              onChange={handleChange}
              {...currentFormProps}
            />
          ) : null}
        </EntityBlock>
      </Main>

      <Layout.Actions>
        <Button
          disabled={isNavigationDisabled}
          pending={isSubmitting}
          type="button"
          onClick={onContinue}
          elevated
        >
          {tCommon('continue')}
        </Button>
      </Layout.Actions>
    </>
  )
}
