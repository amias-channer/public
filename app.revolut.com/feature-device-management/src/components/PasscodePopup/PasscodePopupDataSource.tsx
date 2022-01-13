import { VFC } from 'react'

import { useHistory } from 'react-router-dom'

import { Url } from '@revolut/rwa-core-utils'

import { usePopup } from '../../hooks'
import { PasscodePopupView } from './PasscodePopupView'
import { PasscodePopupDataSourceProps } from './types'

export const PasscodePopupDataSource: VFC<PasscodePopupDataSourceProps> = (props) => {
  const history = useHistory()
  const { setPopup } = usePopup()

  return (
    <PasscodePopupView
      onExit={() => setPopup(null)}
      onChangePasscode={() => history.push(Url.ChangePasscode)}
      {...props}
    />
  )
}
