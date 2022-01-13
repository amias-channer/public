import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Cell, Text, TextButton } from '@revolut/ui-kit'

type Props = {
  description: string
  isExpanded?: boolean
}

export const RewardFullDescription: FC<Props> = ({ description, isExpanded = false }) => {
  const [isExpandedState, setIsExpandedState] = useState<boolean>(isExpanded)

  const { t } = useTranslation('pages.RewardDetails')

  const handleExpand = () => {
    setIsExpandedState(!isExpandedState)
  }

  return (
    <Cell flexWrap="wrap">
      <Text use="p" variant="caption" lineClamp={isExpandedState ? undefined : 2}>
        {description}
      </Text>

      <Box mt="s-8">
        <Text variant="caption">
          <TextButton onClick={handleExpand}>
            {isExpandedState
              ? t('RewardFullDescription.showLessButton')
              : t('RewardFullDescription.showMoreButton')}
          </TextButton>
        </Text>
      </Box>
    </Cell>
  )
}
