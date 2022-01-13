import * as R from 'ramda'

const trimArrayStrings = (arr = []) =>
  R.map((el) => {
    if (R.is(String, el)) {
      return R.trim(el)
    }
    return el
  }, arr)

export const trimAll = (data = {}) => {
  if (R.is(Array, data)) {
    return data
  } else if (R.is(Object, data)) {
    let transformations = {}
    const dataKeys = R.keys(data)
    dataKeys.forEach((key) => {
      const el = data[key]
      if (el) {
        if (R.is(String, el)) {
          transformations = R.assoc(key, R.trim, transformations)
        } else if (R.is(Array, el)) {
          transformations = R.assoc(key, trimArrayStrings, transformations)
        } else if (R.is(Object, el)) {
          transformations = R.assoc(key, trimAll, transformations)
        }
      }
    })
    return R.evolve(transformations, data)
  }
  return data
}
