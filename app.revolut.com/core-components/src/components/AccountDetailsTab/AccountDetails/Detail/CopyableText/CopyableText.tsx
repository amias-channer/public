import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip, TextBox } from '@revolut/ui-kit'

import { CopyButton } from '../../../../Buttons'

type CopyableTextProps = {
  value: string
}

export const CopyableText: FC<CopyableTextProps> = ({ value }) => {
  const { t } = useTranslation('components.CopyButton')
  const [isTooltipVisible, setTooltipVisible] = useState(false)

  return (
    <Tooltip message={isTooltipVisible ? t('actions.copiedToClipboard') : undefined}>
      <CopyButton value={value} onCopyStateChange={setTooltipVisible}>
        {() => (
          <TextBox color="primary" fontWeight="bolder">
            {value}
          </TextBox>
        )}
      </CopyButton>
    </Tooltip>
  )
}
