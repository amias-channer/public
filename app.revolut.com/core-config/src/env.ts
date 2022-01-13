import findKey from 'lodash/findKey'
import isRegExp from 'lodash/isRegExp'

export enum Env {
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

const ENV_BY_ORIGIN = {
  [Env.Development]: /^http(s)?:\/\/localhost:(3000|9009)$/,
  [Env.Test]: /^https:\/\/([a-z0-9]+\.)?app.revolut.codes$/,
  [Env.Staging]: 'https://beta.app.revolut.com',
  [Env.Production]: 'https://app.revolut.com',
} as const

const getOrigin = () => window.location.origin

export const getEnvByOrigin = () => {
  const origin = getOrigin()
  const env = findKey(ENV_BY_ORIGIN, (url) =>
    isRegExp(url) ? url.test(origin) : url === origin,
  )

  if (!env) {
    throw new Error(`Can not find env for origin: ${origin}`)
  }

  return env as Env
}

export const IS_CYPRESS =
  Boolean(process.env.REACT_APP_CYPRESS_HEADLESS) ||
  Boolean(process.env.REACT_APP_CYPRESS)
export const IS_JEST = Boolean(process.env.JEST_WORKER_ID)
export const IS_MOCKED_API = Boolean(process.env.REACT_APP_REV_PROXY_MODE)
export const IS_CI = Boolean(process.env.CI)

export const isDevelopmentEnv = () => getEnvByOrigin() === Env.Development
export const isProductionEnv = () => getEnvByOrigin() === Env.Production
export const isStagingOrProductionEnv = () =>
  [Env.Staging, Env.Production].includes(getEnvByOrigin())
