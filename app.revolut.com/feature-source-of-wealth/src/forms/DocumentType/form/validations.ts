import { TFunction } from 'react-i18next'
import * as Yup from 'yup'

import { I18nNamespace } from 'utils'

import { DocumentAddFormNames, isOtherDocument } from './constants'

export const getDocumentValidation = (t: TFunction<typeof I18nNamespace.Common>) =>
  Yup.object({
    [DocumentAddFormNames.DocumentType]: Yup.string().required(),
    [DocumentAddFormNames.UserDefinedType]: Yup.string().when(
      DocumentAddFormNames.DocumentType,
      {
        is: isOtherDocument,
        then: Yup.string().required(t('requiredField')),
      },
    ),
  })
