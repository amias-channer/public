import * as React from 'react'
import * as R from 'ramda'
import { RouteComponentProps, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { v4 as uuid } from 'uuid'

import * as ticketsActions from '../../redux/reducers/tickets'
import * as messageActions from '../../redux/reducers/messages'
import { prefillInput } from '../../redux/reducers/external'
import {
  Survey,
  ChatHint,
  ChatInput,
  ChatWrapper,
  Messages,
} from '../../components/index'
import { Loader } from '../../components/Loader'
import { ChatBanners } from '..'
import { TicketStatus } from '../../api/ticketTypes'
import {
  currentTicketSelector,
  ticketIdSelector,
  currentTicketLoadingStateSelector,
} from '../../redux/selectors/tickets'
import {
  serviceMessagesSelector,
  groupedChatMessagesSelector,
} from '../../redux/selectors/messages'
import { TICKET_LOADING_STATE } from '../../constants/loading'
import { TicketPaths } from '../../constants/routerPaths'
import { preFillMessageSelector } from '../../redux/selectors/external'
import {
  Banners,
  LanguageUnavailabilityBanner,
  PreChatBanners,
} from '../Banners'
import { PrechatSuggestions } from '../PrechatSuggestions'
import {
  ReviewStatusContext,
  ChatModeGetterContext,
  ChatModeSetterContext,
  ChatModeAction,
  ChatModeContext,
  StatusBannersContext,
} from '../../providers'
import { TicketOptions, StatusBannerType } from '../../api/types'
import { StructuredMessage } from '../../constants/structuredMessage'

type State = {
  isLastMessageSeen: boolean
  isPreChatBannersClosed: boolean
  fileStore: Record<string, string | FormData>
}

type BaseProps = {
  helpcentrePath: string
  fetchTroubleshootSuggestions: () => Promise<string[]>
  closeChat: () => void
}

const mapStateToProps = (state: any) => ({
  ticketId: ticketIdSelector(state),
  ticket: currentTicketSelector(state),
  chatMessages: groupedChatMessagesSelector(state),
  serviceMessages: serviceMessagesSelector(state),
  loadingState: currentTicketLoadingStateSelector(state),
  preFillMessage: preFillMessageSelector(state),
})

const actionCreator = {
  ...ticketsActions,
  ...messageActions,
  prefillInput,
}

type MapStateToProps = ReturnType<typeof mapStateToProps>
type MapActionsToProps = typeof actionCreator
type Props = RouteComponentProps &
  MapStateToProps &
  MapActionsToProps &
  BaseProps

const enhance = R.compose(
  withRouter,
  connect<MapStateToProps, MapActionsToProps>(mapStateToProps, actionCreator)
)

export type HandleFailedMessagePropType = {
  correlationId: string
  ticketId: string
}

const LOADER_DELAY = 500

export class Chat extends React.Component<Props, State> {
  static defaultProps = {
    ticket: null,
    serviceMessages: [],
    chatMessages: [],
  }

  state = {
    isLastMessageSeen: true,
    isPreChatBannersClosed: false,
    fileStore: {},
  }

  componentDidMount() {
    const { ticketId, ticket } = this.props
    if (ticketId !== TicketPaths.NEW && typeof ticketId === 'string') {
      this.props.fetchTicket(ticketId)
      if (ticket?.unread) {
        this.props.readTicket(ticketId, ticket.unread)
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { isLastMessageSeen } = this.state
    const { ticket, chatMessages } = this.props

    if (!ticket) {
      return
    }

    if (
      isLastMessageSeen &&
      chatMessages.length !== prevProps.chatMessages.length &&
      ticket.unread
    ) {
      this.props.readTicket(ticket.id, ticket.unread)
    }
  }

  static contextType = ReviewStatusContext

  sendMessage = (
    value: string | StructuredMessage | FormData,
    options: TicketOptions
  ) => {
    const { ticketId } = this.props
    const correlationId = uuid()
    this.setState((prevState) => ({
      fileStore: {
        [correlationId]: value,
        ...prevState.fileStore,
      },
    }))
    if (ticketId && ticketId !== TicketPaths.NEW) {
      this.props.postMessage(ticketId, correlationId, value)
    } else {
      this.props.initNewTicket(
        correlationId,
        value,
        {
          ...(options.context?.entityRef ? { context: options.context } : {}),
          ...(options.titleKey ? { titleKey: options.titleKey } : {}),
        },
        false
      )
    }
  }

  onScroll = (isLastMessageSeen: boolean) => {
    this.setState({ isLastMessageSeen })
  }

  getMessages = () => {
    const { chatMessages } = this.props

    return (
      <Messages
        messages={chatMessages}
        onScroll={this.onScroll}
        isLastMessageSeen={this.state.isLastMessageSeen}
        onDeleteMessage={this.onDeleteMessage}
        onRetryMessage={this.onRetryMessage}
        onRequestFullImage={this.props.getFullImage}
        loadHistory={this.props.loadHistory}
      />
    )
  }

  getChatInput = () => {
    const { ticket, preFillMessage, prefillInput: prefill } = this.props

    if (
      [
        TicketStatus.RESOLVED,
        TicketStatus.CLOSED_AND_RATED,
        TicketStatus.CLOSED,
      ].includes(ticket?.state)
    ) {
      return null
    }

    if (ticket?.readOnly) {
      return this.getRequestIsProcessingHint()
    }

    return (
      <ChatModeSetterContext.Consumer>
        {(dispatch) => (
          <ChatModeGetterContext.Consumer>
            {(chatModeContext: ChatModeContext) => (
              <ChatInput
                sendMessage={(message: string) => {
                  const { newTicketContext } = chatModeContext
                  this.sendMessage(message, { context: newTicketContext })
                  if (newTicketContext) {
                    dispatch({
                      type: ChatModeAction.SetResourceContextMode,
                      payload: null,
                    })
                  }
                }}
                preFillMessage={preFillMessage as string}
                prefillInput={prefill}
              />
            )}
          </ChatModeGetterContext.Consumer>
        )}
      </ChatModeSetterContext.Consumer>
    )
  }

  getChatBanners = () => {
    const { ticket } = this.props

    if (
      ticket &&
      !R.includes(ticket.state, [
        TicketStatus.CLOSED_AND_RATED,
        TicketStatus.RESOLVED,
        TicketStatus.CLOSED,
      ])
    ) {
      return <ChatBanners banner={ticket.banner} />
    }

    return null
  }

  getSurvey = () => {
    const { ticket, serviceMessages, history } = this.props

    if (ticket && ticket.state === TicketStatus.RESOLVED) {
      return (
        <Survey ticket={ticket} messages={serviceMessages} history={history} />
      )
    }

    return null
  }

  getRequestIsProcessingHint = () => (
    <ChatHint p='1.5rem' color='grey-50' variant='secondary'>
      <FormattedMessage
        id='supportChat.message.requestIsProcessing'
        defaultMessage='Your request is currently being processed. We we will notify you once there is an update.'
      />
    </ChatHint>
  )

  onDeleteMessage = ({
    correlationId,
    ticketId,
  }: HandleFailedMessagePropType) => {
    this.props.deleteMessage({ correlationId, ticketId })
  }

  onRetryMessage = ({
    correlationId,
    ticketId,
  }: HandleFailedMessagePropType) => {
    const fileStore: Record<string, string | FormData> = this.state.fileStore
    this.props.deleteMessage({ correlationId, ticketId })

    if (Object.prototype.hasOwnProperty.call(fileStore, correlationId)) {
      const savedMessage = fileStore[correlationId]
      this.sendMessage(savedMessage, {})
    }
  }

  getIsDisplayPreChatBanners = (statusBanners: StatusBannerType[]) => {
    const { isPreChatBannersClosed } = this.state
    const { ticketId } = this.props
    const { isUnderReview } = this.context

    return (
      !isPreChatBannersClosed &&
      ticketId === TicketPaths.NEW &&
      (isUnderReview || statusBanners.length > 0)
    )
  }

  render() {
    const {
      ticketId,
      loadingState,
      helpcentrePath,
      fetchTroubleshootSuggestions,
      closeChat,
    } = this.props
    const loading = loadingState === TICKET_LOADING_STATE.LOADING

    if (loading) {
      return <Loader delay={LOADER_DELAY} />
    }

    return (
      <StatusBannersContext.Consumer>
        {(statusBanners) =>
          this.getIsDisplayPreChatBanners(statusBanners) ? (
            <PreChatBanners
              statusBanners={statusBanners}
              onContinue={() => this.setState({ isPreChatBannersClosed: true })}
              onClose={closeChat}
            />
          ) : (
            <ChatWrapper>
              {this.getMessages()}
              {this.getChatBanners()}
              {fetchTroubleshootSuggestions && (
                <PrechatSuggestions
                  fetchTroubleshootSuggestions={fetchTroubleshootSuggestions}
                  visible={ticketId === TicketPaths.NEW}
                  sendMessage={(text) => this.sendMessage(text, {})}
                />
              )}
              <Banners />
              <LanguageUnavailabilityBanner redirectPath={helpcentrePath} />
              {this.getChatInput()}
              {this.getSurvey()}
            </ChatWrapper>
          )
        }
      </StatusBannersContext.Consumer>
    )
  }
}

export default enhance(Chat)
