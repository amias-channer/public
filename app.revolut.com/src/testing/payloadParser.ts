export function parsePayloadData(payloadData: FormData | string) {
  if (!payloadData) {
    return undefined
  }

  if (payloadData instanceof FormData) {
    const jsObject: { [val: string]: any } = {}

    for (const [key, value] of payloadData.entries()) {
      let parsedValue

      if (value instanceof File) {
        // We didn't have use case for it yet.
        // Might require more granular parsing to be able to assert.
        parsedValue = value
      } else {
        parsedValue = JSON.parse(value)
      }

      // Currently we assume that keys can't be repeated but FormData allows
      // to do that, e.g.:
      // https://bitbucket.org/revolut/revolut-biz-frontend/src/2519c0a83bc94fa1a1f0b7f40c88818f87c14a3f/src/api/transactionMonitoring/transactionMonitoring.ts#lines-55
      // TODO: Resolve such cases, probably we should treat that as arrays.
      jsObject[key] = parsedValue
    }

    return jsObject
  }

  return JSON.parse(payloadData)
}
