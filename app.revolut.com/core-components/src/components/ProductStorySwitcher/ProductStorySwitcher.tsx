import { VFC } from 'react'
import { Story, StoryProps, StorySwitcher } from '@revolut/ui-kit'

import { ProductStoryButtons } from './ProductStoryButtons'
import { DEFAULT_BACKGROUND_COLOR } from './constants'
import { ProductStory, ProductStorySlideButton } from './types'

type ProductStorySwitcherProps = {
  productStory: ProductStory
  isOpen: boolean
  onClose: () => void
} & Pick<StoryProps, 'bg'>

export const ProductStorySwitcher: VFC<ProductStorySwitcherProps> = ({
  productStory,
  isOpen,
  bg = DEFAULT_BACKGROUND_COLOR,
  onClose,
}) => {
  const handleStorySwitcherExit = () => {
    onClose()
  }

  const handleActionButtonClick = ({
    onClick,
  }: Pick<ProductStorySlideButton, 'onClick'> = {}) => {
    if (onClick) {
      onClick()

      return
    }

    handleStorySwitcherExit()
  }

  return (
    <StorySwitcher isOpen={isOpen} onExit={handleStorySwitcherExit}>
      {productStory.screens.map(
        ({ title, text, backgroundMedia, buttons }, slideIndex) => {
          return (
            <Story
              // eslint-disable-next-line
              key={`${title}-${slideIndex}`}
              name={productStory.content.header}
              bg={bg}
              image={backgroundMedia}
            >
              <Story.Title>{title}</Story.Title>
              <Story.Description>{text}</Story.Description>

              <Story.Actions>
                <ProductStoryButtons
                  buttons={buttons}
                  isLastScreen={slideIndex === productStory.screens.length - 1}
                  onButtonClick={handleActionButtonClick}
                />
              </Story.Actions>
            </Story>
          )
        },
      )}
    </StorySwitcher>
  )
}
