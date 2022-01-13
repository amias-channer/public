import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Group } from '@revolut/ui-kit'

import { RewardsGroupTitle } from '../../../../components'
import { Action } from './Action'

type Props = {
  rewardRules: string[]
}

export const RewardRules: FC<Props> = ({ rewardRules }) => {
  const { t } = useTranslation('pages.RewardDetails')
  return (
    <Box>
      <Box>
        <RewardsGroupTitle title={t('RewardRules.title')} />
      </Box>
      <Box mt="s-12">
        <Group>
          {rewardRules.map((action, actionIndex) => (
            <Action key={action} description={action} stepNumber={actionIndex + 1} />
          ))}
        </Group>
      </Box>
    </Box>
  )
}
