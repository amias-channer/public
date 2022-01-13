import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Hint, TextBox, Box } from '@revolut/ui-kit'

import { IconSize } from '@revolut/rwa-core-utils'

import { CopyButton, CopyRenderFunctionProps } from '../../../../Buttons'

export const COPY_ICON_TEST_ID = 'copy-icon-test-id'

type Props = {
  value: string
}

export const CopyDetailButton: FC<Props> = ({ value }) => {
  const { t } = useTranslation('components.CopyButton')
  return (
    <CopyButton value={value}>
      {({ isCopied }: CopyRenderFunctionProps) =>
        isCopied ? (
          t('actions.copied')
        ) : (
          <Hint
            message={<TextBox color="hint">{t('actions.copyToClipboard')}</TextBox>}
            placement="left"
            maxWidth="components.Hint.maxWidth"
          >
            <Box py="px4">
              <Icons.Copy size={IconSize.Small} data-testid={COPY_ICON_TEST_ID} />
            </Box>
          </Hint>
        )
      }
    </CopyButton>
  )
}
