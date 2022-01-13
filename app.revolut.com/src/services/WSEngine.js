import qs from 'querystring'

import { eventChannel } from 'redux-saga'

import config from '../config'

import { getFingerprint } from './axios/axios-config'
import {
  getHostname,
  getProxyPath,
  getWebsocketProtocol,
} from '../helpers/hostname'

const { VERSION } = config

const createWebSocket = () => {
  const requestData = qs.stringify({
    'auth-scheme': 'web',
    since: new Date().toISOString(),
  })

  const hostname = getHostname()
  const protocol = getWebsocketProtocol()
  const path = getProxyPath()

  return new WebSocket(
    `${protocol}://${hostname}${path}/client/ws?${requestData}`
  )
}

export class WS {
  constructor() {
    this.WS_TRIES = 3
    this.WS_RESTART_TIMEOUT = 20000
    this.WS_CLOSE_CODE = 1000
    this.WS_AUTH_CLOSE_CODE = 1006
    this.socket = { readyState: 0 }
  }

  open() {
    if (!this.WS_TRIES) {
      console.warn('Reconnection disabled due to many tries.')
      return
    }
    this.socket = createWebSocket()
    this.socket.onopen = this.onOpen
    this.socket.onclose = this.onClose
    this.socket.onerror = this.onError
    this.socket.onmessage = this.onMessage
  }

  close(code = this.WS_CLOSE_CODE) {
    if (window.Cypress || process.env.CHAT_NO_WS) {
      return
    }
    this.socket.close(code)
  }

  isOpen = () => this.socket.readyState === 1

  onOpen = () => {
    if (!(window.Cypress || process.env.CHAT_NO_WS)) {
      this.send({
        version: VERSION,
        userAgent: navigator.userAgent,
        acceptLanguage: navigator.language,
        device: getFingerprint(),
      })
    }
  }

  onClose = (e) => {
    if (window.Cypress || process.env.CHAT_NO_WS) {
      return null
    }
    if (e.code === this.WS_AUTH_CLOSE_CODE) {
      return null
    }
    if (e.code !== this.WS_CLOSE_CODE) {
      setTimeout(() => this.open(), this.WS_RESTART_TIMEOUT)
    }
    return null
  }

  onError = (e) => {
    this.WS_TRIES -= 1
  }

  onMessage = (e) => {
    const message = JSON.parse(e.data)
    if (this.emitter) {
      this.emitter(message)
    }
  }

  send(body) {
    this.socket.send(JSON.stringify({ ...body }))
  }
}

export const wsChannel = (socket) =>
  eventChannel((emitter) => {
    socket.emitter = emitter

    return () => null
  })
