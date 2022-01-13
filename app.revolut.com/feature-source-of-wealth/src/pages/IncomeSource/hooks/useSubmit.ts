import { useCallback } from 'react'
import { QueryObserverResult } from 'react-query'
import { isEmpty } from 'lodash'
import { Dictionary, UUID } from '@revolut/rwa-core-types'

import {
  SOWCreateEvidence,
  SOWIncomeDestinationType,
  SOWConfig,
  SOWLatestSubmission,
} from '../../../types/generated/sow'

import { createAnswers } from '../../../utils'
import {
  useCreateEvidence,
  useCreateDocuments,
  useSubmitEvidenceQuestions,
  useSubmitSubmissionQuestions,
  useSubmissionConfigs,
  useSubmissionLatest,
} from '../../../hooks'

import { QuestionTypeRecord } from '../types'

export type OnSubmitSuccess = (args: {
  submissionConfigs?: SOWConfig
  submissionLatest?: SOWLatestSubmission
}) => void

type UseSubmitArgs = {
  evidenceForm: SOWCreateEvidence
  documents: Dictionary<File[]>
  incomeDestination: SOWIncomeDestinationType
  documentSubQuestions?: QuestionTypeRecord
  submissionSubQuestions?: QuestionTypeRecord
  userDefinedType?: string
  actionToDoId?: UUID
  onSubmitSuccess: OnSubmitSuccess
  onSubmitError: VoidFunction
}

export const useSubmit = ({
  evidenceForm,
  documents,
  incomeDestination,
  documentSubQuestions,
  actionToDoId,
  submissionSubQuestions,
  userDefinedType,
  onSubmitSuccess,
  onSubmitError,
}: UseSubmitArgs) => {
  const { refetch: refetchConfigs, submissionConfigs } = useSubmissionConfigs()
  const { refetch: refetchSubmission } = useSubmissionLatest()

  const alertId = submissionConfigs?.alertId

  const { createDocuments, isLoading: isDocumentLoading } = useCreateDocuments({
    onSuccess: async () => {
      let newSubmissionLatest: QueryObserverResult<SOWLatestSubmission | undefined>
      let newSubmissionConfigs: QueryObserverResult<SOWConfig | undefined>

      try {
        newSubmissionLatest = await refetchSubmission()
        newSubmissionConfigs = await refetchConfigs()
      } catch {
        // ToDo: Add better Error Handling DNT-495
        onSubmitError()
        return
      }

      onSubmitSuccess({
        submissionLatest: newSubmissionLatest.data,
        submissionConfigs: newSubmissionConfigs.data,
      })
    },
    onError: onSubmitError,
  })

  const { submitQuestions } = useSubmitEvidenceQuestions({
    onError: onSubmitError,
  })

  const { submitQuestions: submitSubmissionQuestions } = useSubmitSubmissionQuestions({
    onError: onSubmitError,
  })

  const { createEvidence, isLoading: isEvidenceLoading } = useCreateEvidence({
    onSuccess: ({ data }) => {
      createDocuments({
        documents,
        userDefinedType,
        evidenceId: data.id,
      })

      if (submissionSubQuestions && !isEmpty(submissionSubQuestions)) {
        submitSubmissionQuestions(createAnswers(submissionSubQuestions))
      }

      if (documentSubQuestions && !isEmpty(documentSubQuestions)) {
        submitQuestions({
          data: createAnswers(documentSubQuestions),
          evidenceId: data.id,
        })
      }
    },
    onError: onSubmitError,
  })

  const handleSubmit = useCallback(() => {
    createEvidence({
      ...evidenceForm,
      incomeDestination,
      actionToDoId,
      alertId,
    })
  }, [createEvidence, incomeDestination, evidenceForm, alertId, actionToDoId])

  return {
    handleSubmit,
    isLoading: isDocumentLoading || isEvidenceLoading,
  }
}
