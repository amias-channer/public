import React from "react"
import styled, { css } from "styled-components"
import Flex from "../../../design-system/Flex"
import Text from "../../../design-system/Text"
import { themeVariant } from "../../../styles/styleUtils"
import CenterAligned from "../../common/CenterAligned.react"
import { HomeContainer } from "../../common/ContainedCarousel"
import Image from "../../common/Image.react"
import Link from "../../common/Link.react"
import { sizeMQ } from "../../common/MediaQuery.react"

const GettingStarted = () => {
  const steps = [
    {
      image: "wallet",
      title: "Set up your wallet",
      text: (
        <Text marginTop="4px">
          Once you’ve set up your wallet of choice, connect it to OpenSea by
          clicking the wallet icon in the top right corner. Learn about the{" "}
          <Link
            className="GettingStarted--link"
            eventSource="GettingStarted"
            href="https://openseahelp.zendesk.com/hc/en-us/articles/1500007978402-Wallets-supported-by-OpenSea"
          >
            wallets we support
          </Link>
          .
        </Text>
      ),
    },
    {
      image: "collection",
      title: "Create your collection",
      text: (
        <Text marginTop="4px">
          Click{" "}
          <Link
            className="GettingStarted--link"
            eventSource="GettingStarted"
            href="/collections"
          >
            Create
          </Link>{" "}
          and set up your collection. Add social links, a description, profile
          &amp; banner images, and set a secondary sales fee.
        </Text>
      ),
    },
    {
      image: "nft",
      title: "Add your NFTs",
      text: (
        <Text marginTop="4px">
          Upload your work (image, video, audio, or 3D art), add a title and
          description, and customize your NFTs with properties, stats, and
          unlockable content.
        </Text>
      ),
    },
    {
      image: "sale",
      title: "List them for sale",
      text: (
        <Text marginTop="4px">
          Choose between auctions, fixed-price listings, and declining-price
          listings. You choose how you want to sell your NFTs, and we help you
          sell them!
        </Text>
      ),
    },
  ]
  return (
    <Container>
      <HomeContainer textAlign="center">
        <Text as="h2" variant="h3">
          Create and sell your NFTs
        </Text>
        <Flex className="GettingStarted--step-container">
          {steps.map(step => (
            <Step
              imageUrl={`/static/images/icons/${step.image}.svg`}
              key={step.image}
              text={step.text}
              title={step.title}
            />
          ))}
        </Flex>
      </HomeContainer>
    </Container>
  )
}

export default GettingStarted

interface StepProps {
  imageUrl: string
  title: string
  text: React.ReactNode
}

const Step = ({ imageUrl, title, text }: StepProps) => {
  return (
    <CenterAligned className="GettingStarted--step">
      <Image size={40} url={imageUrl} />
      <Text marginBottom="4px" variant="bold">
        {title}
      </Text>
      {text}
    </CenterAligned>
  )
}

const Container = styled(CenterAligned)`
  width: 100%;
  padding-top: 40px;
  padding-bottom: 40px;
  ${props =>
    themeVariant({
      variants: {
        light: {
          backgroundColor: props.theme.colors.cloud,
        },
        dark: {
          backgroundColor: props.theme.colors.withOpacity.oil,
        },
      },
    })}

  .GettingStarted--step-container {
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 40px 0 20px 0;
    width: 100%;

    .GettingStarted--step {
      max-width: 100%;
      margin-bottom: 20px;
      margin-right: 20px;
      margin-left: 20px;
      padding: 0 20px;
      justify-content: flex-start;

      ${sizeMQ({
        small: css`
          max-width: 240px;
          padding: 0px;
        `,
        medium: css`
          max-width: 300px;
        `,
        large: css`
          max-width: 360px;
        `,
        extraLarge: css`
          max-width: 260px;
        `,
      })}

      .GettingStarted--link {
        font-weight: 600;
        color: ${props => props.theme.colors.primary};

        &:hover {
          color: ${props => props.theme.colors.darkSeaBlue};
        }
      }
    }
  }
`
