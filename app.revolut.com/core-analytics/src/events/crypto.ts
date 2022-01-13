import { RetailEventOptions, COAWebEvent } from 'aqueduct-web'
import { OBJECT_TYPES } from './objectTypes'

const CRYPTO_EVENTS = {
  cryptoTabOpened: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.opened,
    object: 'CryptoTab',
    description: 'User opens crypto tab',
    objectType: OBJECT_TYPES.TAB,
  },
  investEntryPointClicked: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.clicked,
    object: 'InvestEntryPoint',
    description: 'User clicks on Invest button',
    objectType: OBJECT_TYPES.BUTTON,
  },
  investListOpened: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.opened,
    object: 'InvestList',
    description: 'User opens Invest list',
    objectType: OBJECT_TYPES.PAGE,
  },
  investListClicked: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.clicked,
    object: 'InvestList',
    description: 'User clicks on one of the assets',
    objectType: OBJECT_TYPES.BUTTON,
  },
  assetHoldingsEntryPointClicked: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.clicked,
    object: 'AssetHoldingsEntryPoint',
    description: 'User clicks on one of the holdings',
    objectType: OBJECT_TYPES.BUTTON,
  },
  assetDetailsOpened: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.opened,
    object: 'AssetDetails',
    description: 'User opens an asset details screen',
    objectType: OBJECT_TYPES.PAGE,
  },
  exchangeFlowOpened: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.opened,
    object: 'ExchangeFlow',
    description: 'User opens exchange flow screen',
    objectType: OBJECT_TYPES.PAGE,
  },
  exchangeReviewOpened: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.opened,
    object: 'ExchangeReview',
    description: 'User reviews order screen',
    objectType: OBJECT_TYPES.PAGE,
  },
  exchangeFlowCompleted: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.completed,
    object: 'ExchangeFlow',
    description: 'Completed an exchange',
    objectType: OBJECT_TYPES.DATA,
  },
  exchangeFlowFailed: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.failed,
    object: 'ExchangeFlow',
    description: 'Failed an exchange',
    objectType: OBJECT_TYPES.DATA,
  },
  recurringTabOpened: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.opened,
    object: 'RecurringTransactionsTab',
    description: 'User opens recurring transactions tab',
    objectType: OBJECT_TYPES.PAGE,
  },
  historicalTransactionsTab: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.opened,
    object: 'HistoricalTransactionsTab',
    description: 'User opens historical transactions tab',
    objectType: OBJECT_TYPES.PAGE,
  },
  statementDownloaded: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.completed,
    object: 'Statement',
    description:
      'Track successful statement downloads e.g. when the user clicks Download on the statement',
    objectType: OBJECT_TYPES.DATA,
  },
  statementGenerationfailed: {
    category: COAWebEvent.Category.Crypto,
    action: COAWebEvent.Action.failed,
    object: 'Statement',
    description:
      'Track failed statement generation errors e.g. when statement generation fails',
    objectType: OBJECT_TYPES.DATA,
  },
}

export const CryptoTrackingEvent: Record<
  keyof typeof CRYPTO_EVENTS,
  RetailEventOptions<string>
> = CRYPTO_EVENTS
