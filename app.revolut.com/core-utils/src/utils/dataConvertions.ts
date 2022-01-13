export const convertArrayBufferToBase64 = (data: ArrayBuffer) =>
  Buffer.from(data).toString('base64')
