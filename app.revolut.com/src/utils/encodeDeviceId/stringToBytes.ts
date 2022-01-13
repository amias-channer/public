export const stringToBytes = (value: string) =>
  Array.from(unescape(encodeURIComponent(value)), (it) => it.charCodeAt(0))
