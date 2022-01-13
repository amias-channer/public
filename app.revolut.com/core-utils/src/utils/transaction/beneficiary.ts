import { TransactionDto } from '@revolut/rwa-core-types'

import { checkRequired } from '../checkRequired'

const TRANSFER_TO_BENEFICIARY_DESCRIPTION_KEY =
  'transaction.description.transfer.to.beneficiary'

export const getBeneficiaryName = (transaction: TransactionDto) => {
  if (transaction.localisedDescription?.key === TRANSFER_TO_BENEFICIARY_DESCRIPTION_KEY) {
    return checkRequired(
      transaction.localisedDescription?.params?.find((param) => param.key === 'name')
        ?.value,
      '"beneficiaryName" can not be empty',
    )
  }
  return null
}
