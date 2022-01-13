import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { Box, Details, Flex, Hint, TextBox } from '@revolut/ui-kit'

import { IconSize } from '@revolut/rwa-core-utils'

import { CopyDetailButton } from './CopyDetailButton'
import { CopyableText } from './CopyableText'
import { DetailProps } from './types'

export const Detail: FC<DetailProps> = ({ detail: { title, hint, value } }) => (
  <Details>
    <Details.Title>{title}</Details.Title>
    <Details.Note>
      <Flex>
        <Box flex={1}>
          <CopyableText value={value} />

          {hint && (
            <Flex ml={1} data-testid="account-detail-hint">
              <Hint
                message={<TextBox color="hint">{hint}</TextBox>}
                placement="right"
                maxWidth="components.Hint.maxWidth"
              >
                <Icons.InfoOutline size={IconSize.Small} color="hint" />
              </Hint>
            </Flex>
          )}
        </Box>

        <CopyDetailButton value={value} />
      </Flex>
    </Details.Note>
  </Details>
)
