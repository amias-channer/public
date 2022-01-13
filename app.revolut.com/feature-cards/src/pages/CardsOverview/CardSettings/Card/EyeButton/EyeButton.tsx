import { FC, MouseEvent } from 'react'
import * as Icons from '@revolut/icons'
import { Badge } from '@revolut/ui-kit'

import { EyeButtonBase } from './styled'

export const CARD_EYE_ICON_TEST_ID = 'eye-icon-test-id'

type EyeButtonProps = {
  isShowState: boolean
  onClick: (event: MouseEvent<HTMLDivElement>) => void
}

export const EyeButton: FC<EyeButtonProps> = ({ isShowState, onClick }) => (
  <EyeButtonBase data-testid={CARD_EYE_ICON_TEST_ID} onClick={onClick}>
    <Badge
      bg="grey-90"
      color="grey-tone-50"
      useIcon={isShowState ? Icons.EyeShow : Icons.EyeHide}
      size={24}
    />
  </EyeButtonBase>
)
