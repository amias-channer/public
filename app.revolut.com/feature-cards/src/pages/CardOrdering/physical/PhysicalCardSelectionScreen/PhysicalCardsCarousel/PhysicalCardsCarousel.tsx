import { FC } from 'react'
import { Carousel, useMatchBreakpoint } from '@revolut/ui-kit'

import { CardDesignSelectionImage } from '../../../components'
import { DesignOptionsIndexes, PhysicalCardTypesOptions } from '../types'

type PhysicalCardsCarouselProps = {
  availableCardDesignGroups: string[]
  selectedIndex: number
  selectedDesignIndexes: DesignOptionsIndexes
  physicalCardTypesOptions: PhysicalCardTypesOptions
  onCarouselIndexChange: (index: number) => void
}

export const PhysicalCardsCarousel: FC<PhysicalCardsCarouselProps> = ({
  availableCardDesignGroups,
  selectedIndex,
  selectedDesignIndexes,
  physicalCardTypesOptions,
  onCarouselIndexChange,
}) => {
  const matches = useMatchBreakpoint('sm')

  return (
    <Carousel
      align="center"
      index={selectedIndex}
      onIndexChange={onCarouselIndexChange}
      alignWidth={matches ? '350px' : '175px'}
    >
      {availableCardDesignGroups.map((cardDesignGroup) => {
        const cardDesignOptions = physicalCardTypesOptions[cardDesignGroup]
        const selectedDesignIndex = selectedDesignIndexes[cardDesignGroup]
        const imgSrc = cardDesignOptions[selectedDesignIndex]
          ? cardDesignOptions[selectedDesignIndex].imgSrc
          : cardDesignOptions[0].imgSrc

        return (
          <Carousel.Item key={cardDesignGroup} width={1}>
            <CardDesignSelectionImage imgSrc={imgSrc} />
          </Carousel.Item>
        )
      })}
    </Carousel>
  )
}
