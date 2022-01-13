import { find, findKey, keys } from 'lodash'

import { InfoSign, SandWatch, Check, StatusClockArrows } from '@revolut/icons'
import { Color } from '@revolut/ui-kit'
import { ImagePdfViewerDoc } from '@revolut/rwa-core-components'
import { checkRequired } from '@revolut/rwa-core-utils'

import { API_PREFIX, MimeType } from '../constants/common'

import {
  SOWEvidenceTypeType,
  SOWReviewStateType,
  SOWRequiredAction,
  SOWEvidenceType,
  SOWDocumentType,
  SOWLatestSubmissionPages,
  SOWDocumentTypeType,
  SOTRequiredAction,
  SOTEvidenceType,
  SOTReviewStateType,
  SOTLatestSubmissionPages,
  PartialRecord,
} from '../../types'

type DocumentTypeRecord<T> = PartialRecord<SOWDocumentTypeType, T>

export const isRequested = (action?: SOWRequiredAction | SOTRequiredAction) => {
  return action === SOWRequiredAction.New || action === SOTRequiredAction.New
}

export const isReasked = (action?: SOWRequiredAction | SOTRequiredAction) => {
  return action === SOWRequiredAction.Replace || action === SOTRequiredAction.Replace
}

export const getSubType = (
  evidenceTypes: SOWEvidenceType[] | SOTEvidenceType[] = [],
  incomeSource: string,
) => {
  const evidence = find(
    evidenceTypes,
    (evidenceType: SOWEvidenceType | SOTEvidenceType) =>
      evidenceType.type === incomeSource,
  ) as SOWEvidenceType | SOTEvidenceType
  const subType = evidence?.subTypes ?? {}

  return subType
}

export const getBadge = (reviewState?: SOWReviewStateType | SOTReviewStateType) => {
  switch (reviewState) {
    case SOWReviewStateType.Approved:
    case SOTReviewStateType.Approved:
      return {
        icon: Check,
        color: Color.SUCCESS,
      }
    case SOWReviewStateType.Uploaded:
    case SOTReviewStateType.Uploaded:
      return {
        icon: StatusClockArrows,
      }
    case SOWReviewStateType.UnderReview:
    case SOTReviewStateType.UnderReview:
      return {
        icon: SandWatch,
        color: Color.WARNING,
      }
    case SOWReviewStateType.Rejected:
    case SOWReviewStateType.UpdateRequired:
    case SOTReviewStateType.Rejected:
    case SOTReviewStateType.UpdateRequired:
      return {
        icon: InfoSign,
        color: Color.ACCENT,
      }
    default:
      return {}
  }
}

export const getEmptyType = (
  documentTypes?: DocumentTypeRecord<SOWDocumentType>,
  documents?: DocumentTypeRecord<File[] | undefined>,
) => {
  return findKey(
    documentTypes,
    (documentType) =>
      !keys(documents).includes(documentType?.type as SOWDocumentTypeType),
  ) as SOWDocumentTypeType | undefined
}

export const getEvidenceTypeData = (
  evidenceTypes: SOWEvidenceType[] = [],
  type: SOWEvidenceTypeType,
) => {
  return find(evidenceTypes, ({ type: foundType }) => foundType === type)
}

export const transformPagesToViewerDoc = (
  page: SOWLatestSubmissionPages | SOTLatestSubmissionPages,
): ImagePdfViewerDoc => {
  const isPdf = page.mimeType === MimeType.ApplicationPdf
  const url = `${API_PREFIX}/${page.fileUrl}`
  return {
    id: checkRequired(page.id, 'Page ID is required to open document preview'),
    src: url,
    isPdf,
    pdfSrc: isPdf ? url : undefined,
  }
}
