import { Middleware } from "react-relay-network-modern"
import tracer from "../../../tracer"

const tracingMiddleware = (): Middleware => next => req => {
  const kind = req.isMutation() ? "mutation" : "query"
  return tracer.trace(`graqhpl.${kind}.${req.getID()}`, () => next(req))
}

export default tracingMiddleware
