import { i18n as I18nInterface } from 'i18next'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

type FormattedMessageProps = {
  defaultMessage: string
  id: string
  namespace: string
}

const checkIfLocalizedValueExists = (
  i18n: I18nInterface,
  id?: string,
  namespace?: string,
) => {
  if (id && namespace) {
    return i18n.exists(`${namespace}:${id}`)
  }

  return null
}

export const FormattedMessage: FC<FormattedMessageProps> = ({
  defaultMessage,
  id,
  namespace,
}) => {
  const { t, i18n } = useTranslation(namespace)
  const doesLocalizedValueExist = checkIfLocalizedValueExists(i18n, id, namespace)

  if (doesLocalizedValueExist) {
    return <div>{t(id)}</div>
  }

  return <div>{defaultMessage}</div>
}
