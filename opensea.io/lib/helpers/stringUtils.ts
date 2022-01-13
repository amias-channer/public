import { inspect } from "util"
import { IS_SERVER, MAX_ASSET_SHORTNAME_LENGTH } from "../../constants"

export const capitalize = (str: string): string =>
  `${str[0]?.toLocaleUpperCase() ?? ""}${str.substring(1)}`

export function formatImageUrl(
  url: string | null,
  fallbackUrl?: string,
  useFallbackIfComplexFallback = false,
): string {
  const OLD_IMG_HOST =
    "https://storage.googleapis.com/opensea-prod.appspot.com/"
  const NEW_IMG_HOST = "https://storage.opensea.io/"

  const fixHost = (oldUrl: string) => {
    return oldUrl.replace(OLD_IMG_HOST, NEW_IMG_HOST)
  }

  if (useFallbackIfComplexFallback) {
    const isAnimated = fallbackUrl && fallbackUrl.endsWith(".gif")
    const isSvg = fallbackUrl && fallbackUrl.endsWith(".svg")
    if (fallbackUrl && (isAnimated || isSvg)) {
      return fixHost(fallbackUrl)
    }
  }
  return fixHost(url || fallbackUrl || "")
}

export function getStaticImageUrlFromOptions(opts: string[]) {
  return opts.filter(o => o && !o.endsWith(".gif") && !o.endsWith(".svg"))[0]
}

export const checkAndReplace = (
  str: string,
  toCheck: string,
  replaceWith: string,
) => {
  return str.split(toCheck).join(replaceWith)
}

export function snakeCaseToCapitalCase(str: string) {
  return checkAndReplace(str, "_", " ").split(" ").map(capitalize).join(" ")
}

export function snakeCaseToSentenceCase(str: string) {
  return capitalize(checkAndReplace(str, "_", " "))
}

export function truncateText(
  str: string,
  maxLength = MAX_ASSET_SHORTNAME_LENGTH,
): string {
  if (!str || str.length <= maxLength) {
    return str
  }

  return str.substr(0, maxLength) + "..."
}

export function truncateTextInMiddle(
  str: string,
  { before, after }: { before: number; after: number },
): string {
  if (str.length <= before) {
    return str
  }

  return (
    truncateText(str, before) + str.substring(str.length - after, str.length)
  )
}

export const isWhitespace = (str: string): boolean => /^\s*$/.test(str)

// djb2
export const hash = (str: string): number => {
  let h = 5381
  for (let i = 0; i < str.length; ++i) {
    h = (h * 33) ^ str.charCodeAt(i)
  }
  return h >>> 0
}

export const isAscii = (str: string): boolean => /^[\x00-\x7F]*$/.test(str)

export const isPrintableAscii = (str: string): boolean =>
  /^[\x1F-\x7F]*$/.test(str)

export const isAsciiLettersOrDigits = (str: string): boolean =>
  /^[A-Za-z0-9]*$/.test(str)

export const strip = (str: string): string => str.replace(/^\s+|\s+$/g, "")

export const pFormat = (obj: any): string =>
  inspect(obj, { colors: true, depth: 4, maxArrayLength: 2 })

export const pLog = (obj: any, logger?: (obj: any) => unknown): void => {
  const output = IS_SERVER ? pFormat(obj) : obj
  if (logger) {
    logger(output)
  } else {
    console.log(output)
  }
}

export const pluralize = (str: string, number: number): string => {
  return `${str}${Math.abs(number) === 1 ? "" : "s"}`
}

export const EM_DASH = "—"
export const NBSP = "\xa0"
