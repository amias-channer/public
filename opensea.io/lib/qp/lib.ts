import { NextPageContext } from "next"
import { map, trim } from "../helpers/object"
import Router from "../helpers/router"

type Argument = string | string[] | Arguments | Arguments[]
type Arguments = { [key: string]: Argument | undefined }
export type Param<T> = (arg: Argument | undefined, name?: string) => T
type Params<T extends object> = { [K in keyof T]: Param<T[K]> }

export class ParamError extends TypeError {
  constructor(message: string) {
    super(message)
    this.name = "ParamError"
  }
}

export const makeParam =
  <T>(fn: (arg: Argument, name: string) => T | undefined): Param<T> =>
  (arg, name = "") => {
    if (arg === undefined) {
      throw new ParamError(`Required parameter \`${name}\` not provided.`)
    }
    const value = fn(arg, name)
    if (value === undefined) {
      throw new ParamError(
        `Invalid parameter \`${name}\`. Got: ${JSON.stringify(arg)}`,
      )
    }
    return value
  }

export const Arguments = <T extends object>(params: Params<T>): Param<T> =>
  makeParam((arg, name) =>
    typeof arg === "object" && !Array.isArray(arg)
      ? (trim(
          map(params, (param, key) =>
            param(
              arg[key as string],
              name ? `${name}.${key}` : (key as string),
            ),
          ),
        ) as T)
      : undefined,
  )

export const parse = <T extends object>(
  params: Params<T>,
  context?: NextPageContext,
): T => Arguments(params)(Router.getQueryParams(context))

export const nextParser =
  <T extends object, U>(
    params: Params<T>,
    callback: (args: T, context: NextPageContext) => U,
  ) =>
  (context: NextPageContext): U =>
    callback(parse(params, context), context)
