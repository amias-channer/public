import { FC, useContext } from 'react'
import { keyBy, flatten } from 'lodash'

import { useEvidenceTypes } from '../../../../hooks'
import { getEvidenceTypeData } from '../../../../utils'
import { Evidence as EvidenceForm, EvidenceFormSubmit } from '../../../../forms'

import { StepComponentCommonProps } from '../../types'
import { IncomeSourceContext } from '../../providers'

export const Evidence: FC<StepComponentCommonProps> = ({ onForward }) => {
  const { evidenceForm, setEvidenceForm, setSubmissionMeta } =
    useContext(IncomeSourceContext)

  const { evidenceTypes, isLoading } = useEvidenceTypes()

  const handleSubmit: EvidenceFormSubmit = (values) => {
    setEvidenceForm(values)
    const foundEvidenceData = getEvidenceTypeData(evidenceTypes, values.incomeSource)

    setSubmissionMeta({
      isPrimary: foundEvidenceData?.primary ?? false,
      evidenceTitle: foundEvidenceData?.title ?? '',
      frequencyTypes: keyBy(foundEvidenceData?.subTypes?.availableSubTypes, 'type'),
      documentsTypes: keyBy(flatten(foundEvidenceData?.documentTypes), 'type'),
      questionTypes: keyBy(foundEvidenceData?.questionTypes, 'question'),
    })

    onForward()
  }

  return (
    <EvidenceForm
      evidenceTypes={evidenceTypes}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      initialValues={evidenceForm}
    />
  )
}
