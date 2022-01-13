import { FC, useContext, useMemo, useEffect } from 'react'
import { isEmpty } from 'lodash'

import { useSubmissionConfigs, useSubmissionLatest } from '../../../../hooks'
import { FreeForm } from '../../../../forms'

import { StepComponentCommonProps, QuestionTypeRecord } from '../../types'
import { IncomeSourceContext } from '../../providers'

export const SubForm: FC<StepComponentCommonProps> = ({ onForward }) => {
  const { actionToDoId, setSubmissionSubQuestions, submissionSubQuestions } =
    useContext(IncomeSourceContext)

  const { submissionLatest, isLoading: isSubmissionLatestLoading } = useSubmissionLatest()
  const { submissionConfigs, isLoading } = useSubmissionConfigs()

  const questions = useMemo(
    () => submissionConfigs?.questionTypes ?? [],
    [submissionConfigs?.questionTypes],
  )

  const handleSubmit = (values: QuestionTypeRecord) => {
    setSubmissionSubQuestions(values)
    onForward()
  }

  useEffect(() => {
    if (isLoading || isSubmissionLatestLoading) {
      return
    }

    if (
      isEmpty(questions) ||
      !isEmpty(submissionLatest?.questions) ||
      Boolean(actionToDoId)
    ) {
      onForward()
    }
  }, [
    actionToDoId,
    onForward,
    isLoading,
    isSubmissionLatestLoading,
    questions,
    submissionLatest?.questions,
  ])

  return isEmpty(questions) ? null : (
    <FreeForm
      questions={questions}
      isLoading={isLoading || isSubmissionLatestLoading}
      onSubmit={handleSubmit}
      initialValues={submissionSubQuestions}
    />
  )
}
