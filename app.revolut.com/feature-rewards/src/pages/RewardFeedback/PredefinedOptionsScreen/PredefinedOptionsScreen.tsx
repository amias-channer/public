import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Cell, Group, Header } from '@revolut/ui-kit'

import { RewardsLayout } from '../../../components'
import { PREDEFINED_FEEDBACK_OPTIONS } from './constants'

type Props = {
  onBackClick: VoidFunction
  onOtherOptionClick: VoidFunction
  onPredefinedOptionSubmit: (optionValue: string) => void
}

export const PredefinedOptionsScreen: FC<Props> = ({
  onBackClick,
  onOtherOptionClick,
  onPredefinedOptionSubmit,
}) => {
  const { t } = useTranslation('pages.RewardFeedback')
  const onPrefefinedOptionClick = (optionValue: string) => () => {
    onPredefinedOptionSubmit(optionValue)
  }

  return (
    <RewardsLayout>
      <Header variant="item">
        <Header.BackButton aria-label="Back" onClick={onBackClick} />
        <Header.Title>{t('pageTitle')}</Header.Title>
        <Header.Subtitle>{t('pageSubtitle')}</Header.Subtitle>
      </Header>
      <Box
        width={{
          all: '100%',
          md: 'components.Rewards.RewardFeedbackOptions.desktopWidth',
        }}
      >
        <Group>
          {PREDEFINED_FEEDBACK_OPTIONS.map(({ i18nTitleKey, value }) => (
            <Cell
              use="button"
              key={value}
              variant="disclosure"
              onClick={onPrefefinedOptionClick(value)}
            >
              {t(i18nTitleKey)}
            </Cell>
          ))}
          <Cell use="button" variant="disclosure" onClick={onOtherOptionClick}>
            {t('PredefinedFeedbackOption.other')}
          </Cell>
        </Group>
      </Box>
    </RewardsLayout>
  )
}
