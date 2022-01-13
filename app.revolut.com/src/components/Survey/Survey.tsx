import { History } from 'history'
import * as React from 'react'
import { useDispatch } from 'react-redux'

import { TicketsResponseType, TicketStatus } from '../../api/ticketTypes'
import { FullHeightPages, TabsEnum } from '../../constants/routerPaths'
import { rateTicket } from '../../redux/reducers/survey'
import { patchTicket } from '../../redux/reducers/tickets'

import { Rate } from './Rate'
import { Resolve } from './Resolve'

const SurveyState = {
  RESOLVE: 'resolve',
  RATE: 'rate',
  RATED: 'rated',
}

const THANK_YOU_TIMEOUT = 4000

type Props = {
  ticket: TicketsResponseType | undefined
  history: History
  messages: any
}

export const Survey: React.FC<Props> = ({ ticket, history }) => {
  const dispatch = useDispatch()
  const [surveyState, setSurveyState] = React.useState<string>(
    SurveyState.RESOLVE
  )

  const onTicketRated = () => {
    history.replace(FullHeightPages.SURVEY_COMPLETED)

    setTimeout(() => {
      history.replace(TabsEnum.CHAT)
    }, THANK_YOU_TIMEOUT)
  }

  const onRate = (rate: number, feedbackId: string, feedback: string) => {
    if (ticket) {
      dispatch(rateTicket(onTicketRated, ticket.id, rate, feedbackId, feedback))
    }
  }

  const onCancel = () => {
    if (ticket) {
      dispatch(
        patchTicket({
          ticketId: ticket.id,
          payload: { state: TicketStatus.ASSIGNED },
        })
      )
    }
  }

  const onResolve = () => {
    setSurveyState(SurveyState.RATE)
  }

  switch (surveyState) {
    case SurveyState.RESOLVE: {
      return <Resolve onCancel={onCancel} onResolve={onResolve} />
    }
    case SurveyState.RATE: {
      return <Rate onRate={onRate} />
    }
    default: {
      return null
    }
  }
}
