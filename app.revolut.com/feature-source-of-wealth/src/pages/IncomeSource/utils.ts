import { FormStep } from './constants'

import {
  Review,
  Evidence,
  DocumentType,
  AccountQuestion,
  DocumentUpload,
  SubForm,
  SubDocument,
} from './steps'

export const getComponentFromStep = (step: FormStep) => {
  switch (step) {
    case FormStep.SubForm:
      return SubForm
    case FormStep.EvidenceForm:
      return Evidence
    case FormStep.SubDocumentForm:
      return SubDocument
    case FormStep.DocumentTypeForm:
      return DocumentType
    case FormStep.DocumentUploadForm:
      return DocumentUpload
    case FormStep.AccountQuestionForm:
      return AccountQuestion
    case FormStep.Review:
      return Review
    default:
      throw new Error(`Component for step ${step} does not exist`)
  }
}
