import * as Icons from '@revolut/icons'

import { SECONDARY_COLORS } from 'utils/colors'

import { Container } from './Container'
import { ImgStyled, ReversableBox } from './styled'

export const TransactionIcon = ({
  icon: Icon,
  reversed,
}: {
  icon?: string | Icons.UiKitIconComponentType
  reversed: boolean
}) => {
  if (typeof Icon === 'string') {
    return (
      <Container>
        <ImgStyled src={Icon} alt="" />
      </Container>
    )
  }

  const IconComponent = Icon || Icons.Coins

  return (
    <Container bg={SECONDARY_COLORS.DEEP_GREY}>
      <ReversableBox reversed={reversed}>
        <IconComponent size={24} color="white" />
      </ReversableBox>
    </Container>
  )
}
