import { FC, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Item } from '@revolut/ui-kit'

import { TopUpTrackingEvent, trackEvent } from '@revolut/rwa-core-analytics'
import { checkRequired } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../../constants'
import { TopUpContext } from '../../TopUpProvider'
import { getTopUpMethodProps } from '../utils'

type CurrentMethodProps = {
  onChange: VoidFunction
}

export const CurrentMethod: FC<CurrentMethodProps> = ({ onChange }) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { method, linkedCard } = useContext(TopUpContext)

  const currentMethodItemProps = getTopUpMethodProps(t, {
    method: checkRequired(method, '"method" can not be empty'),
    card: linkedCard,
  })

  useEffect(() => {
    trackEvent(TopUpTrackingEvent.topUpMethodSelected, {
      method,
      linkedCardId: linkedCard?.id,
    })
  }, [method, linkedCard?.id])

  return (
    <Item>
      <Item.Avatar>{currentMethodItemProps.Icon}</Item.Avatar>
      <Item.Content>
        <Item.Title>{currentMethodItemProps.title}</Item.Title>
        {currentMethodItemProps.description && (
          <Item.Description>{currentMethodItemProps.description}</Item.Description>
        )}
      </Item.Content>
      <Item.Side>
        <Button variant="secondary" size="sm" onClick={onChange}>
          {t('facelift.TopUpMethodsScreen.MethodSelect.changeButtonText')}
        </Button>
      </Item.Side>
    </Item>
  )
}
