import { TFunction } from 'react-i18next'
import { I18nNamespace, I18N_VERIFICATIONS_NAMESPACE } from '../../utils'

export const getSideTranslationPath = (name: string) => {
  return `${I18nNamespace.WidgetMoreInfoSide}.${name}`
}

export const getSideTextBlocks = (t: TFunction<typeof I18N_VERIFICATIONS_NAMESPACE>) => {
  return [
    {
      title: t(getSideTranslationPath('whatIsIt.title')),
      text: t(getSideTranslationPath('whatIsIt.text')),
    },
    {
      title: t(getSideTranslationPath('why.title')),
      text: t(getSideTranslationPath('why.text')),
    },
    {
      title: t(getSideTranslationPath('toDo.title')),
      text: t(getSideTranslationPath('toDo.text')),
    },
  ]
}
