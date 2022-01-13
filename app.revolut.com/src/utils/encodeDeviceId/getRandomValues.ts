const BINARY_BASE = 2

export const getIntMinAndMax = (bits: 8 | 32) => {
  const min = -Math.pow(BINARY_BASE, bits - 1)
  const max = -min - 1

  return [min, max]
}

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min

const getRandomInt8 = () => {
  const [min, max] = getIntMinAndMax(8)

  return getRandomInt(min, max)
}

const getRandomInt32 = () => {
  const [min, max] = getIntMinAndMax(32)

  return getRandomInt(min, max)
}

export const getRandomValues = <T extends Int8Array | Int32Array>(array: T) => {
  if (window.crypto?.getRandomValues) {
    return window.crypto?.getRandomValues(array)
  }

  const getNextRandomValue = array instanceof Int8Array ? getRandomInt8 : getRandomInt32

  array.forEach((_item: number, index: number, theArray: Int8Array | Int32Array) => {
    theArray[index] = getNextRandomValue()
  })

  return array
}
