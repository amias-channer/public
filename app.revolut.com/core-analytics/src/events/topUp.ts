import { RetailEventOptions, COAWebEvent } from 'aqueduct-web'

import { OBJECT_TYPES } from './objectTypes'

const TOP_UP_EVENTS = {
  topUpStarted: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.started,
    object: 'TopUpFlow',
    description: 'Track that top up flow has been started',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpMethodSelected: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.selected,
    object: 'TopUpFlowTopUpMethod',
    description: 'Track selection of top up method in top up flow',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpSuggestedAmountSelected: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.selected,
    object: 'TopUpFlowSuggestedAmount',
    description: 'Track selection of suggested amount in top up flow',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpAvailableMethodsPopupShown: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.shown,
    object: 'TopUpFlowAvailableMethodsPopup',
    description: 'Track that available methods popup is shown',
    objectType: OBJECT_TYPES.MODAL,
  },
  topUpLinkedCardInfoPopupShown: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.shown,
    object: 'TopUpFlowLinkedCardInfoPopup',
    description: 'Track that linked card info popup is shown',
    objectType: OBJECT_TYPES.MODAL,
  },
  topUpLinkedCardDeleted: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.deleted,
    object: 'TopUpFlowLinkedCard',
    description: 'Track that linked card is deleted',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpViaApplePayStarted: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.started,
    object: 'TopUpFlowApplePay',
    description: 'Track that Apple Pay payment has been started',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpViaApplePayCompleted: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.completed,
    object: 'TopUpFlowApplePay',
    description: 'Track that Apple Pay payment is completed',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpViaApplePayFailed: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.failed,
    object: 'TopUpFlowApplePay',
    description: 'Track that Apple Pay payment is failed',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpViaApplePayCancelled: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.cancelled,
    object: 'TopUpFlowApplePay',
    description: 'Track that Apple Pay payment is cancelled',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpViaGooglePayStarted: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.started,
    object: 'TopUpFlowGooglePay',
    description: 'Track that Google Pay payment has been started',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpViaGooglePayCompleted: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.completed,
    object: 'TopUpFlowGooglePay',
    description: 'Track that Google Pay payment is completed',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpViaGooglePayFailed: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.failed,
    object: 'TopUpFlowGooglePay',
    description: 'Track that Google Pay payment is failed',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpViaCardStarted: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.started,
    object: 'TopUpFlowCard',
    description: 'Track that card payment has been started',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpViaCardCompleted: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.completed,
    object: 'TopUpFlowCard',
    description: 'Track that card payment is completed',
    objectType: OBJECT_TYPES.DATA,
  },
  topUpViaCardFailed: {
    category: COAWebEvent.Category.TopUp,
    action: COAWebEvent.Action.failed,
    object: 'TopUpFlowCard',
    description: 'Track that card payment is failed',
    objectType: OBJECT_TYPES.DATA,
  },
} as const

export const TopUpTrackingEvent: Record<
  keyof typeof TOP_UP_EVENTS,
  RetailEventOptions<string>
> = TOP_UP_EVENTS
