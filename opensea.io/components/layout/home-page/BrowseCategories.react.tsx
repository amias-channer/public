import React from "react"
import styled, { css } from "styled-components"
import { CATEGORIES } from "../../../constants"
import Block from "../../../design-system/Block"
import Button from "../../../design-system/Button"
import Flex from "../../../design-system/Flex"
import Text from "../../../design-system/Text"
import CarouselCard from "../../common/CarouselCard.react"
import CenterAligned from "../../common/CenterAligned.react"
import { HomeContainer } from "../../common/ContainedCarousel"
import { sizeMQ } from "../../common/MediaQuery.react"

const BrowseCategories = () => {
  const cards = [
    ...CATEGORIES.map(category => ({
      image: category.slug,
      title: category.name,
      url: `/collection/${category.slug}`,
      text: category.text,
    })),
    {
      image: "all-nfts",
      title: "All NFTs",
      url: "/assets",
      text: "Just want to explore, browse, and discover the endless possibilities of NFTs? Browse art, collectibles, trading cards, and more.",
    },
  ]

  return (
    <Container>
      <HomeContainer className="BrowseCategories--home-container">
        <Flex textAlign="center">
          <Text as="h2" margin="0" variant="h3">
            Browse by category
          </Text>
        </Flex>
        <Block className="BrowseCategories--card-container">
          {cards.map(card => (
            <CarouselCard
              containerClassName="BrowseCategories--card"
              eventSource="BrowseCategories"
              href={card.url}
              imageUrl={`/static/images/categories/${card.image}.png`}
              key={card.image}
            >
              <Flex alignItems="center" height={40} justifyContent="center">
                <Text
                  as="span"
                  className="BrowseCategories--title"
                  variant="h4"
                >
                  {card.title}
                </Text>
              </Flex>
            </CarouselCard>
          ))}
        </Block>
        <Block className="BrowseCategories--explore-button" marginTop="40px">
          <Button eventSource="BrowseCategories" href="/assets">
            Explore the marketplace
          </Button>
        </Block>
      </HomeContainer>
    </Container>
  )
}

export default BrowseCategories

const Container = styled(CenterAligned)`
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
  margin-top: 40px;

  .BrowseCategories--card {
    place-self: center;
    transition: transform 0.1s ease-out;
    border-radius: ${props => props.theme.borderRadius.default};

    &:hover {
      box-shadow: ${props => props.theme.shadow};
    }

    ${sizeMQ({
      phoneL: css`
        max-width: 340px;
      `,
      tabletS: css`
        max-width: unset;
      `,
    })}
  }

  .BrowseCategories--card-container {
    display: grid;
    grid-gap: 15px;
    margin-top: 50px;
    width: 100%;
    padding: 0 20px;

    ${sizeMQ({
      tabletS: css`
        padding: 0 40px;
        grid-template-columns: 1fr 1fr;
      `,
      extraLarge: css`
        grid-template-columns: 1fr 1fr 1fr;
      `,
    })}
  }

  .BrowseCategories--title {
    color: ${props => props.theme.colors.text.body};
  }
`
