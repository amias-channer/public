import { getAsset } from '@revolut/rwa-core-utils'

import { ASSETS_FOLDER } from '../constants'

export const getSOWAssetsUrl = (name: string) => {
  return getAsset(`${ASSETS_FOLDER}/${name}`)
}
