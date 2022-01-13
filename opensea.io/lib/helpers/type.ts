export type MapNonNullable<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

export type Values<T extends Record<string, unknown>> = T[keyof T]

/*
 * Useful for exhausting union type options.
 * If new value is added to an union type, TS will fail if the case is not handled.
 */
export class UnreachableCaseError extends Error {
  public constructor(val: never) {
    super(`Unreachable case: ${val}`)
  }
}

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type IndexSignatureHack<T> = { [K in keyof T]: IndexSignatureHack<T[K]> }

export type Maybe<T> = T | null | undefined

export type SubType<T, U extends T> = U
