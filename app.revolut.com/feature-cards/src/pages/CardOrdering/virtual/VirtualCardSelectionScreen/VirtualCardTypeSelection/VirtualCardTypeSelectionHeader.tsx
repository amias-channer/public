import { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { NavBar } from '@revolut/ui-kit'

export const VirtualCardTypeSelectionHeader: FC = () => {
  const history = useHistory()

  const handleBackButtonClick = () => {
    history.goBack()
  }

  return (
    <NavBar>
      <NavBar.BackButton aria-label="Back" onClick={handleBackButtonClick} />
    </NavBar>
  )
}
