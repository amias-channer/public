import { useSignUpTranslation } from '../hooks'

export const Description = () => {
  const t = useSignUpTranslation()

  return (
    <>
      <div>{t('PurposeScreen.description.part1')}</div>
      <div>{t('PurposeScreen.description.part2')}</div>
    </>
  )
}
