import customParams from "./custom"
import { ParamError, parse, nextParser } from "./lib"
import standardParams from "./standard"

const QP = {
  ...customParams,
  ...standardParams,
  ParamError,
  nextParser,
  parse,
} as const
export default QP
