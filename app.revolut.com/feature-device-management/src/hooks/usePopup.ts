import { useContext } from 'react'

import { PopupContext } from '../providers'

export const usePopup = () => {
  return useContext(PopupContext)
}
