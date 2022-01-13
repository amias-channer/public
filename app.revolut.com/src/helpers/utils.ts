import * as R from 'ramda'
import * as he from 'he'

import {
  ACCEPTED_UPLOAD_TYPES,
  PDF_TYPE,
  IMAGE_TYPES,
  JPEG_QUALITY,
  MAX_W,
} from '../constants/upload'
import {
  getItemFromSessionStorage,
  SessionStorage,
  setItemToSessionStorage,
} from '../constants/storage'
import { TabsEnum } from '../constants/routerPaths'
import {
  StructuredMessageContainer,
  StructuredMessageFileField,
  StructuredMessageContainerType,
  StructuredMessageFieldType,
} from '../constants/structuredMessage'

export const onLoadImage = (url: string) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      resolve({ response: img.src })
    }
    img.onerror = (error) => {
      reject(error)
    }
  }).catch((error) => ({ error }))

export async function onLoadFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader)
    }

    reader.readAsDataURL(file)
  }).catch((error) => ({ error }))
}

export type JSONParseResult = string | number | object | null
export const safeJSONParse = (str: string | null): JSONParseResult => {
  try {
    if (str === null) {
      return null
    }
    return JSON.parse(str)
  } catch (e) {
    return null
  }
}

const propAssigned: any = R.prop('assigned')
const uniqByAssigned: any = R.uniqBy(propAssigned)
const filterAssigned: any = R.filter(propAssigned)
export const uniqAgentsFromTickets: <T>(arr: T[]) => string[] = R.pipe(
  uniqByAssigned,
  filterAssigned,
  R.map(propAssigned)
)

export const decodeHtmlEntities = (str: string): string => {
  let parsedStr
  try {
    parsedStr = he.decode(str)
  } catch (_) {
    parsedStr = str || ''
  }
  return parsedStr
}

export const sortByUpdatedDate = ({
  updatedAt,
}: {
  updatedAt: string
}): number => {
  if (updatedAt) {
    const date = new Date(updatedAt)
    return -date.getTime()
  }

  return 0
}

const typecheckCreator = (Regex: RegExp) => (MIMEtype?: string) => {
  if (!MIMEtype) {
    return false
  }

  return Regex.test(MIMEtype)
}

export const isUploadTypeAcceptable = typecheckCreator(ACCEPTED_UPLOAD_TYPES)
export const isPDFType = typecheckCreator(PDF_TYPE)
export const isImageType = typecheckCreator(IMAGE_TYPES)

type MessageUniqKeyProps = {
  correlationId?: string
  messageId?: string
}
export const getMessageUniqKey = ({
  correlationId,
  messageId,
}: MessageUniqKeyProps): string | undefined => R.or(correlationId, messageId)

export const propMessageIdEq = R.curryN(
  2,
  (
    messageUniqId: string,
    item: {
      correlationId?: string
      messageId?: string
    }
  ) =>
    (item.correlationId && item.correlationId === messageUniqId) ||
    (item.messageId && item.messageId === messageUniqId) ||
    false
)

const getClosedBannersList = () =>
  (getItemFromSessionStorage(SessionStorage.CLOSED_BANNERS) as string[]) || []

export const inClosedBanners = (bannerId: string) => {
  const closedBanners = getClosedBannersList()
  return closedBanners.includes(bannerId)
}

export const addToClosedBanners = (bannerId: string) => {
  const closedBanners = getClosedBannersList()
  closedBanners.push(bannerId)
  setItemToSessionStorage(SessionStorage.CLOSED_BANNERS, closedBanners)
}

export const b64toBlob = (
  b64Data: string,
  contentType = '',
  sliceSize = 512
) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, {
    type: contentType,
  })

  return blob
}

const resizeImage = (fileName: string, cb: (form: FormData) => void) => (
  file: File
) => {
  const result = file?.target.result as string
  const img = new Image()
  img.src = result
  img.addEventListener(
    'load',
    ({ target }: Event) => {
      const element = target as HTMLImageElement

      if (!element || !element.width || !element.height) {
        return
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        return
      }

      if (element.width > MAX_W) {
        const ratio = element.width / element.height
        canvas.width = MAX_W
        canvas.height = Math.round(MAX_W / ratio)
      } else {
        canvas.width = element.width
        canvas.height = element.height
      }

      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(element, 0, 0, canvas.width, canvas.height)

      const compressedData = canvas.toDataURL('image/jpeg', JPEG_QUALITY)

      const block = compressedData.split(';')
      const contentType = block[0].split(':')[1]
      const realData = block[1].split(',')[1]
      const blob = b64toBlob(realData, contentType)

      const formDataToUpload = new FormData()
      formDataToUpload.append('file', blob, fileName)

      cb(formDataToUpload)
    },
    false
  )
}

export const compressImage = (file: File, cb: (form: FormData) => void) => {
  if (file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener('load', resizeImage(file.name, cb), false)
  }
}

export const getLinkToChatTicket = (id: string) =>
  `${TabsEnum.CHAT}/${id}?ticket=${id}`

export const getLinkToForm = (formId: string) => `${TabsEnum.FORM}/${formId}`

export const findFileFields = (
  container: StructuredMessageContainer,
  fileFields: StructuredMessageFileField[] = []
) => {
  container.content.forEach((item) => {
    switch (item.type) {
      case StructuredMessageContainerType.HBOX:
      case StructuredMessageContainerType.VBOX:
        findFileFields(item, fileFields)
        break
      case StructuredMessageFieldType.FILE: {
        fileFields.push(item)
        break
      }
      default:
    }
  })

  return fileFields
}

export const notReachable = (_: never): never => {
  console.error('should never be reached', _)
  throw new Error('should never be reached')
}
