import axios from 'axios'

import { UUID } from '@revolut/rwa-core-types'

import { convertArrayBufferToBase64 } from './dataConvertions'

export type ImagePdfViewerDoc = {
  id: UUID
  src: string
  isPdf: boolean
  pdfSrc?: string
}

export const getBase64FromDocument = async (url: string) => {
  const response = await axios.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
  })
  return convertArrayBufferToBase64(response.data)
}

export const transformDocumentsToBase64 = (
  submissionDocs: ImagePdfViewerDoc[],
): Promise<ImagePdfViewerDoc[]> => {
  const base64DocsPromisses = submissionDocs.map((doc): Promise<ImagePdfViewerDoc> => {
    return new Promise((resolve, reject) => {
      const src = doc.isPdf ? doc.pdfSrc : doc.src
      if (src) {
        getBase64FromDocument(src).then((base64Doc) => {
          resolve({
            ...doc,
            src: doc.isPdf
              ? '/assets/icons/filePdf.svg'
              : `data:image/png;base64,${base64Doc}`,
            pdfSrc: doc.isPdf ? `data:application/pdf;base64,${base64Doc}` : '',
          })
        })
      } else {
        reject('No src provided')
      }
    })
  })
  return Promise.all(base64DocsPromisses)
}
