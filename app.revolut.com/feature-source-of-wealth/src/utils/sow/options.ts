import { map } from 'lodash'
import { OptionType } from '@revolut/ui-kit'

import { Dictionary } from '@revolut/rwa-core-types'

import {
  SOWEvidenceType,
  SOWQuestionTypeType,
  SOWDocumentType,
  SOWEvidenceSubType,
  SOWAnswerQuestionRequest,
  SOTEvidenceType,
  SOTEvidenceSubType,
  SOTDocumentType,
  PartialRecord,
} from '../../types'

type QuetionTypeRecord = PartialRecord<SOWQuestionTypeType, string>

const NON_EXISTING_TYPE = 'DO_NOT_EXIST'

type EntityTypes =
  | SOWEvidenceSubType
  | SOWDocumentType
  | SOWEvidenceType
  | SOTEvidenceSubType
  | SOTDocumentType
  | SOTEvidenceType
  | undefined

export const createOptions = (entityTypes?: EntityTypes[]): OptionType<string>[] => {
  return (
    entityTypes?.map((document) => ({
      value: document?.type ?? NON_EXISTING_TYPE,
      label: document?.title ?? NON_EXISTING_TYPE,
    })) ?? []
  )
}

export const createQuestionOptions = (
  valueToTitle: Dictionary<string>,
): OptionType<string>[] => {
  return map(valueToTitle, (label = NON_EXISTING_TYPE, value = NON_EXISTING_TYPE) => ({
    value,
    label,
  }))
}

export const createAnswers = (values: QuetionTypeRecord): SOWAnswerQuestionRequest[] => {
  return map(values, (value, questionType) => ({
    questionType,
    answer: value,
  })) as SOWAnswerQuestionRequest[]
}
