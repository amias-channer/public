export const getFistLetter = (str: string) => str[0]

export const addBase64Prefix = (imageString: string) =>
  `data:image/png;base64,${imageString}`
