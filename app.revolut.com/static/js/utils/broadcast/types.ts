export enum BroadcastMessageType {
  ConfirmEmailDataRequest = 'ConfirmEmailDataRequest',
  ConfirmEmailDataResponse = 'ConfirmEmailDataResponse',
}

export type BroadcastMessageData = {
  type: BroadcastMessageType
  payload: any
}

export type BroadcastEventListener = (message: MessageEvent) => void

export type CookieBroadcastChannelMessage = {
  broadcastId: string
  data: any
}
