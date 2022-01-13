import {
  ReceiverInfoCryptoOrder,
  StandingOrderType,
  StandingOrderResponseDto,
} from '../generated'

export enum RecurringPaymentPeriod {
  Daily = 'P1D',
  Weekly = 'P7D',
  Monthly = 'P1M',
}

export type RecurringPaymentCrypto = StandingOrderResponseDto & {
  period: RecurringPaymentPeriod
  receiverInfo?: ReceiverInfoCryptoOrder
  type: StandingOrderType.Crypto
}
