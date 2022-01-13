const getBase64StringWithoutDataPrefix = (base64Image: string) =>
  base64Image.split(',')[1]

export const base64ImageToBlob = (base64Image: string): Blob => {
  const base64String = getBase64StringWithoutDataPrefix(base64Image)

  const byteArray = Uint8Array.from(
    atob(base64String)
      .split('')
      .map((char) => char.charCodeAt(0)),
  )

  return new Blob([byteArray], { type: 'image/jpeg' })
}
