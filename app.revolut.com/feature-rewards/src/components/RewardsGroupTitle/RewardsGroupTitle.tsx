import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text } from '@revolut/ui-kit'

import { Link } from '@revolut/rwa-core-components'

type Props = {
  title: string
  allGroupRewardsLink?: string
}

export const RewardsGroupTitle: FC<Props> = ({ title, allGroupRewardsLink }) => {
  const { t } = useTranslation('pages.RewardsHome')
  return (
    <Flex justifyContent="space-between">
      <Text use="p" fontWeight="bolder" variant="caption" color="rewardsText" pl="s-12">
        {title}
      </Text>
      {allGroupRewardsLink && (
        <Box pr="s-12">
          <Link to={allGroupRewardsLink}>
            <Text fontWeight="bolder" variant="caption">
              {t('RewardsGroup.viewAll')}
            </Text>
          </Link>
        </Box>
      )}
    </Flex>
  )
}
