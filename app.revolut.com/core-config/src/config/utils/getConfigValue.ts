import defaults from 'lodash/defaults'
import isNil from 'lodash/isNil'

import { Env, getEnvByOrigin } from '../../env'
import { CONFIG, DEFAULT_ENV, ConfigKey, Config } from '../config'

const FALLBACK_MAP: Partial<Record<Env, Env>> = {
  [Env.Test]: Env.Development,
}

type GetConfigValueOptions = {
  config?: Config
  fallback?: boolean
}

const DEFAULT_OPTIONS: Required<GetConfigValueOptions> = {
  config: CONFIG,
  fallback: false,
}

export const getConfigValue = <T = string>(
  key: ConfigKey,
  options?: GetConfigValueOptions,
): T => {
  const { config, fallback } = defaults(options, DEFAULT_OPTIONS)

  if (!fallback) {
    return config[getEnvByOrigin()][key] ?? config[DEFAULT_ENV][key]
  }

  let env: Env | undefined = getEnvByOrigin()
  let value = null

  while (!isNil(env) && isNil(value)) {
    value = config[env][key]
    env = FALLBACK_MAP[env]
  }

  return value ?? config[DEFAULT_ENV][key]
}
