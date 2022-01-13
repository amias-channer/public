import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'

const ILLUSTRATIONS_DIR = 'illustrations'

export enum AssetProject {
  Assets = 'assets',
  Business = 'business',
  Media = 'media',
  RetailWebAccount = 'retail-web-account',
}

export const getIllustrationUrl = (assetName: string) =>
  getAsset(`${ILLUSTRATIONS_DIR}/${assetName}.png`)

export const getAsset = (
  name: string,
  project: AssetProject = AssetProject.RetailWebAccount,
) => {
  return `${getConfigValue(ConfigKey.CdnUrl)}/${project}/${name}`
}
