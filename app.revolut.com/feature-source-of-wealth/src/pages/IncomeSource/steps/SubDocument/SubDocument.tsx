import { FC, useContext, useEffect } from 'react'
import { isEmpty } from 'lodash'

import { useDocumentTypes } from '../../../../hooks'
import { FreeForm } from '../../../../forms'

import { StepComponentCommonProps, QuestionTypeRecord } from '../../types'
import { IncomeSourceContext } from '../../providers'

export const SubDocument: FC<StepComponentCommonProps> = ({ onForward }) => {
  const { evidenceForm, setDocumentSubQuestions, documentSubQuestions } =
    useContext(IncomeSourceContext)

  const { questionTypes = [], isLoading } = useDocumentTypes(evidenceForm?.incomeSource)

  const handleSubmit = (values: QuestionTypeRecord) => {
    setDocumentSubQuestions(values)
    onForward()
  }

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (isEmpty(questionTypes)) {
      onForward()
    }
  }, [questionTypes, onForward, isLoading])

  return isEmpty(questionTypes) ? null : (
    <FreeForm
      questions={questionTypes}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      initialValues={documentSubQuestions}
    />
  )
}
