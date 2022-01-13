import { FC } from 'react'
import { Button, Layout } from '@revolut/ui-kit'

import { EntityBlock, Header, Main } from '../../components'
import { useFormNavigation, useTranslation, useForm, useFormState } from '../../hooks'
import { I18nNamespace } from '../../utils'

import {
  getDocumentForm,
  isOtherDocument,
  documentFormState,
  DocumentAddFormNames,
  getDocumentInfo,
  getDocumentValidation,
  documentInitialValues,
} from './form'
import { DocumentFormProps } from './types'

export const DocumentType: FC<DocumentFormProps> = ({
  isLoading,
  onSubmit,
  documentTypes,
  initialValues = documentInitialValues,
}) => {
  const { t } = useTranslation(I18nNamespace.FormsDocumentType)
  const { t: tCommon } = useTranslation(I18nNamespace.Common)
  const { state: currentState, transition } =
    useFormState<DocumentAddFormNames>(documentFormState)

  const {
    values,
    errors,
    handleBlur,
    isSubmitting,
    isSubmitEnabled,
    handleSubmit,
    handleChange,
    touched,
  } = useForm({
    initialValues,
    validationSchema: getDocumentValidation(tCommon),
    initialTouched: {
      [DocumentAddFormNames.DocumentType]: true,
    },
    onSubmit,
  })

  const commonFieldProps = {
    onBlur: handleBlur,
    onChange: handleChange,
  }

  const documentForm = getDocumentForm(documentTypes)
  const documentInfo = getDocumentInfo(t)

  const { Component, name, props: currentFormProps } = documentForm[currentState]
  const { description, title, label, isLast } = documentInfo[currentState]

  const showAdditional =
    currentState === DocumentAddFormNames.DocumentType &&
    isOtherDocument(values.documentType)

  const { onContinue, goBack } = useFormNavigation({
    handleSubmit,
    isAdditional: showAdditional,
    transition,
    isLast,
  })

  const isNavigationDisabled = !isSubmitEnabled && Boolean(errors[currentState])

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
