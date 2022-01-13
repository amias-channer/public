import { Input } from '@revolut/ui-kit'
import * as React from 'react'
import { useIntl } from 'react-intl'

export const TEST_ID_SURVEY_ADDITIONAL_FEEDBACK =
  'TEST_ID_SURVEY_ADDITIONAL_FEEDBACK'

type Props = {
  onChange?: (e: React.SyntheticEvent<HTMLInputElement>) => void
  focusOnRender?: boolean
}

export const RateComment: React.FC<Props> = ({
  onChange,
  focusOnRender = false,
}) => {
  const commentRef = React.useRef<HTMLInputElement & typeof Input>(null)
  const { formatMessage } = useIntl()

  React.useEffect(() => {
    if (focusOnRender && commentRef.current) {
      commentRef.current.focus()
    }
  })

  const placeholder = formatMessage({
    id: 'supportChat.survey.additionalFeedback',
    defaultMessage: 'Additional feedback',
  })

  return (
    <Input
      data-testid={TEST_ID_SURVEY_ADDITIONAL_FEEDBACK}
      variant='filled'
      ref={commentRef}
      placeholder={placeholder}
      onChange={onChange}
    />
  )
}
