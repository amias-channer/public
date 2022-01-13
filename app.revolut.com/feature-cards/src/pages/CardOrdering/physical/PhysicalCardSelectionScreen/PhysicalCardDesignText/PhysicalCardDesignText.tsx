import { FC } from 'react'

import { CARD_DESIGN_TEXT } from '../cardDesignText'
import {
  PhysicalCardDesignTextContainer,
  PhysicalCardDesignTitle,
  PhysicalCardDesignDescription,
} from './styled'

type PhysicalCardDesignTextProps = {
  cardCode: string
}

export const PhysicalCardDesignText: FC<PhysicalCardDesignTextProps> = ({ cardCode }) => {
  const { title, description } = CARD_DESIGN_TEXT[cardCode.toUpperCase()]

  return (
    <PhysicalCardDesignTextContainer>
      <PhysicalCardDesignTitle>{title}</PhysicalCardDesignTitle>
      <PhysicalCardDesignDescription>{description}</PhysicalCardDesignDescription>
    </PhysicalCardDesignTextContainer>
  )
}
