import React from "react"
import moment from "moment"
import styled, { css } from "styled-components"
import Flex from "../../../design-system/Flex"
import Text from "../../../design-system/Text"
import { Promotions_promotions } from "../../../lib/graphql/__generated__/Promotions_promotions.graphql"
import { fragmentize, graphql } from "../../../lib/graphql/graphql"
import ContainedCarousel from "../../common/ContainedCarousel"
import { sizeMQ } from "../../common/MediaQuery.react"
import PromoCard from "./PromoCard.react"

interface Props {
  promotions?: Promotions_promotions | null
}

const Promotions = ({ promotions: data }: Props) => {
  const promotions = data ?? []

  // TODO: fix logic to correctly display promotions without saleStartTime
  const relevantPromotions = promotions.filter(p => Boolean(p.saleStartTime))

  if (relevantPromotions.length === 0) {
    return null
  }

  const now = moment()

  return (
    <Container>
      <Text as="h2" marginBottom="8px" textAlign="center" variant="h3">
        Exclusive OpenSea drops
      </Text>
      <ContainedCarousel slidesNumber={relevantPromotions.length}>
        {relevantPromotions.map(promotion => (
          <PromoCard
            key={promotion.promoCardLink}
            now={now}
            promotion={promotion}
          />
        ))}
      </ContainedCarousel>
    </Container>
  )
}

const Container = styled(Flex).attrs({ as: "section" })`
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 120px;

  .Carousel--left-arrow {
    left: -17px;
    top: 62.5%;
  }

  .Carousel--right-arrow {
    right: -17px;
    top: 62.5%;
  }

  ${sizeMQ({
    extraLarge: css`
      .Carousel--left-arrow {
        top: 63%;
      }

      .Carousel--right-arrow {
        top: 63%;
      }
    `,
  })}
`

export default fragmentize(Promotions, {
  fragments: {
    promotions: graphql`
      fragment Promotions_promotions on PromotionType @relay(plural: true) {
        id
        promoCardImg
        promoCardLink
        promoHeader
        cardColor
        promoSubtitle
        saleStartTime
        saleEndTime
      }
    `,
  },
})
