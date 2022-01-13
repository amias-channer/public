import { TFunction } from 'react-i18next'

import { FormInfo } from 'hooks'
import { I18nNamespace } from 'utils'

import { SOWDocumentTypeType } from '../../../types/generated/sow'
import { FormStateAction } from '../../../hooks'

import { DocumentForm } from '../types'

export enum DocumentAddFormNames {
  DocumentType = 'documentType',
  UserDefinedType = 'userDefinedType',
}

export const getDocumentInfo = (t: TFunction<typeof I18nNamespace.FormsDocumentType>) =>
  ({
    [DocumentAddFormNames.DocumentType]: {
      title: t('documentType.title'),
      description: t('documentType.description'),
      label: t('documentType.label'),
      isLast: true,
    },
    [DocumentAddFormNames.UserDefinedType]: {
      title: t('userDefinedType.title'),
      description: t('userDefinedType.description'),
      label: t('userDefinedType.label'),
      isLast: true,
    },
  } as FormInfo<DocumentAddFormNames>)

export const documentFormState = {
  initialState: DocumentAddFormNames.DocumentType,
  states: {
    [DocumentAddFormNames.DocumentType]: {
      actions: {
        [FormStateAction.Additional]: {
          target: DocumentAddFormNames.UserDefinedType,
        },
      },
    },
    [DocumentAddFormNames.UserDefinedType]: {
      actions: {
        [FormStateAction.Back]: {
          target: DocumentAddFormNames.DocumentType,
        },
      },
    },
  },
}

export const isOtherDocument = (documentType: SOWDocumentTypeType) =>
  documentType === SOWDocumentTypeType.Other

export const documentInitialValues = {} as DocumentForm
