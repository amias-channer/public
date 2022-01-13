import { useCallback } from "react"
import I18n from "../i18n/i18n"
import useAppContext from "./useAppContext"

export const useTranslations = () => {
  const { language } = useAppContext()

  const tr = useCallback(
    (text: string) => {
      const result = I18n.tr(language, text)[0]
      return typeof result === "string" ? result : text
    },
    [language],
  )

  return { tr }
}
