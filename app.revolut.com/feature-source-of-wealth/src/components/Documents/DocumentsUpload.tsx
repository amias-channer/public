import { FC } from 'react'

import { useTranslation } from '../../hooks'
import { I18nNamespace } from '../../utils'
import { EntityBlock } from '../Common'
import { Upload } from '../Upload'
import { DocumentItem } from './DocumentItem'

type DocumentsUploadProps = {
  documents: File[]
  onDocumentsChange: (files: File[]) => void
  onDocumentsRemove: (name: string) => void
}

export const DocumentsUpload: FC<DocumentsUploadProps> = ({
  documents,
  onDocumentsChange,
  onDocumentsRemove,
}) => {
  const { t } = useTranslation(I18nNamespace.ComponentsDocuments)

  const handleChange = (values: FileList | null) => {
    const documentsList = Array.from(values ?? [])
    onDocumentsChange(documentsList)
  }

  const handleRemove = (fileName: string) => {
    onDocumentsRemove(fileName)
  }

  return (
    <EntityBlock title="Documents">
      <Upload onChange={handleChange} name="documents">
        {t('DocumentsUpload.title')}
      </Upload>

      {documents?.map((document) => (
        <DocumentItem
          key={document.name}
          fileName={document.name}
          size={document.size}
          onDelete={handleRemove}
        >
          {document.name}
        </DocumentItem>
      ))}
    </EntityBlock>
  )
}
