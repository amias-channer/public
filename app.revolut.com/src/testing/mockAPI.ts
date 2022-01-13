import pathToRegexp from 'path-to-regexp'
import { cleanup } from '@testing-library/react'
import { OK, NOT_FOUND } from 'http-status-codes'
import { AxiosRequestConfig } from 'axios'
import { matchPath } from 'react-router'

import { parsePayloadData } from './payloadParser'
import { createMock } from './mock'
import chatSignIn from './mocks/chatSignIn.json'
import infoClosed from './mocks/infoClosed.json'
import infoOpen from './mocks/infoOpen.json'
import ticketText from './mocks/ticketText.json'
import newTicket from './mocks/newTicket.json'
import listTickets from './mocks/listTickets.json'
import ticketHistory from './mocks/ticketHistory.json'
import feedbackOptions from './mocks/feedbackOptions.json'
import resolutionOptions from './mocks/resolutionOptions.json'
import listTicketsWithSurvey from './mocks/listTicketsWithSurvey.json'
import ticketHistoryRequests from './mocks/ticketHistoryRequests.json'
import singleTicketHistoryClosed from './mocks/singleTicketHistoryClosed.json'
import agentResponse from './mocks/agentResponse.json'
import agentResponseAvatar from './mocks/agentResponseAvatar.json'
import listTicketsRequests from './mocks/listTicketsRequests.json'
import singleTicketHistoryRequestAssigned from './mocks/singleTicketHistoryRequestAssigned.json'
import singleTicketHistoryRequestSubmitted from './mocks/singleTicketHistoryRequestSubmitted.json'
import uploadFile from './mocks/uploadFile.json'
import thumbImage from './mocks/thumbImage.json'
import thumbImageFullSize from './mocks/thumbImageFullSize.json'

const METHODS = ['get', 'post', 'patch', 'del', 'put']

const HTTP_METHOD_TO_MOCK_METHOD = {
  get: 'onGet',
  post: 'onPost',
  put: 'onPut',
  del: 'onDelete',
  patch: 'onPatch',
}

type MockReplyResult =
  | [number, any, Array<{ [key: string]: string }>?]
  | [number]

type MockReplyFn = (
  ...args: any[]
) => MockReplyResult | Promise<MockReplyResult>

type MockObject = {
  path: string
  baseURL?: string
  get?: MockReplyFn
  put?: MockReplyFn
  post?: MockReplyFn
  del?: MockReplyFn
  patch?: MockReplyFn
}

type MockApi = {
  [key: string]: MockObject
}

export const TOKEN_LIFE_TIME = 1000 * 60 * 60 * 10

export const createAuthTokenObj = () => ({
  accessToken: 'ljfDqNZt81cl1IPCoRBL4bBGZeVlrHoWHALDOk4tSFw',
  expireAt: Date.now() + TOKEN_LIFE_TIME,
  userId: '2ffb07ae-1d02-41b7-97d5-070363d44fa9',
  tokenType: 'user',
})

export const createAuthToken = (): string =>
  JSON.stringify(createAuthTokenObj())

export const mockAPI = (jestInstance: typeof jest) => () => {
  // we have to clear local storage to make clean state before other tests
  // mainly it can be polluted by unit tests
  window.localStorage.clear()
  const mock = createMock()
  // @ts-ignore
  const environment = {
    api: {
      anonymousSignIn: {
        path: '/signin/anonymous',
        post: () => [OK, chatSignIn],
      },
      clientInfo: {
        path: '/info',
        get: () => [OK, infoOpen],
      },
      agentInfo: {
        path: '/agents/:agentId/info',
        get: () => [OK, agentResponse],
      },
      agentAvatar: {
        path: '/agents/:agentId/avatar',
        get: () => [OK, agentResponseAvatar],
      },
      ticketsHistory: {
        path: '/tickets/history',
        get: () => [OK, []],
      },
      ticketLanguageAvailability: {
        path: '/tickets/:ticketId/availability',
        get: () => [OK, { supportLanguage: 'en', active: true }],
      },
      postMessage: {
        path: '/tickets/:ticketId/messages/text',
        post: () => [OK, ticketText],
      },
      uploadFile: {
        path: '/tickets/:ticketId/messages/upload',
        post: () => [OK, uploadFile],
      },
      feedbackOptions: {
        path: '/tickets/:ticketId/feedback-options',
        get: () => [OK, feedbackOptions],
      },
      rateTicket: {
        path: '/tickets/:ticketId/rate',
        post: () => [OK, {}],
      },
      resolutionOptions: {
        path: '/tickets/:ticketId/resolution',
        get: () => [OK, resolutionOptions],
      },
      ticketHistory: {
        path: '/tickets/:ticketId/messages/history',
        get: () => [OK, []],
      },
      ticket: {
        path: '/tickets/:ticketId',
        get: () => [OK, {}],
      },
      tickets: {
        path: '/tickets',
        get: () => [OK, []],
        post: () => [OK, newTicket],
      },
      banner: {
        path: '/tickets/:ticketId/banner',
        get: () => [NOT_FOUND],
      },
      ticketBanner: {
        path: '/banner',
        get: () => [NOT_FOUND],
      },
      previewImage: {
        path: '/uploads/:uploadId/thumb',
        get: () => [OK, thumbImage],
      },
      fullImage: {
        path: '/uploads/:uploadId',
        get: () => [OK, thumbImageFullSize],
      },
    } as MockApi,
    cleanUp() {
      cleanup()
      window.localStorage.clear()
      // order of this clean up is important
      // you need to reset atoms first
      // on atom state change you can have network request
      // eg on A/B testing we load public / non public distribution based on auth user
      // if you restore mock first and than reset atoms -> you will get unmocked request error
      // so reset atoms, reset mocks, restore axios adapter to user network

      mock.reset()
      mock.restore()
      // @ts-ignore
    },
    getHistory() {
      return mock.history
    },
    resetHistory() {
      return mock.resetHistory()
    },
    // Optional overrides:
    withClientInfoClosed() {
      this.api.clientInfo.get = jestInstance.fn(() => [OK, infoClosed])
      return this
    },
    withExistingTickets() {
      this.api.tickets.get = jestInstance.fn(() => [OK, listTickets])
      return this
    },
    withSurveyTickets() {
      this.api.tickets.get = jestInstance.fn(() => [OK, listTicketsWithSurvey])
      this.api.ticket.get = jestInstance.fn(() => [
        OK,
        listTicketsWithSurvey[0],
      ])
      return this
    },
    withRequestTickets() {
      this.api.tickets.get = jestInstance.fn(() => [OK, listTicketsRequests])
      return this
    },
    withTicketHistoryClosed() {
      this.api.ticketHistory.get = jestInstance.fn(() => [
        OK,
        singleTicketHistoryClosed,
      ])
      return this
    },
    withTicketHistoryRequestAssigned() {
      this.api.ticketHistory.get = jestInstance.fn(() => [
        OK,
        singleTicketHistoryRequestAssigned,
      ])
      return this
    },
    withTicketHistoryRequestSubmitted() {
      this.api.ticketHistory.get = jestInstance.fn(() => [
        OK,
        singleTicketHistoryRequestSubmitted,
      ])
      return this
    },
    withChatHistory() {
      this.api.ticketsHistory.get = jestInstance.fn(() => [OK, ticketHistory])
      return this
    },
    withChatHistoryRequests() {
      this.api.ticketsHistory.get = jestInstance.fn(() => [
        OK,
        ticketHistoryRequests,
      ])
      return this
    },
  }

  // adding mock handlers based on environment.api
  const apiKeysToMock = Object.keys(environment.api)
  apiKeysToMock.forEach((keyToMock) => {
    const mockObject = environment.api[keyToMock]
    // :q(\?.*)? is for optional any query string
    // if you will need a specific query string you can add as separate mock to environment
    // specifying query in path like /some/:other/more\?queryParam=Some
    const baseUrl = mockObject.baseURL || 'http://localhost:80/chat/api/client'
    const fullPath = `${baseUrl}${mockObject.path}:q(\\?.*)?`
    const regexpForPath = pathToRegexp(fullPath)
    // @ts-ignore
    METHODS.forEach((method) => {
      // @ts-ignore
      const replyFunction = mockObject[method]
      if (replyFunction) {
        // wrap all function in jest mock function to be able to check if it was called
        // @ts-ignore
        mockObject[method] = jestInstance.fn(replyFunction)
        // @ts-ignore
        mock[HTTP_METHOD_TO_MOCK_METHOD[method]](regexpForPath).reply(
          (config: AxiosRequestConfig) => {
            // @ts-ignore-
            const match = config.url
              ? matchPath(config.url, {
                  path: fullPath,
                })
              : null
            const params = match?.params
            // @ts-ignore
            const response = mockObject[method]({
              ...config,
              urlParams: params,
              // by default data is returned in config as a string
              // but we parse it in order to get better experience writing expectations
              data: parsePayloadData(config.data),
            })
            // according to axios response schema: https://github.com/axios/axios#response-schema
            // headers should be empty object (if no headers returned)
            if (!response[2]) {
              response[2] = {}
            }
            return response
          }
        )
      }
    })
  })

  // Requests that do not map to a mock handler are rejected with a HTTP 404 response. Since handlers are matched in order, a final onAny() can be used to change the default behaviour
  mock.onAny().reply((config) => {
    const { method = 'GET', url } = config
    console.warn(`${method.toUpperCase()} ${url} is not handled`)
    return []
  })
  window.localStorage.setItem('session', createAuthToken())

  return environment
}
