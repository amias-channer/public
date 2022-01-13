import { useMemo, useReducer, useState, createContext, useCallback, FC } from 'react'
import { useParams } from 'react-router-dom'
import { noop, pick } from 'lodash'
import { useHistory } from 'react-router-dom'

import { UUID } from '@revolut/rwa-core-types'

import {
  SOWCreateEvidence,
  SOWDocumentType,
  SOWIncomeDestinationType,
  SOWDocumentTypeType,
} from '../../../types/generated/sow'

import { Url } from '../../../utils'
import { useSubmit, OnSubmitSuccess } from '../hooks'
import { QuestionTypeRecord, SubmissionMeta, ReviewModal } from '../types'

import { formReducer, initialFormState, FormActions, FormState } from './formReducer'

export type IncomeSourceContextType = {
  setEvidenceForm: (values: SOWCreateEvidence) => void
  setDocuments: (values: File[], documentType: SOWDocumentTypeType) => void
  setIncomeDestination: (destination: SOWIncomeDestinationType) => void
  setDocumentTypes: (values?: SOWDocumentType[], userDefinedType?: string) => void
  removeDocument: (fileName: string, documentType: SOWDocumentTypeType) => void
  setDocumentSubQuestions: (value: QuestionTypeRecord) => void
  setSubmissionSubQuestions: (value: QuestionTypeRecord) => void
  setCurrentDocumentType: (value: SOWDocumentTypeType) => void
  setSubmissionMeta: (values: SubmissionMeta) => void
  onSubmit: VoidFunction
  isSubmitting?: boolean
  openedModal?: ReviewModal
  closeSubmitPopup: VoidFunction
  clearForm: VoidFunction
  actionToDoId?: UUID
} & FormState

export const IncomeSourceContext = createContext<IncomeSourceContextType>({
  setEvidenceForm: noop,
  setDocuments: noop,
  removeDocument: noop,
  setIncomeDestination: noop,
  setDocumentTypes: noop,
  onSubmit: noop,
  closeSubmitPopup: noop,
  clearForm: noop,
  setDocumentSubQuestions: noop,
  setSubmissionSubQuestions: noop,
  setCurrentDocumentType: noop,
  setSubmissionMeta: noop,

  ...pick(initialFormState, [
    'evidenceForm',
    'documents',
    'incomeDestination',
    'submissionMeta',
  ]),
})

export const IncomeSourceProvider: FC = ({ children }) => {
  const history = useHistory()
  const { actionToDoId } = useParams<{ actionToDoId?: UUID }>()

  const [openedModal, setOpenedModal] = useState<ReviewModal>()

  const [
    {
      documentSubQuestions,
      submissionSubQuestions,
      evidenceForm,
      documents,
      incomeDestination,
      documentTypes,
      userDefinedType,
      currentDocumentType,
      submissionMeta,
    },
    dispatch,
  ] = useReducer(formReducer, initialFormState)

  const closeSubmitPopup = useCallback(() => {
    setOpenedModal(undefined)
  }, [])

  // Actions

  const setEvidenceForm = useCallback((values: SOWCreateEvidence) => {
    dispatch({ type: FormActions.SetEvidenceForm, evidenceForm: values })
  }, [])

  const setIncomeDestination = useCallback((value: SOWIncomeDestinationType) => {
    dispatch({ type: FormActions.SetIncomeDestination, incomeDestination: value })
  }, [])

  const setDocuments = useCallback(
    (values: File[], documentType: SOWDocumentTypeType) => {
      dispatch({ type: FormActions.SetDocument, documents: values, documentType })
    },
    [],
  )

  const removeDocument = useCallback(
    (fileName: string, documentType: SOWDocumentTypeType) => {
      dispatch({
        type: FormActions.RemoveDocument,
        documentToRemove: fileName,
        documentType,
      })
    },
    [],
  )

  const setDocumentTypes = useCallback(
    (values?: SOWDocumentType[], passedDefinedType?: string) => {
      dispatch({
        type: FormActions.SetSOWDocumentTypes,
        documentTypes: values,
        userDefinedType: passedDefinedType,
      })
    },
    [],
  )

  const setDocumentSubQuestions = useCallback((value: QuestionTypeRecord) => {
    dispatch({ type: FormActions.SetDocumentSubQuestions, documentSubQuestions: value })
  }, [])

  const setSubmissionSubQuestions = useCallback((value: QuestionTypeRecord) => {
    dispatch({
      type: FormActions.SetSubmissionSubQuestions,
      submissionSubQuestions: value,
    })
  }, [])

  const setCurrentDocumentType = useCallback((value: SOWDocumentTypeType) => {
    dispatch({ type: FormActions.SetCurrentDocumentType, currentDocumentType: value })
  }, [])

  const setSubmissionMeta = useCallback((data: SubmissionMeta) => {
    dispatch({
      type: FormActions.SetSubmissionMeta,
      submissionMeta: data,
    })
  }, [])

  const clearForm = useCallback(() => {
    dispatch({
      type: FormActions.ClearForm,
    })
  }, [])

  // Form Submition
  const onSubmitSuccess = useCallback<OnSubmitSuccess>(
    ({ submissionConfigs, submissionLatest }) => {
      clearForm()

      if (actionToDoId) {
        history.push(Url.SowVerificationVerify)
        return
      }

      if (!submissionConfigs?.hasEnoughDeclaredTopup) {
        setOpenedModal(ReviewModal.Amount)
        return
      }

      if (
        submissionLatest?.evidences?.some(({ incomeSource }) => !incomeSource?.primary)
      ) {
        setOpenedModal(ReviewModal.PrimarySource)
        return
      }

      setOpenedModal(ReviewModal.General)
    },
    [actionToDoId, clearForm, history],
  )

  const onSubmitError = useCallback(() => {
    setOpenedModal(ReviewModal.Error)
  }, [])

  const { handleSubmit, isLoading } = useSubmit({
    evidenceForm,
    documents,
    incomeDestination,
    userDefinedType,
    actionToDoId,
    documentSubQuestions,
    submissionSubQuestions,
    onSubmitSuccess,
    onSubmitError,
  })

  return useMemo(
    () => (
      <IncomeSourceContext.Provider
        value={{
          evidenceForm,
          documents,
          documentTypes,
          incomeDestination,
          userDefinedType,
          documentSubQuestions,
          submissionSubQuestions,
          submissionMeta,
          setEvidenceForm,
          setDocuments,
          removeDocument,
          setIncomeDestination,
          setDocumentTypes,
          setDocumentSubQuestions,
          setSubmissionSubQuestions,
          setCurrentDocumentType,
          setSubmissionMeta,
          clearForm,
          actionToDoId,
          currentDocumentType,

          onSubmit: handleSubmit,
          isSubmitting: isLoading,
          openedModal,
          closeSubmitPopup,
        }}
      >
        {children}
      </IncomeSourceContext.Provider>
    ),
    [
      actionToDoId,
      evidenceForm,
      setEvidenceForm,
      documents,
      documentTypes,
      documentSubQuestions,
      submissionSubQuestions,
      submissionMeta,
      setDocuments,
      removeDocument,
      userDefinedType,
      incomeDestination,
      setIncomeDestination,
      setDocumentTypes,
      setDocumentSubQuestions,
      setSubmissionSubQuestions,
      setCurrentDocumentType,
      setSubmissionMeta,
      clearForm,
      currentDocumentType,
      children,
      handleSubmit,
      isLoading,
      openedModal,
      closeSubmitPopup,
    ],
  )
}
