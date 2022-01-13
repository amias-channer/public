import { useCallback, useState } from 'react'
import { ImagePdfViewerDoc } from '@revolut/rwa-core-components'
import { transformDocumentsToBase64 } from '@revolut/rwa-core-utils'
import { isEmpty } from 'lodash'

import { transformPagesToViewerDoc } from '../../utils/sow/evidences'
import { SOWLatestSubmissionPages } from '../../types/generated/sow'
import { SOTLatestSubmissionPages } from '../../types/generated/sot'

export const useDocumentViewer = (
  pages: SOWLatestSubmissionPages[] | SOTLatestSubmissionPages[],
) => {
  const [isDocViewerOpened, setIsDocViewerOpened] = useState(false)
  const [docPagesLoaderOpen, setDocPagesLoaderOpen] = useState(false)

  const [base64Docs, setBase64Docs] = useState<ImagePdfViewerDoc[]>([])
  const [currentSumbission, setCurrentSubmission] = useState<ImagePdfViewerDoc>()

  const openViewer = useCallback(
    (currentDoc: SOWLatestSubmissionPages | SOTLatestSubmissionPages) => {
      if (!isEmpty(pages)) {
        transformDocumentsToBase64(pages.map(transformPagesToViewerDoc))?.then(
          (docs: ImagePdfViewerDoc[]) => {
            setBase64Docs(docs)
            setCurrentSubmission(transformPagesToViewerDoc(currentDoc))
            setIsDocViewerOpened(true)
            setDocPagesLoaderOpen(false)
          },
        )
      }
    },
    [pages, setBase64Docs],
  )

  return {
    isDocViewerOpened,
    setIsDocViewerOpened,
    docPagesLoaderOpen,
    setDocPagesLoaderOpen,
    base64Docs,
    currentSumbission,
    openViewer,
  }
}
