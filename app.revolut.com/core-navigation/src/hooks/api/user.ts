import axios, { AxiosResponse } from 'axios'

import { isDevelopmentEnv } from '@revolut/rwa-core-config'
import { convertArrayBufferToBase64 } from '@revolut/rwa-core-utils'

const convertResponseDataToBase64 = (response: AxiosResponse<ArrayBuffer>) =>
  convertArrayBufferToBase64(response.data)

export const getUserPicture = () => {
  const userPictureUrl = '/retail/user/current/picture'

  if (isDevelopmentEnv()) {
    return axios.get<ArrayBuffer>(userPictureUrl).then(convertResponseDataToBase64)
  }

  return axios
    .get<ArrayBuffer>(userPictureUrl, { responseType: 'arraybuffer' })
    .then(convertResponseDataToBase64)
}
