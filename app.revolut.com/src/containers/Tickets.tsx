import * as React from 'react'
import { Box, Text } from '@revolut/ui-kit'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { TicketsResponseType } from '../api/ticketTypes'
import {
  NewTicket,
  Ticket,
  TicketsWrapper,
  ViewHideButton,
} from '../components'
import { Loader } from '../components/Loader'
import { TabsEnum, TicketPaths } from '../constants/routerPaths'
import * as actionCreators from '../redux/reducers/tickets'
import {
  isSupportOnlineSelector,
  supportArrivalTimeSelector,
  isAnonymousSelector,
} from '../redux/selectors/auth'
import { getTicketsListLoading } from '../redux/selectors/loading'
import {
  assignedTicketsSelector,
  awaititngResponseTicketsSelector,
  oldTicketsSelector,
  openTicketsSelector,
  resolvedTicketsSelector,
} from '../redux/selectors/tickets'
import { getLinkToChatTicket } from '../helpers/utils'
import { SettingsContext } from '../providers'

export const TEST_ID_CHAT_TICKETS = 'TEST_ID_CHAT_TICKETS'
export const TEST_ID_RESOLVED_CHATS = 'TEST_ID_RESOLVED_CHATS'
const MAX_NOT_HIDDEN_RESOLVED_TICKETS = 1

const mapStateToProps = (state: any) => ({
  isSupportOnline: isSupportOnlineSelector(state),
  supportArrivalTime: supportArrivalTimeSelector(state),
  isAnonymous: isAnonymousSelector(state),
  assigned: assignedTicketsSelector(state),
  awaitingResponse: awaititngResponseTicketsSelector(state),
  open: openTicketsSelector(state),
  resolved: resolvedTicketsSelector(state),
  oldTickets: oldTicketsSelector(state),
  canOpenNewTicket: state.auth.canOpenNewTicket,
  loading: getTicketsListLoading(state),
})

const enhance = connect<MapStateToProps, MapActionsToProps>(
  mapStateToProps,
  actionCreators
)
type MapStateToProps = ReturnType<typeof mapStateToProps>

type MapActionsToProps = {
  fetchTicketsList: () => any
}

type Props = RouteComponentProps & MapStateToProps & MapActionsToProps
type State = { hideAll: boolean }

class Tickets extends React.Component<Props, State> {
  static defaultProps = {
    tickets: [],
    canOpenNewTicket: false,
    assigned: [],
    awaitingResponse: [],
  }

  state = {
    hideAll: true,
  }

  componentDidMount() {
    this.props.fetchTicketsList()
  }

  static contextType = SettingsContext

  renderTicket = (data: TicketsResponseType) => {
    const { history } = this.props
    return (
      <Ticket
        key={data.id}
        ticket={data}
        onClick={() => history.push(getLinkToChatTicket(data.id))}
      />
    )
  }

  render() {
    const {
      canOpenNewTicket,
      history,
      resolved,
      assigned,
      awaitingResponse,
      open,
      oldTickets,
      loading,
      isSupportOnline,
      supportArrivalTime,
      isAnonymous,
    } = this.props
    const { isDisplayStartNewChatButtonForAuthenticatedUsers } = this.context
    const hasActiveTickets = assigned.length + awaitingResponse.length > 0
    const closedAndResolvedCount = resolved.length + oldTickets.length
    const hasClosedAndResolvedCount = closedAndResolvedCount > 0
    const showClosedAndRated =
      !this.state.hideAll ||
      closedAndResolvedCount <= MAX_NOT_HIDDEN_RESOLVED_TICKETS
    const isDisplayStartNewChatButton =
      isAnonymous || isDisplayStartNewChatButtonForAuthenticatedUsers

    if (loading) {
      return (
        <TicketsWrapper height='100%'>
          <Loader />
        </TicketsWrapper>
      )
    }

    return (
      <TicketsWrapper data-testid={TEST_ID_CHAT_TICKETS}>
        {isDisplayStartNewChatButton && canOpenNewTicket && (
          <NewTicket
            isSupportOnline={isSupportOnline}
            supportArrivalTime={supportArrivalTime}
            onClick={() => {
              if (this.context.isDexter) {
                return history.push(TabsEnum.DEXTER)
              }
              history.push(`${TabsEnum.CHAT}/${TicketPaths.NEW}`)
            }}
          />
        )}
        {open.map(this.renderTicket)}
        {hasActiveTickets && (
          <Box px={2} py={1}>
            <Text variant='secondary' color='grey-50'>
              <FormattedMessage
                id='supportChat.tickets.active'
                defaultMessage='Active'
              />
            </Text>
          </Box>
        )}
        {awaitingResponse.map(this.renderTicket)}
        {assigned.map(this.renderTicket)}
        {hasClosedAndResolvedCount && (
          <Box data-testid={TEST_ID_RESOLVED_CHATS} px={2} py={1}>
            <Text variant='secondary' color='grey-50'>
              <FormattedMessage
                id='supportChat.tickets.resolved'
                defaultMessage='Resolved'
              />
            </Text>
          </Box>
        )}
        {resolved.map(this.renderTicket)}
        {showClosedAndRated && oldTickets.map(this.renderTicket)}
        {closedAndResolvedCount > MAX_NOT_HIDDEN_RESOLVED_TICKETS && (
          <ViewHideButton
            tickets={oldTickets.length}
            onClick={() =>
              this.setState((prevState) => ({ hideAll: !prevState?.hideAll }))
            }
            isHideAction={!this.state.hideAll}
          />
        )}
      </TicketsWrapper>
    )
  }
}

export default enhance(Tickets)
