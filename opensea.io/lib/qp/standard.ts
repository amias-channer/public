import { Arguments, makeParam, Param } from "./lib"

const isStringArray = (values: unknown[]): values is string[] =>
  values.every(value => typeof value === "string")

const makeArrayParam = <T>(param: Param<T>): Param<T[]> =>
  makeParam((arg, name) =>
    Array.isArray(arg)
      ? isStringArray(arg) // Appeases type error
        ? arg.map((value, index) => param(value, `${name}[${index}]`))
        : arg.map((value, index) => param(value, `${name}[${index}]`))
      : undefined,
  )

const makeOptionalParam: {
  <T>(param: Param<T>): Param<T | undefined>
  <T>(param: Param<T>, defaultValue: T): Param<T>
} =
  <T>(param: Param<T>, defaultValue?: T): Param<T | undefined> =>
  (arg, name) =>
    arg === undefined ? defaultValue : param(arg, name)

const booleanParam = makeParam<boolean>(arg =>
  arg === "true" ? true : arg === "false" ? false : undefined,
)

const numberParam = makeParam<number>(arg =>
  typeof arg === "string" ? parseFloat(arg) : undefined,
)

const stringParam = makeParam<string>(arg =>
  typeof arg === "string" ? arg : undefined,
)

const standardParams = {
  Array: makeArrayParam,
  Object: Arguments,
  Optional: makeOptionalParam,
  boolean: booleanParam,
  number: numberParam,
  string: stringParam,
} as const
export default standardParams
