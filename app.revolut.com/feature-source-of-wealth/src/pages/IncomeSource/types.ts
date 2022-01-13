import {
  PartialRecord,
  SOWEvidenceSubType,
  SOWQuestionType,
  SOWQuestionTypeType,
  SOWDocumentType,
  SOWDocumentTypeType,
  SOWEvidenceSubTypeType,
} from '../../types'

export type StepComponentCommonProps = {
  onForward: VoidFunction
  onBack: VoidFunction
  onAdditional: VoidFunction
  onReset: VoidFunction
}

export type DocumentTypeRecord<T> = PartialRecord<SOWDocumentTypeType, T>
export type QuestionTypeRecord = PartialRecord<SOWQuestionTypeType, string>

export type SubmissionMeta = {
  isPrimary: boolean
  evidenceTitle: string
  frequencyTypes: PartialRecord<SOWEvidenceSubTypeType, SOWEvidenceSubType>
  documentsTypes: PartialRecord<SOWDocumentTypeType, SOWDocumentType>
  questionTypes: PartialRecord<SOWQuestionTypeType, SOWQuestionType>
}

export enum ReviewModal {
  Error = 'error',
  General = 'general',
  PrimarySource = 'primarySource',
  Amount = 'amount',
}
