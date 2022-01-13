/**
 * Typed version of Object.keys().
 */
export const keys = <T extends object>(obj: T): Array<keyof T> =>
  Object.keys(obj) as Array<keyof T>

// Note: Typescript object keys can only be string | number, or their aliases.
//       The below is equivalent to writing `string | number` instead of `keyof T`.
export const entries = <T extends object>(
  obj: T,
): Array<[keyof T, T[keyof T]]> => keys(obj).map(k => [k, obj[k]])

export const map = <T extends object, V>(
  obj: T,
  fn: (val: T[keyof T], key: keyof T) => V,
): { [K in keyof T]: V } => {
  const ret = {} as any as { [K in keyof T]: V }
  entries(obj).forEach(([k, v]) => {
    ret[k] = fn(v, k)
  })
  return ret
}

export const fromArray = <K extends string | number | symbol, V>(
  arr: Array<[K, V]>,
): Record<K, V> => {
  const obj = {} as Record<K, V>
  arr.forEach(([k, v]) => (obj[k] = v))
  return obj
}

export const trim = <T extends object>(
  obj: T,
): { [K in keyof T]: NonNullable<T[K]> } => {
  const ret = {} as any as { [K in keyof T]: NonNullable<T[K]> }
  entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      ret[k] = v as NonNullable<T[keyof T]>
    }
  })
  return ret
}

export const sort = <T extends object>(obj: T): T =>
  fromArray(entries(obj).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) as T

export const reverse = <
  K extends string | number | symbol,
  V extends string | number | symbol | undefined | null,
>(
  obj: Record<K, V>,
) =>
  fromArray(
    entries(obj)
      .filter((entry): entry is [K, NonNullable<V>] => !!entry[1])
      .map(([k, v]) => [v, k]),
  )
