import qs from 'qs'
import { useHistory, useLocation } from 'react-router-dom'
import { Side, useMatchBreakpoint } from '@revolut/ui-kit'

import { getCardsOverviewUrl } from '../../../helpers'
import { CardSettings } from './CardSettings'
import { CardSettingsMobile } from './mobile'

export const CardSettingsWrapper = () => {
  const history = useHistory()
  const location = useLocation()
  const isDesktop: null | boolean = useMatchBreakpoint('lg')

  const { cardId } = qs.parse(location.search.substring(1)) as { cardId?: string }

  const handleExit = () => history.push(getCardsOverviewUrl())

  if (!cardId || isDesktop === null) {
    return null
  }

  if (!isDesktop) {
    return <CardSettingsMobile cardId={cardId} />
  }

  return (
    <Side isOpen onExit={handleExit}>
      <CardSettings cardId={cardId} />
    </Side>
  )
}
