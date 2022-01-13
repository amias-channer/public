import React, { FC, createContext, useContext } from 'react'

type ReviewStatusState = {
  isUnderReview: boolean
  hasPendingRequests: boolean
}

export const ReviewStatusContext = createContext<ReviewStatusState>({
  isUnderReview: false,
  hasPendingRequests: false,
})

export const ReviewStatusProvider: FC<{ reviewStatus: ReviewStatusState }> = ({
  reviewStatus,
  children,
}) => (
  <ReviewStatusContext.Provider value={reviewStatus}>
    {children}
  </ReviewStatusContext.Provider>
)

export const useIsUnderReview = () => {
  const { isUnderReview } = useContext(ReviewStatusContext)
  return isUnderReview
}

export const useHasPendingRequests = () => {
  const { hasPendingRequests } = useContext(ReviewStatusContext)
  return hasPendingRequests
}
