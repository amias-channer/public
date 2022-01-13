const BIT_MASK = 255

export const applyXorToBuffer = (buffer: Int8Array, value: ArrayLike<number>) => {
  const result = new Int8Array(buffer)

  for (let i = 0; i < buffer.byteLength; ++i) {
    const j = result.byteLength <= value.length ? i : i % value.length
    // eslint-disable-next-line no-bitwise
    result[i] = BIT_MASK & (result[i] ^ value[j])
  }

  return result
}
