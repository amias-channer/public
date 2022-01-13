import { VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { MoreBar } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { I18nNamespace } from '@revolut/rwa-core-utils'

type ActionsBarProps = {
  onStatementClick: VoidFunction
}

export const ActionsBar: VFC<ActionsBarProps> = ({ onStatementClick }) => {
  const { t } = useTranslation(I18nNamespace.Common)

  return (
    <MoreBar>
      <MoreBar.Action useIcon={Icons.Statement} onClick={onStatementClick}>
        {t('statement')}
      </MoreBar.Action>
    </MoreBar>
  )
}
