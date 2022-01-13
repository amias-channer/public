import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { object as YupObject } from 'yup'
import { Box, TextArea, Header } from '@revolut/ui-kit'

import { PrimaryButton, useForm } from '@revolut/rwa-core-components'

import { RewardsLayout } from '../../../components'
import { rewardFeedbackCommentValidationSchema } from '../../../utils'

type Props = {
  onBackClick: VoidFunction
  onCommentSubmit: (comment: string) => void
}

type FeedbackCommentValues = {
  comment: string
}

const STYLE_NAMESPACE = 'components.Rewards.RewardFeedbackOptions'

const validationSchema = YupObject({
  comment: rewardFeedbackCommentValidationSchema,
})

export const CustomFeedbackScreen: FC<Props> = ({ onBackClick, onCommentSubmit }) => {
  const { t } = useTranslation('pages.RewardFeedback')
  const formSchema = [
    {
      name: 'comment',
      Component: TextArea,
      initialValue: '',
      props: {
        autoFocus: true,
        title: t('CustomFeedbackScreen.textAreaTitle'),
        placeholder: t('CustomFeedbackScreen.textAreaPlaceholder'),
        rows: 5,
      },
    },
  ]

  const onSubmit = (values: FeedbackCommentValues) => {
    onCommentSubmit(values.comment)
  }

  const { FormComponent, formProps, formik } = useForm({
    formSchema,
    validationSchema,
    onSubmit,
  })

  const handleSendButton = () => {
    formik.handleSubmit()
  }

  return (
    <RewardsLayout>
      <Header variant="item">
        <Header.BackButton aria-label="Back" onClick={onBackClick} />
        <Header.Title>{t('pageTitle')}</Header.Title>
        <Header.Subtitle>{t('pageSubtitle')}</Header.Subtitle>
      </Header>
      <Box height={`${STYLE_NAMESPACE}.CustomFeedbackScreen.formHeigth`}>
        <Box
          width={{
            all: '100%',
            md: `${STYLE_NAMESPACE}.desktopWidth`,
          }}
        >
          <FormComponent {...formProps} />
        </Box>
        <PrimaryButton
          mt="s-32"
          width={{
            all: '100%',
            md: `${STYLE_NAMESPACE}.CustomFeedbackScreen.buttonWidth`,
          }}
          disabled={!formik.isValid}
          onClick={handleSendButton}
        >
          {t('CustomFeedbackScreen.sendButton')}
        </PrimaryButton>
      </Box>
    </RewardsLayout>
  )
}
