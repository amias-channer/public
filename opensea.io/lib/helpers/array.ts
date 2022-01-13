import React from "react"

export const filter = <T, U = T>(
  array: T[],
  fn?: (element: T) => U,
): Array<NonNullable<U>> =>
  array.filter(fn || (x => x)) as unknown as Array<NonNullable<U>>

export const first = <T>(array: ReadonlyArray<T> | undefined): T | undefined =>
  array?.[0]

export const flatMap = <T, U>(
  array: ReadonlyArray<T>,
  fn: (element: T) => U[],
): U[] => {
  const result: U[] = []
  array
    .map(fn)
    .forEach(elements => elements.forEach(element => result.push(element)))
  return result
}

// React.Children.map filters out true, false, null, and undefined after the mapping
export const mapChildren = <C, T>(
  children: C | C[],
  fn: (child: C, index: number) => T,
): C extends null | undefined
  ? C
  : Array<Exclude<T, boolean | null | undefined>> =>
  // @ts-expect-error TODO: description
  children === null || children === undefined
    ? children
    : React.Children.map(
        (Array.isArray(children) ? children : [children]).map(fn),
        c => c,
      )

export class OrderedSet<T, K> {
  private _elements: T[]
  getKey: (element: T) => K

  get elements(): ReadonlyArray<T> {
    return this._elements
  }

  constructor(getKey: (element: T) => K, elements?: ReadonlyArray<T>) {
    this._elements = []
    this.getKey = getKey
    if (elements) {
      const keys = new Set<K>()
      elements.forEach(e => {
        const key = this.getKey(e)
        if (!keys.has(key)) {
          keys.add(key)
          this._elements.push(e)
        }
      })
    }
  }

  private make(elements: T[]): OrderedSet<T, K> {
    const ret = new OrderedSet(this.getKey)
    ret._elements = elements
    return ret
  }

  add(element: T): OrderedSet<T, K> {
    const index = this._elements.findIndex(
      e => this.getKey(e) === this.getKey(element),
    )
    return this.make(
      index === -1
        ? [...this._elements, element]
        : [
            ...this._elements.slice(0, index),
            element,
            ...this._elements.slice(index + 1),
          ],
    )
  }

  delete(key: K): OrderedSet<T, K> {
    if (!this.has(key)) {
      return this
    }
    return this.make(this._elements.filter(e => this.getKey(e) !== key))
  }

  clear(): OrderedSet<T, K> {
    return this.make([])
  }

  find(key: K): T | undefined {
    return this._elements.find(e => this.getKey(e) === key)
  }

  has(key: K): boolean {
    return this._elements.some(e => this.getKey(e) === key)
  }

  toggle(element: T): OrderedSet<T, K> {
    const key = this.getKey(element)
    if (this.has(key)) {
      return this.delete(key)
    } else {
      return this.add(element)
    }
  }
}
