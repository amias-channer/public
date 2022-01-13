import { FC, useMemo } from 'react'
import { Button, Layout } from '@revolut/ui-kit'

import { SOWCreateEvidence } from '../../types/generated/sow'

import { EntityBlock, Header, Main } from '../../components'
import { useFormNavigation, useTranslation, useFormState, useForm } from '../../hooks'
import { I18nNamespace } from '../../utils'
import {
  getIncomeSourceForm,
  isOtherIncomeSource,
  getIncomeSourceInfo,
  incomeSourceFormState,
  IncomeSourceAddFormNames,
  incomeSourceInitialValues,
  getIncomeSourceValidation,
} from './form'
import { EvidenceFormProps } from './types'

export const Evidence: FC<EvidenceFormProps> = ({
  isLoading,
  onSubmit,
  evidenceTypes,
  initialValues = incomeSourceInitialValues as SOWCreateEvidence,
}) => {
  const { t } = useTranslation(I18nNamespace.FormsEvidence)
  const { t: tCommon } = useTranslation(I18nNamespace.Common)
  const { state: currentState, transition } =
    useFormState<IncomeSourceAddFormNames>(incomeSourceFormState)

  const {
    values,
    errors,
    setValues,
    setFieldValue,
    isSubmitting,
    isSubmitEnabled,
    handleBlur,
    handleSubmit,
    handleChange,
    touched,
  } = useForm({
    initialValues,
    validationSchema: getIncomeSourceValidation(tCommon),
    onSubmit,
    initialTouched: {
      [IncomeSourceAddFormNames.IncomeSource]: true,
      [IncomeSourceAddFormNames.IncomeFrequency]: true,
      [IncomeSourceAddFormNames.MinorAmount]: true,
    },
  })

  const commonFieldProps = {
    onBlur: handleBlur,
    onChange: handleChange,
  }

  const incomeSourceForm = getIncomeSourceForm(
    values,
    setFieldValue,
    setValues,
    evidenceTypes,
  )
  const incomeSourceInfo = getIncomeSourceInfo(t)

  const { Component, name, props: currentFormProps } = incomeSourceForm[currentState]
  const { description, title, label, isLast } = incomeSourceInfo[currentState]

  const showAdditional =
    currentState === IncomeSourceAddFormNames.IncomeSource &&
    isOtherIncomeSource(values.incomeSource)

  const { goBack, onContinue } = useFormNavigation({
    isAdditional: showAdditional,
    handleSubmit,
    transition,
    isLast,
  })

  const isNavigationDisabled = useMemo(() => {
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

        <EntityBlock title={label}>
          <Component
            key={name}
            name={name}
            placeholder={title}
            value={values[name]}
            error={errors[name]}
            isTouched={touched[name]}
            component={Component}
            autoFocus
            {...commonFieldProps}
            {...currentFormProps}
          />
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
