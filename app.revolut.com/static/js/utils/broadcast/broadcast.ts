import { BroadcastChannelName } from './constants'
import { CookieBroadcastChannel } from './cookieBroadcastChannel'
import { BroadcastEventListener, BroadcastMessageData } from './types'

export class Broadcast {
  channel: BroadcastChannel

  constructor(name: BroadcastChannelName) {
    const ChannelClass = window.BroadcastChannel ?? CookieBroadcastChannel

    this.channel = new ChannelClass(name)
  }

  postMessage(data: BroadcastMessageData) {
    this.channel.postMessage(data)
  }

  addEventListener(listener: BroadcastEventListener) {
    this.channel.addEventListener('message', listener)
  }

  removeEventListener(listener: BroadcastEventListener) {
    this.channel.removeEventListener('message', listener)
  }
}
