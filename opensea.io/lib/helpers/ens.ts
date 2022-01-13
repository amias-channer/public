interface DomainConfig {
  [registrarAddress: string]: string
}

export const registrarAddressToDomain: DomainConfig = {
  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85": ".eth",
  "0xfac7bea255a6990f749363002136af6556b31e04": ".eth",
  "0x2a187453064356c898cae034eaed119e1663acb8": ".dcl.eth",
}

export const isName = (name: string) => {
  const length = name.replace(/\.eth$/, "").length
  return length >= 3 && !name.includes(" ")
}

export const isQualifiedName = (name: string) =>
  isName(name) &&
  Object.values(registrarAddressToDomain).some(domain => name.endsWith(domain))
