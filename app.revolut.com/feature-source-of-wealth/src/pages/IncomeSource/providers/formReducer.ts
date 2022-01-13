import { keyBy } from 'lodash'

import {
  SOWCreateEvidence,
  SOWDocumentType,
  SOWIncomeDestinationType,
  SOWCreateEvidenceCurrencyEnum,
  SOWDocumentTypeType,
} from '../../../types'

import { DocumentTypeRecord, SubmissionMeta, QuestionTypeRecord } from '../types'

export enum FormActions {
  SetEvidenceForm = 'SetEvidenceForm',
  SetDocument = 'SetDocument',
  RemoveDocument = 'RemoveDocument',
  SetSOWDocumentTypes = 'SetSOWDocumentTypes',
  SetIncomeDestination = 'SetIncomeDestination',
  ClearForm = 'ClearForm',
  SetDocumentSubQuestions = 'SetDocumentSubQuestions',
  SetSubmissionSubQuestions = 'SetSubmissionSubQuestions',
  SetCurrentDocumentType = 'SetCurrentDocumentType',
  SetSubmissionMeta = 'SetSubmissionMeta',
}

export type FormState = {
  documents: DocumentTypeRecord<File[]>
  documentSubQuestions?: QuestionTypeRecord
  submissionSubQuestions?: QuestionTypeRecord
  evidenceForm: SOWCreateEvidence
  documentTypes?: DocumentTypeRecord<SOWDocumentType>
  incomeDestination: SOWIncomeDestinationType
  userDefinedType?: string
  currentDocumentType?: SOWDocumentTypeType
  submissionMeta?: SubmissionMeta
}

export const initialFormState = {
  evidenceForm: {
    currency: SOWCreateEvidenceCurrencyEnum?.GBP,
  } as SOWCreateEvidence,
  documentSubQuestions: {} as QuestionTypeRecord,
  submissionSubQuestions: {} as QuestionTypeRecord,
  documents: {} as DocumentTypeRecord<File[]>,
  documentTypes: {} as DocumentTypeRecord<SOWDocumentType>,
  incomeDestination: SOWIncomeDestinationType.Unknown,
  submissionMeta: {} as SubmissionMeta,
}

type FormActionType =
  | {
      type: FormActions.SetEvidenceForm
      evidenceForm: SOWCreateEvidence
    }
  | {
      type: FormActions.SetSOWDocumentTypes
      documentTypes?: SOWDocumentType[]
      userDefinedType?: string
    }
  | {
      type: FormActions.SetIncomeDestination
      incomeDestination: SOWIncomeDestinationType
    }
  | {
      type: FormActions.SetDocument
      documents: File[]
      documentType: SOWDocumentTypeType
    }
  | {
      type: FormActions.RemoveDocument
      documentType: SOWDocumentTypeType
      documentToRemove: string
    }
  | {
      type: FormActions.SetDocumentSubQuestions
      documentSubQuestions: QuestionTypeRecord
    }
  | {
      type: FormActions.SetSubmissionSubQuestions
      submissionSubQuestions: QuestionTypeRecord
    }
  | {
      type: FormActions.SetCurrentDocumentType
      currentDocumentType: SOWDocumentTypeType
    }
  | {
      type: FormActions.SetSubmissionMeta
      submissionMeta: SubmissionMeta
    }
  | {
      type: FormActions.ClearForm
    }

export const formReducer = (state: FormState, action: FormActionType): FormState => {
  switch (action.type) {
    case FormActions.SetEvidenceForm:
      return {
        ...state,
        evidenceForm: action.evidenceForm,
      }
    case FormActions.SetSOWDocumentTypes:
      return {
        ...state,
        documentTypes: keyBy(action.documentTypes ?? [], 'type'),
        userDefinedType: action.userDefinedType,
      }
    case FormActions.SetIncomeDestination:
      return {
        ...state,
        incomeDestination: action.incomeDestination,
      }
    case FormActions.SetDocument:
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: [
            ...(state.documents?.[action.documentType] ?? []),
            ...(action.documents ?? []),
          ],
        },
      }
    case FormActions.RemoveDocument:
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: (state.documents?.[action.documentType] ?? []).filter(
            (document: File) => {
              return document.name !== action.documentToRemove
            },
          ),
        },
      }
    case FormActions.SetDocumentSubQuestions:
      return {
        ...state,
        documentSubQuestions: {
          ...state.documentSubQuestions,
          ...action.documentSubQuestions,
        },
      }
    case FormActions.SetSubmissionSubQuestions:
      return {
        ...state,
        submissionSubQuestions: {
          ...state.submissionSubQuestions,
          ...action.submissionSubQuestions,
        },
      }
    case FormActions.SetCurrentDocumentType:
      return {
        ...state,
        currentDocumentType: action.currentDocumentType,
      }
    case FormActions.SetSubmissionMeta:
      return {
        ...state,
        submissionMeta: {
          ...state.submissionMeta,
          ...action.submissionMeta,
        },
      }
    case FormActions.ClearForm:
      return initialFormState
    default:
      return state
  }
}
