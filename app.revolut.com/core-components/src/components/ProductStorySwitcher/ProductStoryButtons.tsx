import { VFC } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import { Button } from '@revolut/ui-kit'

import { I18nNamespace } from '@revolut/rwa-core-utils'

import { ProductStorySlideButton } from './types'

type ProductStoryButtonsProps = {
  buttons: ProductStorySlideButton[]
  isLastScreen: boolean
  onButtonClick: (args?: Pick<ProductStorySlideButton, 'onClick'>) => void
}

export const ProductStoryButtons: VFC<ProductStoryButtonsProps> = ({
  buttons,
  isLastScreen,
  onButtonClick,
}) => {
  const { t } = useTranslation(I18nNamespace.Common)

  if (isLastScreen && isEmpty(buttons)) {
    return (
      <Button variant="white" onClick={() => onButtonClick()}>
        {t('common:got.it')}
      </Button>
    )
  }

  return (
    <>
      {buttons.map(({ label, onClick }, buttonIndex) => {
        const buttonVariant =
          buttons.length > 1 && buttonIndex === buttons.length - 1 ? 'black' : 'white'

        return (
          <Button
            // eslint-disable-next-line
            key={`${label}-${buttonIndex}`}
            variant={buttonVariant}
            onClick={() => onButtonClick({ onClick })}
          >
            {label}
          </Button>
        )
      })}
    </>
  )
}
