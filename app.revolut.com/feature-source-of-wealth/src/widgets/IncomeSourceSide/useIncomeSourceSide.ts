import { useState } from 'react'

import { SOWLatestSubmissionEvidences, SOTLatestSubmissionEvidences } from 'types'

export type SideEvidenceState = {
  isOpen: boolean
  evidence?: SOWLatestSubmissionEvidences | SOTLatestSubmissionEvidences
}

const initialState = {
  isOpen: false,
}

export const useIncomeSourceSide = () => {
  const [evidenceData, setEvidenceData] = useState<SideEvidenceState>(initialState)

  const closeSide = () => {
    setEvidenceData(initialState)
  }

  const openSide = (
    evidence: SOWLatestSubmissionEvidences | SOTLatestSubmissionEvidences,
  ) => {
    setEvidenceData({
      isOpen: true,
      evidence,
    })
  }

  return {
    evidenceData,
    openSide,
    closeSide,
  }
}
