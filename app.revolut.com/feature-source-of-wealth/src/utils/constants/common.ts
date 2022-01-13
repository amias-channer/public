export enum QueryKey {
  CurrentUser = 'CurrentUser',

  SubmissionConfigs = 'SubmissionConfigs',
  SubmissionState = 'SubmissionState',
  SubmissionLatest = 'SubmissionLatest',

  SotSubmissionLatest = 'SotSubmissionLatest',

  EvidenceTypes = 'EvidenceTypes',
}

export const ASSETS_FOLDER = 'verifications'

export const API_PREFIX = '/sow'

export const SOT_URL = 'source-of-transaction'
export const SOW_URL = 'source-of-wealth'

export enum Url {
  SotVerification = '/verifications/source-of-transaction',
  SotVerificationVerify = '/verifications/source-of-transaction/verify',

  // Forms: Income Source Add
  SotVerificationFormIncomeSource = '/verifications/source-of-transaction/income-source',
  SotVerificationFormIncomeSourceEvidenceAdd = '/verifications/source-of-transaction/income-source/evidence',
  SotVerificationFormIncomeSourceDocumentAddQuestions = '/verifications/source-of-transaction/income-source/document/questions',
  SotVerificationFormIncomeSourceDocumentAdd = '/verifications/source-of-transaction/income-source/document',
  SotVerificationFormIncomeSourceDocumentUpload = '/verifications/source-of-transaction/income-source/document/:type',
  SotVerificationFormIncomeSourceDocumentAccount = '/verifications/source-of-transaction/income-source/document/:type/account',
  SotVerificationFormIncomeSourceReview = '/verifications/source-of-transaction/income-source/review',

  SowVerification = '/verifications/source-of-wealth',
  SowVerificationVerify = '/verifications/source-of-wealth/verify',

  // Forms: Income Source Add
  SowVerificationFormIncomeSource = '/verifications/source-of-wealth/income-source/:actionToDoId?',
}

export enum ZIndex {
  Sticky = '2',
  Fixed = '3',
}

// SOW Documents

export const MAX_DOCUMENT_COUNT = 50
// in MB, used as a hint for now and not for validation purposes
export const MAX_DOCUMENT_SIZE = 10

// User SOW States
export const USER_LOCKED_STATE = 'LOCKED'
export const USER_SOW_NON_LOCK_STATE = 'REQUESTED'
export const USER_SOW_SOFT_LOCK_STATE = 'REQUIRED'

// TestIds

export enum TestIds {
  MainLoader = 'main-loader-test-id',
}

// Translation Namespaces

export const I18N_VERIFICATIONS_NAMESPACE = 'pages.ComplianceVerifications'

export enum I18nNamespace {
  PageOverview = 'Sow.pages.Overview',
  PageVerify = 'Sow.pages.Verify',

  WidgetLatestSubmission = 'Sow.widgets.LatestSubmission',
  WidgetIncomeSourceSide = 'Sow.widgets.IncomeSourceSide',
  WidgetEntryPoint = 'Sow.widgets.EntryPoint',
  WidgetMoreInfoSide = 'Sow.widgets.MoreInfoSide',

  ComponentsProgress = 'Sow.components.Progress',
  ComponentsDocuments = 'Sow.components.Documents',
  ComponentsModals = 'Sow.components.modals',

  FormsEvidence = 'Sow.forms.Evidence',
  FormsDocumentType = 'Sow.forms.DocumentType',
  FormsAccountQuestion = 'Sow.forms.AccountQuestion',
  FormsDocumentUpload = 'Sow.forms.DocumentUpload',
  FormsReview = 'Sow.forms.Review',

  Common = 'Sow.common',
  Error = 'pages.Error',
}

export enum MimeType {
  ImagePng = 'image/png',
  ImageJpeg = 'image/jpeg',
  ApplicationPdf = 'application/pdf',
}
