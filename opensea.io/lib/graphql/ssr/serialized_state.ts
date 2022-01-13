import type { RecordSource } from "relay-runtime"

export interface WiredSerializedState {
  records: ReturnType<RecordSource["toJSON"]>
}

interface WiredWindow {
  __wired__?: WiredSerializedState
}

export function getRelaySerializedState(): WiredSerializedState | undefined {
  return (window as WiredWindow)?.__wired__
}
