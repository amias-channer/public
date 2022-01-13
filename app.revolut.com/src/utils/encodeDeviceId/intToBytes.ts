export const int32ToBytes = (value: number) => {
  const array = new ArrayBuffer(4)
  const view = new DataView(array)

  view.setInt32(0, value, false)

  return new Int8Array(array)
}

export const int64ToBytes = (value: bigint): Int8Array => {
  const array = new ArrayBuffer(8)
  const view = new DataView(array)

  view.setBigInt64(0, value, false)

  return new Int8Array(array)
}
