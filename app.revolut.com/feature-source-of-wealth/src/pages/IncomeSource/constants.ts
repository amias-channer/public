import { FormStateAction } from '../../hooks'

export enum FormStep {
  SubForm = 'subForm',
  EvidenceForm = 'evidenceForm',
  SubDocumentForm = 'subDocumentForm',
  DocumentTypeForm = 'documentTypeForm',
  DocumentUploadForm = 'documentUploadForm',
  AccountQuestionForm = 'accountQuestionForm',
  Review = 'review',
}

export const incomeFormState = {
  initialState: FormStep.SubForm,
  states: {
    [FormStep.SubForm]: {
      actions: {
        [FormStateAction.Forward]: {
          target: FormStep.EvidenceForm,
        },
      },
    },
    [FormStep.EvidenceForm]: {
      actions: {
        [FormStateAction.Forward]: {
          target: FormStep.SubDocumentForm,
        },
      },
    },
    [FormStep.SubDocumentForm]: {
      actions: {
        [FormStateAction.Forward]: {
          target: FormStep.DocumentTypeForm,
        },
      },
    },
    [FormStep.DocumentTypeForm]: {
      actions: {
        [FormStateAction.Forward]: {
          target: FormStep.DocumentUploadForm,
        },
      },
    },
    [FormStep.DocumentUploadForm]: {
      actions: {
        [FormStateAction.Forward]: {
          target: FormStep.Review,
        },
        [FormStateAction.Additional]: {
          target: FormStep.AccountQuestionForm,
        },
      },
    },
    [FormStep.AccountQuestionForm]: {
      actions: {
        [FormStateAction.Forward]: {
          target: FormStep.Review,
        },
        [FormStateAction.Additional]: {
          target: FormStep.DocumentUploadForm,
        },
      },
    },
    [FormStep.Review]: {
      actions: {},
    },
  },
}
