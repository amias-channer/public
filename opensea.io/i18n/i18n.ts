import React from "react"
import acceptLanguage from "accept-language"
import { NextPageContext } from "next"
import matchAll from "string.prototype.matchall"
import {
  IS_PRODUCTION,
  IS_SERVER,
  Language,
  LANGUAGES,
  SUPPORTED_LANGUAGES,
} from "../constants"
import Cookie from "../lib/cookie"
import {
  Language as LanguageEnum,
  i18nTranslateQuery,
} from "../lib/graphql/__generated__/i18nTranslateQuery.graphql"
import { fetch, graphql } from "../lib/graphql/graphql"
import { flatMap } from "../lib/helpers/array"
import { entries, fromArray, keys, sort } from "../lib/helpers/object"
import { pFormat } from "../lib/helpers/stringUtils"
import TRANSLATIONS from "./translations"
import { TrVarProps } from "./TrVar.react"

matchAll.shim()

export type TrNode = string | React.ReactElement<TrVarProps>

const DEFAULT_LANGUAGE: Language = "en"
const LANGUAGE_ENUMS: Record<Language, LanguageEnum> = {
  en: "ENGLISH",
  ja: "JAPANESE",
  ko: "KOREAN",
}

interface TrCookie {
  acceptLanguage: Language
}

const pendingTranslations: Record<
  Exclude<Language, typeof DEFAULT_LANGUAGE>,
  Record<string, string>
> = { ja: {}, ko: {} }

const cookie = new Cookie<TrCookie>("tr")

const isLanguage = (value: string): value is Language => value in LANGUAGES

acceptLanguage.languages(SUPPORTED_LANGUAGES)

const parseLanguage = (value: string): Language | undefined => {
  const languageCode = acceptLanguage.get(value)
  return languageCode && isLanguage(languageCode) ? languageCode : undefined
}

const getLanguage = (context?: NextPageContext): Language => {
  return (
    cookie.get(context)?.acceptLanguage ??
    (IS_SERVER
      ? context?.req
        ? parseLanguage(String(context.req.headers["accept-language"]))
        : undefined
      : parseLanguage(
          navigator.languages
            ? navigator.languages.join(",")
            : navigator.language,
        )) ??
    DEFAULT_LANGUAGE
  )
}

const setLanguage = (language: Language): void =>
  cookie.set({ acceptLanguage: language })

const tr = (language: Language, nodeOrNodes: TrNode | TrNode[]): TrNode[] => {
  const nodes = Array.isArray(nodeOrNodes) ? nodeOrNodes : [nodeOrNodes]
  if (
    language === DEFAULT_LANGUAGE ||
    !nodes.length ||
    nodes.every(node => node === "" || typeof node !== "string")
  ) {
    return nodes
  }
  const text = nodes
    .map((node, index) =>
      typeof node === "string"
        ? node
        : `<x${index}>${node.props.example}</x${index}>`,
    )
    .join("")
  const localeText = TRANSLATIONS[text]?.[language]
  if (localeText === undefined) {
    if (!IS_PRODUCTION) {
      pendingTranslations[language][text] = ""
      console.log(`l10n: Missing [${language}]: "${text}"`)
    }
    return nodes
  }
  const localeNodes: TrNode[] = []
  let index = 0
  for (const match of Array.from(localeText.matchAll(/<x(\d+)>.*?<\/x\1>/g))) {
    const [matchString, nodeIndex] = match
    if (match.index !== undefined && index < match.index) {
      localeNodes.push(localeText.substring(index, match.index))
      index = match.index
    }
    localeNodes.push(nodes[parseInt(nodeIndex)] ?? "")
    index += matchString.length
  }
  if (index < localeText.length) {
    localeNodes.push(localeText.substring(index))
  }
  return localeNodes
}

// const getDescendants = (
//   node: React.ReactNode,
// ): Array<string | React.ReactElement<TrVarProps>> => {
//   if (Array.isArray(node)) {
//     return flatMap(node, getDescendants)
//   }
//   if (React.isValidElement(node)) {
//     if (isReactElementType(node, TrVar)) {
//       return [node]
//     }
//     return getDescendants(node.props.children)
//   }
//   if (typeof node === "number") {
//     return [String(node)]
//   }
//   if (typeof node === "string") {
//     return [node]
//   }
//   return []
// }

// const substitute = <T extends React.ReactNode>(
//   strings: Iterator<string, string | undefined>,
//   node: T,
// ): T => {
//   const ret = React.Children.map(node, child => {
//     if (typeof child === "string" || typeof child === "number") {
//       return strings.next().value ?? child
//     }
//     if (React.isValidElement(child)) {
//       return React.cloneElement(child, {
//         children: substitute(strings, child.props.children),
//       })
//     }
//     return child
//   }) as T
//   if (Array.isArray(ret) && ret.length === 1) {
//     return ret[0] as T
//   }
//   return ret
// }

const translatePendingStrings = async ({
  useLocalhost,
}: { useLocalhost?: boolean } = {}): Promise<void> => {
  await Promise.all(
    entries(pendingTranslations).map(async ([language, translation]) => {
      const texts = entries(translation)
        .filter(([_source, target]) => !target)
        .map(([source]) => source)
      if (!texts.length) {
        return
      }
      const { translations } = await fetch<i18nTranslateQuery>(
        graphql`
          query i18nTranslateQuery(
            $texts: [String!]!
            $targetLanguage: Language!
          ) {
            translations(texts: $texts, targetLanguage: $targetLanguage) {
              text
            }
          }
        `,
        { texts, targetLanguage: LANGUAGE_ENUMS[language] },
        { useLocalhost },
      )
      texts.forEach((string, i) => {
        pendingTranslations[language][string] = translations[i].text
      })
    }),
  )
}

const logTranslations = (): void => {
  console.log(
    pFormat(
      fromArray(
        Array.from(
          new Set([
            ...keys(TRANSLATIONS),
            ...flatMap(
              entries(pendingTranslations),
              ([_language, translation]) => keys(translation),
            ),
          ]),
        )
          .sort()
          .map(string => [
            string,
            sort({
              ...TRANSLATIONS[string],
              ...fromArray(
                flatMap(
                  entries(pendingTranslations),
                  ([language, translation]) =>
                    translation[string]
                      ? [[language, translation[string]]]
                      : [],
                ),
              ),
            }),
          ]),
      ),
    ),
  )
}

const I18n = {
  getLanguage,
  logTranslations,
  parseLanguage,
  pendingTranslations,
  setLanguage,
  tr,
  translatePendingStrings,
}
export default I18n

if (!IS_PRODUCTION && !IS_SERVER) {
  const w = window as any
  w.I18n = I18n
}
