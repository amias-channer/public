import React, { FC } from 'react'
import { Flex } from '@revolut/ui-kit'

import { useIsWidgetMode } from '../../providers'
import { Actions } from '../useFlowPage'

import BackButton from './BackButton'
import { NavbarStyled } from './styled'

type Props = Pick<Actions, 'moveToThePreviousView'> & {
  backHidden: boolean
}

const Navbar: FC<Props> = ({ moveToThePreviousView, backHidden }) => {
  const isWidgetMode = useIsWidgetMode()
  return (
    <NavbarStyled isWidgetMode={isWidgetMode}>
      <Flex justifyContent="space-between" width="100%">
        {!backHidden && <BackButton onClick={moveToThePreviousView} />}
      </Flex>
    </NavbarStyled>
  )
}

export default Navbar
