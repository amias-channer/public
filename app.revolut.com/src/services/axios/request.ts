// @ts-ignore

import * as qs from 'querystring'

import axios, { AxiosError, AxiosResponse } from 'axios'
import * as R from 'ramda'
import { CANCEL } from 'redux-saga'

import { trimAll } from './trimAll'
import { ChatAxios } from './axios-config'
import {
  getHostname,
  getProxyPath,
  getSiteProtocol,
} from '../../helpers/hostname'

const cache = new Map()

type ConfigType = {
  searchParams?: {
    [key: string]: string | number
  }
  withCredentials?: boolean
  cache?: boolean
  trim?: boolean
  data?: any
  url?: string
  baseURL?: string
}

export const request = (config: ConfigType = {}) => {
  const source = axios.CancelToken.source()

  const promise = new Promise((onSuccess, onFailure) => {
    const cached = config.cache === true

    const configData = config.data
    const isTrimmed = config.trim && configData && !R.is(FormData, configData)
    const data = isTrimmed ? trimAll(configData) : configData

    if (config.searchParams) {
      const searchParamsString = qs.stringify(config.searchParams)
      config.url = `${config.url}?${searchParamsString}`
    }

    const { url } = config
    if (cached && cache.has(url)) {
      const resp = cache.get(url)
      onSuccess(R.pathOr(resp, ['data'], resp))
      return () => source.cancel()
    }

    const reqSuccess = (resp: AxiosResponse) => {
      if (cached) {
        cache.set(url, resp)
      }
      onSuccess(resp)
    }

    const reqFailed = (error: AxiosError) => {
      if (!axios.isCancel(error)) {
        onFailure(error)
      }
    }

    const hostname = getHostname()
    const protocol = getSiteProtocol()
    const proxyPath = getProxyPath()
    config.baseURL = `${protocol}://${hostname}${proxyPath}/client`
    config.withCredentials = true
    ChatAxios.request(
      R.merge(config, { cancelToken: source.token, data })
    ).then(reqSuccess, reqFailed)
    return null
  })

  promise[CANCEL] = source.cancel

  return promise
}

export const get = (url: string, config: ConfigType = {}) =>
  request(R.merge(config, { method: 'get', url }))

export const post = (url: string, data: any, config: ConfigType = {}) =>
  request(R.mergeAll([{ trim: true }, config, { method: 'post', url, data }]))

export const put = (url: string, data: any, config: ConfigType = {}) =>
  request(R.merge(config, { method: 'put', url, data }))

export const patch = (url: string, data: any, config: ConfigType = {}) =>
  request(R.mergeAll([{ trim: true }, config, { method: 'patch', url, data }]))
export const remove = (url: string, data: any, config: ConfigType = {}) =>
  request(R.merge(config, { method: 'delete', url, data }))
