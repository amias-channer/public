export const stringToBase64 = (buffer: ArrayBuffer) =>
  btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''),
  )
