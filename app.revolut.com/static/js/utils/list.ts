export const toArray = (value: any) => (!value ? [] : [].concat(value))

export const splitEvery = (n: number, list: any[]) => {
  if (n <= 0) {
    throw new Error('First argument to splitEvery must be a positive integer')
  }
  const result = []
  let idx = 0
  while (idx < list.length) {
    result.push(list.slice(idx, (idx += n)))
  }
  return result
}
