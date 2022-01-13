import { isSameDay, differenceInMilliseconds } from 'date-fns/fp'
import * as R from 'ramda'

import { MessageType } from '../../api/ticketTypes'
import { MERGE_TIME_MAX_GAP } from '../../constants/timers'
import { MessagePayloadType } from '../../api/types'

const createdAt = R.prop('createdAt')
export const isSameDayByCreatedAt = (prev: MessageType, next: MessageType) =>
  isSameDay(createdAt(prev), createdAt(next))

const fromClient = R.prop('fromClient')
const isServiceMessage = R.propEq('payloadType', MessagePayloadType.SERVICE)

export const isSameGroup = (prev: MessageType, next: MessageType) =>
  R.equals(fromClient(prev), fromClient(next)) &&
  R.equals(isServiceMessage(prev), isServiceMessage(next)) &&
  differenceInMilliseconds(createdAt(prev), createdAt(next)) <=
    MERGE_TIME_MAX_GAP
