// Needed to prevent regeneratorRuntime is not defined error
import "regenerator-runtime/runtime"
import {
  Middleware,
  RelayNetworkLayerResponse,
} from "react-relay-network-modern"
import { setIsTestnet, getIsTestnet } from "../../../../store"

const testnetMiddleware = (): Middleware => {
  return next =>
    async (req): Promise<RelayNetworkLayerResponse> => {
      const isTestnet = getIsTestnet()
      const res = await next(req)
      setIsTestnet(isTestnet)
      return res
    }
}

export default testnetMiddleware
