import * as React from 'react'
import { NewTicketContext } from './api/types'

export class ChatAPI {
  bindToComponent = (self: React.Component) => {
    this.openChat = this.openChat.bind(self)
    this.toggleChat = this.toggleChat.bind(self)
    this.openNewChatWithMessage = this.openNewChatWithMessage.bind(self)
    this.openChatTicket = this.openChatTicket.bind(self)
    this.openForm = this.openForm.bind(self)
    this.accessRecovery = this.accessRecovery.bind(self)
  }

  openChat() {
    if (Object.prototype.isPrototypeOf.call(React.Component.prototype, this)) {
      this.openChat()
    }
  }

  toggleChat() {
    if (Object.prototype.isPrototypeOf.call(React.Component.prototype, this)) {
      this.toggleChat()
    }
  }

  openNewChatWithMessage(message: string, context?: NewTicketContext) {
    if (Object.prototype.isPrototypeOf.call(React.Component.prototype, this)) {
      this.openNewChatWithMessage(message, context)
    }
  }

  openChatTicket(ticketId: string) {
    if (Object.prototype.isPrototypeOf.call(React.Component.prototype, this)) {
      this.openChatTicket(ticketId)
    }
  }

  openForm(formId: string) {
    if (Object.prototype.isPrototypeOf.call(React.Component.prototype, this)) {
      this.openForm(formId)
    }
  }

  accessRecovery() {
    if (Object.prototype.isPrototypeOf.call(React.Component.prototype, this)) {
      this.accessRecovery()
    }
  }
}
