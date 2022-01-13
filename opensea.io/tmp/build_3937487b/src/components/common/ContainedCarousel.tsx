import React from "react"
import styled, { css } from "styled-components"
import Flex, { FlexProps } from "../../design-system/Flex"
import { useCarousel } from "../../hooks/useCarousel"
import { selectClassNames } from "../../lib/helpers/styling"
import { PROMO_CARD_MAX_SIZE } from "../layout/home-page/PromoCard.react"
import Carousel from "./Carousel.react"
import { sizeMQ } from "./MediaQuery.react"

interface Props {
  children: React.ReactNode
  className?: string
  slidesNumber?: number
}

const ContainedCarousel = ({ children, className, slidesNumber }: Props) => {
  const { slidesToShow } = useCarousel()

  const slides = slidesNumber
    ? slidesNumber < slidesToShow
      ? slidesNumber
      : slidesToShow
    : slidesToShow
  return (
    <HomeContainer
      className={selectClassNames(
        "ContainedCarousel",
        { "one-card": slides === 1, "two-cards": slides === 2 },
        className,
      )}
    >
      <Carousel
        arrows
        className="ContainedCarousel--carousel"
        dots
        responsive
        slidesToShow={Math.min(slides, 3)}
      >
        {children}
      </Carousel>
    </HomeContainer>
  )
}

export default ContainedCarousel

export const HomeContainer = styled(Flex)<FlexProps>`
  // totalWidth = Image size + Image padding + Container padding
  --totalWidth: ${`${PROMO_CARD_MAX_SIZE + 20 + 28}px`};
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: var(--totalWidth);

  ${sizeMQ({
    medium: css`
      max-width: calc(2 * var(--totalWidth));

      &.ContainedCarousel--one-card {
        max-width: calc(var(--totalWidth));
      }
    `,
    extraLarge: css`
      max-width: calc(3 * var(--totalWidth));

      &.ContainedCarousel--one-card {
        max-width: calc(var(--totalWidth));
      }

      &.ContainedCarousel--two-cards {
        max-width: calc(2 * var(--totalWidth));
      }
    `,
  })}

  .ContainedCarousel--carousel {
    margin: 0 10px;

    ${sizeMQ({
      phoneXl: css`
        margin: 0 40px;
      `,
    })}
  }
`
