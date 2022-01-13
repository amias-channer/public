import { v4 as uuid } from 'uuid'

import { CookieStorage, BaseStorage } from '@revolut/rwa-core-utils'

import {
  BroadcastEventListener,
  BroadcastMessageData,
  CookieBroadcastChannelMessage,
} from './types'

const BROADCAST_STORAGE_KEY = 'broadcast'
const STORAGE_EXPIRES_SECONDS = 5

export const UPDATES_CHECK_INTERVAL_MS = 500

/**
 * IMPORTANT! Only one message at a time is supported.
 */
export class CookieBroadcastChannel implements BroadcastChannel {
  /**
   * Channel's id (UUID)
   */
  id: string

  /**
   * "message" event handlers
   */
  messageListeners: Set<BroadcastEventListener>

  /**
   * Storage accessible by all browser's tabs withing the same origin
   */
  storage: BaseStorage<string>

  constructor(readonly name: string) {
    this.id = uuid()
    this.messageListeners = new Set()
    this.storage = new BaseStorage(new CookieStorage(STORAGE_EXPIRES_SECONDS))

    setInterval(() => {
      const message =
        this.storage.getItem<CookieBroadcastChannelMessage>(BROADCAST_STORAGE_KEY)

      // No messages available
      if (!message) {
        return
      }

      // Skip own messages
      if (message.broadcastId === this.id) {
        return
      }

      if (this.messageListeners.size === 0) {
        return
      }

      this.storage.removeItem(BROADCAST_STORAGE_KEY)

      this.messageListeners.forEach((listener) => {
        listener({
          data: message.data,
        } as MessageEvent)
      })
    }, UPDATES_CHECK_INTERVAL_MS)
  }

  postMessage(data: BroadcastMessageData) {
    const payload: CookieBroadcastChannelMessage = {
      broadcastId: this.id,
      data,
    }

    this.storage.setItem(BROADCAST_STORAGE_KEY, payload)
  }

  addEventListener<K extends keyof BroadcastChannelEventMap>(
    type: K,
    listener: (this: BroadcastChannel, ev: BroadcastChannelEventMap[K]) => any,
  ) {
    if (type !== 'message') {
      throw new Error(`Unsupported event type: ${type}`)
    }

    this.messageListeners.add(listener)
  }

  removeEventListener<K extends keyof BroadcastChannelEventMap>(
    type: K,
    listener: (this: BroadcastChannel, ev: BroadcastChannelEventMap[K]) => any,
  ) {
    if (type !== 'message') {
      throw new Error(`Unsupported event type: ${type}`)
    }

    this.messageListeners.delete(listener)
  }

  dispatchEvent(): boolean {
    throw new Error('Not implemented')
  }

  close() {
    throw new Error('Not implemented')
  }

  get onmessage(): ((this: BroadcastChannel, ev: MessageEvent) => any) | null {
    throw new Error('Not implemented')
  }

  get onmessageerror(): ((this: BroadcastChannel, ev: MessageEvent) => any) | null {
    throw new Error('Not implemented')
  }
}
