import * as React from 'react'
import * as R from 'ramda'

import { MessageType } from '../../api/ticketTypes'
import { HandleFailedMessagePropType } from '../../containers/Chat/Chat'
import { TicketHeader } from '../../containers/Header'
import { getMessageUniqKey } from '../../helpers/utils'
import { ChatHeaderContext } from '../../providers'

import { isSameDayByCreatedAt, isSameGroup } from './utils'
import { MessagesDayGroup } from './MessagesDayGroup'

import { MessagesWrapper, ScrollWrapper } from './index'

const HEADER_TOP_OFFSET_PX = 30

type Props = {
  messages: MessageType[]
  onScroll: (isLastMessageSeen: boolean) => void
  onDeleteMessage: (props: HandleFailedMessagePropType) => void
  onRetryMessage: (props: HandleFailedMessagePropType) => void
  onRequestFullImage: (props: MessageType) => void
  loadHistory: () => void
  isLastMessageSeen: boolean
}

type State = {
  smoothScroll: boolean
  prevScrollHeight: number
}

export class Messages extends React.PureComponent<Props, State> {
  state = {
    smoothScroll: true,
    prevScrollHeight: 0,
  }

  componentDidMount() {
    const { setIsChatHeaderMinimized, setIsChatHeaderVisible } = this.context
    setIsChatHeaderMinimized(false)
    setIsChatHeaderVisible(true)
    this.scrollToBottom()
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const scrollEl = this.anchor.current
    if (scrollEl.scrollHeight !== this.state.prevScrollHeight) {
      const isSmooth =
        this.props.messages.length !== prevProps.messages.length &&
        prevProps.messages.length !== 0 &&
        scrollEl.scrollTop !== 0

      this.scrollHold(isSmooth)
    }
  }

  static contextType = ChatHeaderContext

  anchor = React.createRef<any>()

  scrollHold = (isSmooth: boolean) => {
    const scrollEl = this.anchor.current

    if (isSmooth) {
      this.scrollTo(
        scrollEl.scrollHeight + scrollEl.scrollTop - this.state.prevScrollHeight
      )
    } else {
      this.setState(
        {
          smoothScroll: false,
        },
        () => {
          this.scrollTo(
            scrollEl.scrollHeight +
              scrollEl.scrollTop -
              this.state.prevScrollHeight
          )

          this.setState({
            smoothScroll: true,
            prevScrollHeight: scrollEl.scrollHeight,
          })
        }
      )
    }
  }

  scrollToBottom = () => {
    const scrollEl = this.anchor.current
    this.setState({ smoothScroll: false }, () => {
      this.scrollTo(scrollEl.scrollHeight)
      this.setState({ smoothScroll: true })
    })
  }

  scrollTo = (offset: number) => {
    if (this.anchor.current.scrollTo) {
      this.anchor.current.scrollTo(0, offset)
    } else {
      this.anchor.current.scrollTop = offset
    }
  }

  onScroll = (e: React.SyntheticEvent<HTMLElement>) => {
    const { isChatHeaderMinimized, setIsChatHeaderMinimized } = this.context
    const { scrollTop, scrollHeight } = e.currentTarget

    if (isChatHeaderMinimized && scrollTop <= HEADER_TOP_OFFSET_PX) {
      setIsChatHeaderMinimized(false)
    } else if (!isChatHeaderMinimized && scrollTop > HEADER_TOP_OFFSET_PX) {
      setIsChatHeaderMinimized(true)
    }

    if (scrollHeight !== this.state.prevScrollHeight) {
      this.setState({ prevScrollHeight: scrollHeight })
    }

    if (scrollTop === 0) {
      this.props.loadHistory()
    }
  }

  groupedByTime = (): MessageType[][][] => {
    if (!this.props.messages || R.isEmpty(this.props.messages)) {
      return []
    }

    const groupedByDay = R.groupWith(isSameDayByCreatedAt, this.props.messages)
    return R.map(R.groupWith(isSameGroup), groupedByDay)
  }

  render() {
    const groupedMessages = this.groupedByTime()
    return (
      <ScrollWrapper
        data-testid='TEST_ID_TICKET_SCROLL_WRAPPER'
        ref={this.anchor}
        onScroll={this.onScroll}
        smoothScroll={this.state.smoothScroll}
      >
        <TicketHeader />
        <MessagesWrapper>
          {groupedMessages.map((messageGroups) => {
            const first = messageGroups[0][0]
            const key = getMessageUniqKey(first)

            return (
              <MessagesDayGroup
                key={key}
                messageGroups={messageGroups}
                onDeleteMessage={this.props.onDeleteMessage}
                onRetryMessage={this.props.onRetryMessage}
                onRequestFullImage={this.props.onRequestFullImage}
              />
            )
          })}
        </MessagesWrapper>
      </ScrollWrapper>
    )
  }
}
