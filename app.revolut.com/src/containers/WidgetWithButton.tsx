import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Dropdown } from '@revolut/ui-kit'
import { FormsApi } from 'revolut-forms'
import debounce from 'lodash.debounce'

import { getLinkToChatTicket, getLinkToForm } from '../helpers/utils'
import { TransitionSlideUp } from '../helpers/transitions'
import { StateType } from '../redux/reducers'
import { history } from '../redux/stores/history'
import { WidgetButton } from '../components'
import { ChatButtonWrapper } from '../components/Survey/styles'
import { ButtonBadge, MessagePreviewCard } from '../components/WidgetButton'
import { TabsEnum } from '../constants/routerPaths'
import {
  allTicketsSelector,
  unreadMessagesSelector,
  lastUnreadTicketSelector,
  awaitingTicketSelector,
} from '../redux/selectors/tickets'
import * as actionCreators from '../redux/reducers/auth'
import { setOnMessageCallback } from '../redux/reducers/onMessage'
import { openWithPrefilledMessage } from '../redux/reducers/external'
import { SendChatEvent } from '../helpers/types'
import { ChatAPI } from '../ChatAPI'
import { TicketsResponseType, TicketStatus } from '../api/ticketTypes'
import { getItemFromLocalStorage, LocalStorage } from '../constants/storage'

import { Widget } from './Widget'
import { Auth } from './Auth'
import { NewTicketContext, DexterSuggestion } from '../api/types'
import {
  ChatModeAction,
  ChatModeSetterContext,
  AnalyticsContext,
} from '../providers'

type MapActionsToProps = {
  openWithPrefilledMessage: (message: string) => void
}
type OwnProps = {
  sendChatEvent: SendChatEvent
  chatAPI: ChatAPI
  isHelpExcluded: boolean
  formsAPI: FormsApi
  faqRanks?: any
  showChatOnlyWhenActive?: boolean
  helpcentrePath: string
  openedTickets: TicketsResponseType[]
  onChatViewStateChange: (value: boolean) => void
  onChatChange: (value: TicketsResponseType[]) => void
  onDisplayUnreadMessagePreview: (ticket: TicketsResponseType) => void
  fetchPrechatSuggestion?: (query: string) => Promise<DexterSuggestion>
  fetchTroubleshootSuggestions?: () => Promise<string[]>
}

type Props = MapStateToProps & OwnProps & MapActionsToProps

type State = {
  showChatWindow: boolean
  showPreview: boolean
}

const mapStateToProps = (state: StateType) => ({
  tickets: allTicketsSelector(state),
  unreadMessages: unreadMessagesSelector(state),
  openedTickets: awaitingTicketSelector(state),
  lastUnreadTicket: (lastUnreadTicketSelector(
    state
  ) as unknown) as TicketsResponseType,
})
type MapStateToProps = ReturnType<typeof mapStateToProps>

const enhance = R.compose(
  Auth,
  connect<MapStateToProps, MapActionsToProps>(mapStateToProps, {
    openWithPrefilledMessage,
    setOnMessageCallback,
    ...actionCreators,
  })
)
export class WidgetWithButtonClass extends React.Component<Props, State> {
  static defaultProps = {
    isHelpExcluded: false,
    showChatOnlyWhenActive: false,
    onChatViewStateChange: () => {},
    onChatChange: () => {},
  }

  state = {
    showChatWindow: false,
    showPreview: true,
  }

  componentDidMount() {
    const { chatAPI, onMessage } = this.props

    if (chatAPI) {
      chatAPI.bindToComponent(this)
    }
    if (onMessage) {
      this.props.setOnMessageCallback({ onMessage })
    }
  }

  componentDidUpdate(prevProps: Props) {
    this.debouncedOnChange()
  }

  // This prevents us from polling the ticket list multiple times in a row.
  // The reason behind the multiple poll issue is an animation mechanism,
  // which will be completely removed in the nearest future.
  debouncedOnChange = debounce(() => {
    this.props.onChatChange(this.props.tickets)
  }, 1000)

  anchor = React.createRef<any>()

  static contextType = ChatModeSetterContext

  openChat = () => {
    this.setState(
      {
        showChatWindow: true,
      },
      () => {
        this.props.onChatViewStateChange(this.getBubbleState())
      }
    )
  }

  openChatTicket = (id: string) => {
    this.setState(
      {
        showChatWindow: true,
      },
      () => {
        history.push(getLinkToChatTicket(id))
        this.props.onChatViewStateChange(this.getBubbleState())
      }
    )
  }

  openForm = (formId: string) => {
    this.setState(
      {
        showChatWindow: true,
      },
      () => {
        history.push(getLinkToForm(formId))
        this.props.onChatViewStateChange(this.getBubbleState())
      }
    )
  }

  accessRecovery = () => {
    const dispatch = this.context
    const hasTickets = this.props.openedTickets.length > 0
    this.setState(
      {
        showChatWindow: true,
      },
      () => {
        if (!hasTickets) {
          history.push(TabsEnum.ACCESS_RECOVERY)
          dispatch({
            type: ChatModeAction.SetAccessRecoveryMode,
            payload: true,
          })
        } else {
          history.push(TabsEnum.CHAT)
        }
        this.props.onChatViewStateChange(this.getBubbleState())
      }
    )
  }

  toggleChat = () => {
    this.setState(
      (prevState) => ({
        showChatWindow: !prevState.showChatWindow,
      }),
      () => {
        this.props.onChatViewStateChange(this.getBubbleState())
      }
    )
  }

  closeChat = () => {
    const dispatch = this.context
    dispatch({
      type: ChatModeAction.ResetModes,
    })
    this.setState(
      () => ({
        showChatWindow: false,
      }),
      () => {
        this.props.onChatViewStateChange(this.getBubbleState())
      }
    )
  }

  openNewChatWithMessage = (message?: string, context?: NewTicketContext) => {
    if (context) {
      const dispatch = this.context
      dispatch({
        type: ChatModeAction.SetResourceContextMode,
        payload: context,
      })
    }
    this.setState(
      {
        showChatWindow: true,
      },
      () => {
        this.props.onChatViewStateChange(this.getBubbleState())
        if (this.props.fetchPrechatSuggestion && !message && !context) {
          history.push(TabsEnum.DEXTER)
          return
        }
        this.props.openWithPrefilledMessage(message || '')
      }
    )
  }

  onPreviewClose = () => {
    this.setState({
      showPreview: false,
    })
  }

  renderButtonBadge = () => {
    const { showChatWindow } = this.state
    const { unreadMessages } = this.props

    if (!showChatWindow && unreadMessages > 0) {
      return <ButtonBadge count={unreadMessages} />
    }

    return null
  }

  getUnreadMessage = () => {
    const { showChatWindow } = this.state
    const { lastUnreadTicket } = this.props

    const lastRead = getItemFromLocalStorage(LocalStorage.CHAT_LAST_READ)

    if (!lastUnreadTicket) {
      return null
    }

    const lastTimeRead =
      lastRead && (lastRead as Record<string, number>)[lastUnreadTicket.id]
    const lastTimeTicketUpdate = new Date(lastUnreadTicket.updatedAt).getTime()
    const lastMessageHasSeen =
      lastTimeRead && lastTimeRead > lastTimeTicketUpdate

    if (
      showChatWindow ||
      !lastUnreadTicket ||
      (lastUnreadTicket.state === TicketStatus.RESOLVED && lastMessageHasSeen)
    ) {
      return null
    }

    return lastUnreadTicket
  }

  renderUnreadTicketPreview = () => {
    const { showChatWindow, showPreview } = this.state
    const unreadTicket = this.getUnreadMessage()
    if (this.props.onDisplayUnreadMessagePreview && unreadTicket) {
      this.props.onDisplayUnreadMessagePreview(unreadTicket)
    }
    if (!unreadTicket) {
      return null
    }

    return (
      <Dropdown
        anchorRef={this.anchor}
        placement='top-end'
        isOpen={!showChatWindow && showPreview}
        useTransition={TransitionSlideUp}
        mb='1.5rem'
        maxHeight='100%'
        radius='0.25rem'
      >
        <MessagePreviewCard
          ticket={unreadTicket}
          onView={this.onView}
          onClose={this.onPreviewClose}
        />
      </Dropdown>
    )
  }

  onView = (ticketId: string) => {
    if (ticketId) {
      this.setState(
        {
          showChatWindow: true,
        },
        () => {
          this.props.onChatViewStateChange(this.getBubbleState())
          history.push(`${TabsEnum.CHAT}/${ticketId}`)
        }
      )
    }
  }

  getBubbleState() {
    if (!this.props.showChatOnlyWhenActive) {
      return true
    }

    const hasPreview = this.getUnreadMessage() && this.state.showPreview
    const hasMessages = this.props.unreadMessages > 0
    const hasTickets = this.props.openedTickets.length > 0

    return (
      this.state.showChatWindow ||
      (!this.state.showChatWindow && (hasTickets || hasPreview || hasMessages))
    )
  }

  render() {
    const {
      isHelpExcluded,
      faqRanks,
      helpcentrePath,
      formsAPI,
      sendChatEvent,
      fetchPrechatSuggestion,
      fetchTroubleshootSuggestions,
    } = this.props
    const { showChatWindow } = this.state
    const isBubbleVisible = this.getBubbleState()

    return (
      <AnalyticsContext.Provider value={sendChatEvent}>
        {isBubbleVisible && (
          <ChatButtonWrapper ref={this.anchor}>
            <WidgetButton onClick={this.toggleChat} isOpen={showChatWindow} />
            {this.renderButtonBadge()}
          </ChatButtonWrapper>
        )}
        <Dropdown
          anchorRef={this.anchor}
          isOpen={showChatWindow}
          useTransition={TransitionSlideUp}
          mb='1.5rem'
          bottom={[
            '4.5rem!important',
            '4.5rem!important',
            '4.5rem!important',
            '5.5rem!important',
          ]}
          right={[
            '1rem!important',
            '1rem!important',
            '2rem!important',
            '2rem!important',
          ]}
          modifiers={{
            computeStyle: {
              gpuAcceleration: false,
              x: 'right',
              y: 'bottom',
            },
          }}
          maxHeight='100%'
          radius='1rem'
          positionFixed
          zIndex={101}
        >
          <Widget
            isOpen={showChatWindow}
            isHelpExcluded={isHelpExcluded}
            faqRanks={faqRanks}
            helpcentrePath={helpcentrePath}
            fetchPrechatSuggestion={fetchPrechatSuggestion}
            fetchTroubleshootSuggestions={fetchTroubleshootSuggestions}
            formsAPI={formsAPI}
            closeChat={() => this.closeChat()}
          />
        </Dropdown>
        {this.renderUnreadTicketPreview()}
      </AnalyticsContext.Provider>
    )
  }
}

export const WidgetWithButton = enhance(WidgetWithButtonClass)
