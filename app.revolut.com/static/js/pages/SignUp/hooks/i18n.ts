import { useTranslation } from 'react-i18next'

export const useSignUpTranslation = () => {
  const { t } = useTranslation('pages.SignUp')

  return t
}
