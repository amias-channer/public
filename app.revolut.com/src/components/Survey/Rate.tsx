import * as Icons from '@revolut/icons'
import {
  Box,
  Button,
  Flex,
  Radio,
  RadioGroup,
  Text,
  TextBox,
} from '@revolut/ui-kit'
import * as R from 'ramda'
import * as React from 'react'
import { FormattedMessage } from 'react-intl'

import { RateComment } from './RateComment'
import {
  FloatingButtonWrapper,
  StarButton,
  SurveyRateWrapper,
  SurveyFeedback,
  SurveyStarsWrapper,
} from './styles'
import { isRateBad, isRateGood } from './utils'

export const TEST_ID_SURVEY_RATE = 'TEST_ID_SURVEY_RATE'
export const TEST_ID_SURVEY_BAD_RATING = 'TEST_ID_SURVEY_BAD_RATING'

const FeedbackId = {
  UNHAPPY_WITH_REVOLUT: 'chat.resolution.feedback.not-happy-with-revolut',
  UNHAPPY_WITH_AGENTS_APPROACH:
    'chat.resolution.feedback.not-happy-with-agents-approach',
}

type Props = {
  onRate: (rate: number, feedbackId: string, feedback: string) => void
}

export const Rate: React.FC<Props> = ({ onRate }) => {
  const [displayRate, setDisplayRate] = React.useState<number>(0)
  const [rate, setRate] = React.useState<number>(0)
  const [surveyOption, setSurveyOption] = React.useState<string>(
    FeedbackId.UNHAPPY_WITH_REVOLUT
  )
  const [feedback, setFeedback] = React.useState<string>('')

  const renderStars = () => {
    const starsTopPadding = rate > 0 ? '2rem' : null

    return (
      <SurveyStarsWrapper data-testid={TEST_ID_SURVEY_RATE} px='1.5rem'>
        {!rate && (
          <TextBox pt='2rem' pb='0.75rem' fontWeight={500}>
            <FormattedMessage
              id='supportChat.survey.rate'
              defaultMessage='Rate this conversation'
            />
          </TextBox>
        )}
        <Flex justifyContent='flex-start' pt={starsTopPadding}>
          {R.range(1, 6).map((currentRate) => (
            <StarButton
              key={`star_${currentRate}`}
              onMouseEnter={() => {
                setDisplayRate(currentRate)
              }}
              onMouseLeave={() => {
                setDisplayRate(0)
              }}
              onClick={() => {
                setRate(currentRate)
              }}
            >
              {(rate || displayRate) >= currentRate ? (
                <Icons.StarFilled size='32' color='primary' />
              ) : (
                <Icons.StarEmpty size='32' color='primary' />
              )}
            </StarButton>
          ))}
        </Flex>
        {isRateGood(rate) && (
          <TextBox fontWeight={500} pt='1.5rem'>
            <FormattedMessage
              id='supportChat.survey.goodRateSurveyHeader'
              defaultMessage='Great! Would you like to leave some kind words?'
            />
          </TextBox>
        )}
        {isRateBad(rate) && (
          <TextBox fontWeight={500} pt='1.5rem'>
            <FormattedMessage
              id='supportChat.survey.badRateSurveyHeader'
              defaultMessage="We're sorry that you had a poor experience. Please tell us more"
            />
          </TextBox>
        )}
      </SurveyStarsWrapper>
    )
  }

  const renderSurvey = () => {
    const getFeedbackId = (): string =>
      // feedbackId is used only during the negative scenario.
      isRateGood(rate) ? '' : surveyOption

    const sendTicketRate = () => {
      const feedbackId = getFeedbackId()
      onRate(rate, feedbackId, feedback)
    }

    return (
      <SurveyFeedback>
        {isRateBad(rate) && (
          <RadioGroup
            value={surveyOption}
            onChange={(selectedSurveyOption) => {
              setSurveyOption(selectedSurveyOption)
            }}
          >
            {(group) => (
              <Box data-testid={TEST_ID_SURVEY_BAD_RATING}>
                <Box mb='1rem'>
                  <Radio
                    {...group.getInputProps({
                      value: FeedbackId.UNHAPPY_WITH_REVOLUT,
                    })}
                  >
                    <Text variant='secondary'>
                      <FormattedMessage
                        id='supportChat.survey.unhappyWithRevolut'
                        defaultMessage="I'm not happy with how Revolut works"
                      />
                    </Text>
                  </Radio>
                </Box>
                <Box mb='1rem'>
                  <Radio
                    {...group.getInputProps({
                      value: FeedbackId.UNHAPPY_WITH_AGENTS_APPROACH,
                    })}
                  >
                    <Text variant='secondary'>
                      <FormattedMessage
                        id='supportChat.survey.unhappyWithAgentsApproach'
                        defaultMessage="I'm not happy with the agent's approach"
                      />
                    </Text>
                  </Radio>
                </Box>
              </Box>
            )}
          </RadioGroup>
        )}
        <Box mb='3rem' mt='2rem' height='3.375rem'>
          <RateComment
            onChange={(event) => {
              setFeedback(event.currentTarget.value)
            }}
            focusOnRender={!isRateBad(rate)}
          />
        </Box>
        <FloatingButtonWrapper>
          <Button onClick={sendTicketRate}>
            <FormattedMessage
              id='supportChat.survey.send'
              defaultMessage='Send'
            />
          </Button>
        </FloatingButtonWrapper>
      </SurveyFeedback>
    )
  }

  return (
    <SurveyRateWrapper
      alignItems='center'
      style={rate > 0 ? { position: 'absolute' } : {}}
    >
      {renderStars()}
      {rate > 0 && renderSurvey()}
    </SurveyRateWrapper>
  )
}
