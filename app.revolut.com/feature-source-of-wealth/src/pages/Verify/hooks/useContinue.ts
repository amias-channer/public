import { useMemo } from 'react'
import { isEmpty } from 'lodash'

import {
  SOWLatestSubmission,
  SOWLatestSubmissionStateEnum,
  SOWReviewStateType,
} from '../../../types/generated/sow'
import {
  SOTLatestSubmission,
  SOTLatestSubmissionStateEnum,
  SOTReviewStateType,
} from '../../../types/generated/sot'
import { isRequested } from '../../../utils'
import { useConfirm } from '../../../hooks'

type useContinueArgs = {
  submissionLatest?: SOWLatestSubmission | SOTLatestSubmission
  onSuccessSubmit: VoidFunction
}

export const useContinue = ({ submissionLatest, onSuccessSubmit }: useContinueArgs) => {
  const { confirmUpload, isLoading: isSubmitting } = useConfirm({
    onSuccess: onSuccessSubmit,
  })

  const state = submissionLatest?.state
  const evidences = submissionLatest?.evidences
  const action = submissionLatest?.actionToDo
  const actionType = submissionLatest?.reviewState?.type

  const isRequest = isRequested(action?.action)

  const handleContinue = () => {
    confirmUpload()
  }

  const allowContinue = useMemo(() => {
    if (isEmpty(evidences)) {
      return false
    }

    if (
      [
        SOWReviewStateType.UpdateRequired,
        SOWReviewStateType.Approved,
        SOWReviewStateType.Rejected,
        SOTReviewStateType.UpdateRequired,
        SOTReviewStateType.Approved,
        SOTReviewStateType.Rejected,
      ].includes(actionType as SOWReviewStateType | SOTReviewStateType)
    ) {
      return false
    }

    return (
      state === SOWLatestSubmissionStateEnum.PENDING_USER ||
      state === SOTLatestSubmissionStateEnum.PENDING_USER
    )
  }, [actionType, state, evidences])

  return {
    action,
    isRequest,
    isSubmitting,
    allowContinue,
    onContinue: handleContinue,
  }
}
