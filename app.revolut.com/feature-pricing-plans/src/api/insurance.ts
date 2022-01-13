import axios from 'axios'

import { PlanInsuranceReviewDetailsDto } from '@revolut/rwa-core-types'

export const getPlanInsuranceReviewDetails = async (planId: string) => {
  const { data: planInsuranceReviewDetails } =
    await axios.get<PlanInsuranceReviewDetailsDto>('/retail/insurance/review-details', {
      params: {
        planId,
      },
    })

  return planInsuranceReviewDetails
}
