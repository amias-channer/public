import {
  SOWLatestSubmission,
  SOWReviewStateType,
  SOWEvidenceSubTypeType,
  SOWEvidenceTypeType,
  SOWLatestSubmissionStateEnum,
  SOWLatestSubmissionPages,
} from '../../types/generated/sow'

export const LATEST_SUBMISSION: SOWLatestSubmission = {
  id: 'cd21c24d-44d1-4709-933b-4eceb1e4f157',
  state: SOWLatestSubmissionStateEnum.UNDER_REVIEW,
  canAddSource: false,
  reviewState: { type: SOWReviewStateType.UnderReview, title: 'Reviewing' },
  submittedDate: 1612453310746,
  reviewStartedDate: 1620402987515,
  questions: [],
  evidences: [
    {
      id: 'bbd3aee6-dd1d-4d0d-9e75-6a704f1b6616',
      title: 'Salary',
      description: 'Payments from employer',
      incomeSource: {
        type: SOWEvidenceTypeType.Salary,
        title: 'Salary',
        description: 'Payments from employer',
        primary: true,
        incomeFrequency: {
          type: SOWEvidenceSubTypeType.Annual,
          title: 'Annually',
          adverb: 'Annual amount',
        },
      },
      incomeFrequency: {
        type: SOWEvidenceSubTypeType.OneOff,
        title: 'Total',
        adverb: 'In total',
      },
      reviewState: { type: SOWReviewStateType.UnderReview, title: 'Reviewing' },
      amount: '£10,000',
    },
  ],
}

export const LATEST_SUBMISSION_DOCUMENT_PAGE_ID = 'a387fbfa-e39d-4b67-b466-6f2e99af5736'
export const LATEST_SUBMISSION_DOCUMENT_PAGE_MIME_TYPE = 'image/png'
export const LATEST_SUBMISSION_DOCUMENT_PAGE_NAME = 'test'
export const LATEST_SUBMISSION_DOCUMENT_LOADER_ID = 'loader'
export const LATEST_SUBMISSION_DOCUMENT_PAGE_URL =
  'user/current/sof/documents/a387fbfa-e39d-4b67-b466-6f2e99af5736'

export const LATEST_SUBMISSION_DOCUMENT_PAGES: SOWLatestSubmissionPages[] = [
  {
    id: LATEST_SUBMISSION_DOCUMENT_PAGE_ID,
    mimeType: LATEST_SUBMISSION_DOCUMENT_PAGE_MIME_TYPE,
    fileName: LATEST_SUBMISSION_DOCUMENT_PAGE_NAME,
    fileUrl: LATEST_SUBMISSION_DOCUMENT_PAGE_URL,
    reviewState: {
      type: SOWReviewStateType.Uploaded,
      title: 'To be reviewed',
    },
  },
]
