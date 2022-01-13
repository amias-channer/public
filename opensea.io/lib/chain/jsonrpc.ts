import { promisify1 } from "../helpers/promise"

const JSONRPC_VERSION = "2.0"

export interface JSONRPCRequest {
  params: any[]
  method: string
  id: number
  jsonrpc: string
}

export interface JSONRPCResponse<T> {
  result: T
  error?: Error
  id: number
  jsonrpc: string
}

export type Send<T> = (
  request: JSONRPCRequest,
  callback: (error: Error, response: JSONRPCResponse<T>) => unknown,
) => void

const request = async <T>(
  send: Send<T>,
  method: string,
  params: unknown[] = [],
): Promise<T> => {
  const id = new Date().getTime()
  const {
    id: responseId,
    jsonrpc,
    result,
  } = await promisify1(send)({
    id,
    jsonrpc: JSONRPC_VERSION,
    method,
    params,
  })
  if (responseId !== id) {
    console.warn(
      `Unexpected JSON-RPC response id. Expected: ${id}; Got: ${responseId}`,
    )
  }
  if (jsonrpc !== JSONRPC_VERSION) {
    throw new Error(
      `Unexpected JSON-RPC response jsonrpc. Expected: ${JSONRPC_VERSION}; Got: ${jsonrpc}`,
    )
  }
  return result
}

const JSONRPC = {
  request,
}
export default JSONRPC
