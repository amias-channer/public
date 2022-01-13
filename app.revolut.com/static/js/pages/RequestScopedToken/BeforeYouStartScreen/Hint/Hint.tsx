import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { Media } from '@revolut/ui-kit'

type HintProps = {
  Icon: Icons.IconComponentType
  title: string
}

export const Hint: FC<HintProps> = ({ Icon, title }) => (
  <Media py="px18">
    <Media.Side>
      <Icon />
    </Media.Side>
    <Media.Content ml="px16">{title}</Media.Content>
  </Media>
)
