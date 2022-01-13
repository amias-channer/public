export const applyValuesToBuffer = (
  buffer: Int8Array,
  ...values: ArrayLike<number>[]
) => {
  const valuesLength = values
    .map((value) => value.length)
    .reduce((value, acc) => acc + value, 0)

  if (buffer.length !== valuesLength) {
    throw new Error('Provided values amount is less than buffer length')
  }

  const result = new Int8Array(buffer)

  let currentIndex = 0

  for (let i = 0; i < values.length; ++i) {
    for (let j = 0; j < values[i].length; ++j) {
      result[currentIndex] = values[i][j]

      currentIndex += 1
    }
  }

  return result
}
