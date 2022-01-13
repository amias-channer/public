import {
  checkIfRetailApp,
  checkIfRetailAppTest,
  checkIfRetailAppProd,
  checkIfLocalHost,
  checkIfFeatureBranch,
} from './retail'

import config from '../config'

const { ENDPOINTS } = config

export const getHostname = () => {
  const port = window.location.port || '80'

  if (checkIfLocalHost()) {
    return `${ENDPOINTS.LOCAL}:${port}`
  }

  if (checkIfFeatureBranch()) {
    return ENDPOINTS.TEST
  }

  if (window?.location?.host && checkIfRetailApp()) {
    if (checkIfRetailAppTest()) {
      return ENDPOINTS.TEST
    }

    if (checkIfRetailAppProd()) {
      return ENDPOINTS.PROD
    }

    return ENDPOINTS.TEST
  }

  return process.env.BUILD_ENV === 'production'
    ? ENDPOINTS.PROD
    : ENDPOINTS.TEST
}

export const isCodesEnv = () => checkIfRetailAppTest() || checkIfFeatureBranch()

export const getWebsocketProtocol = () => (checkIfLocalHost() ? 'ws' : 'wss')

export const getSiteProtocol = () => (checkIfLocalHost() ? 'http' : 'https')

export const getProxyPath = () => (checkIfLocalHost() ? '/chat/api' : '/api')
