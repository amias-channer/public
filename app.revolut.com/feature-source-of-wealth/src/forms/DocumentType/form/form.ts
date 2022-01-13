import { FormSchemeComponent } from 'hooks'

import { SOWDocumentType } from '../../../types/generated/sow'
import { RadioSelect, TextInput } from '../../../components'
import { createOptions } from '../../../utils'
import { DocumentAddFormNames } from './constants'

export const getDocumentForm = (documentsTypes?: Array<SOWDocumentType | undefined>) => {
  return {
    [DocumentAddFormNames.DocumentType]: {
      name: DocumentAddFormNames.DocumentType,
      Component: RadioSelect,
      props: {
        options: createOptions(documentsTypes),
      },
    },
    [DocumentAddFormNames.UserDefinedType]: {
      name: DocumentAddFormNames.UserDefinedType,
      Component: TextInput,
    },
  } as Record<DocumentAddFormNames, FormSchemeComponent<DocumentAddFormNames>>
}
