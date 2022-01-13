import React from "react"
import styled, { css } from "styled-components"
import {
  HOME_PAGE_HEADING,
  HOME_PAGE_SUBHEADING,
  INSTAGRAM_URL,
  TWITTER_URL,
} from "../../../constants"
import Block from "../../../design-system/Block"
import Button from "../../../design-system/Button"
import Flex from "../../../design-system/Flex"
import Item from "../../../design-system/Item"
import ItemSkeleton from "../../../design-system/ItemSkeleton"
import { Media } from "../../../design-system/Media"
import Modal from "../../../design-system/Modal"
import Skeleton from "../../../design-system/Skeleton"
import Text from "../../../design-system/Text"
import UnstyledButton from "../../../design-system/UnstyledButton"
import { useTranslations } from "../../../hooks/useTranslations"
import { trackClickGetFeatured } from "../../../lib/analytics/events/homepageEvents"
import { trackClickFeaturedAsset } from "../../../lib/analytics/events/itemEvents"
import { Featured_data } from "../../../lib/graphql/__generated__/Featured_data.graphql"
import { fragmentize, graphql } from "../../../lib/graphql/graphql"
import { getAssetUrl } from "../../../lib/helpers/asset"
import { getSocialIcon } from "../../../lib/helpers/icons"
import { themeVariant } from "../../../styles/styleUtils"
import AssetMedia from "../../assets/AssetMedia.react"
import ActionButton from "../../common/ActionButton.react"
import Link from "../../common/Link.react"
import { sizeMQ } from "../../common/MediaQuery.react"

interface Props {
  data?: Featured_data | null
}

const FEATURED_IMAGE_MAX_WIDTH = 550

const Featured = ({ data }: Props) => {
  const { tr } = useTranslations()
  const background = {
    backgroundImage: `url(${data?.imagePreviewUrl || data?.imageUrl})`,
  }
  const GetFeatured = () => (
    <Modal
      trigger={open => (
        <UnstyledButton
          onClick={() => {
            open()
            trackClickGetFeatured()
          }}
        >
          <Text className="Featured--get-featured">
            {tr("Get featured on the homepage")}
          </Text>
        </UnstyledButton>
      )}
    >
      <GetFeaturedModal />
    </Modal>
  )

  return (
    <>
      <Container>
        <Block className="Featured--background-container">
          <Background style={background} />
        </Block>
        <Flex className="Featured--container">
          <Flex className="Featured--title">
            <Text className="Featured--header" variant="h1">
              {tr(HOME_PAGE_HEADING)}
            </Text>
            <Text as="span" className="Featured--subheader" variant="subtitle">
              {tr(HOME_PAGE_SUBHEADING)}
            </Text>
            <Flex className="Featured--button-container">
              <Block marginRight="20px">
                <ActionButton className="Featured--button" href="/assets">
                  {tr("Explore")}
                </ActionButton>
              </Block>

              <ActionButton
                className="Featured--button"
                href="/collections"
                type="secondary"
              >
                {tr("Create")}
              </ActionButton>
            </Flex>
            <Media greaterThanOrEqual="md">
              {(mediaClassNames, renderChildren) =>
                renderChildren && (
                  <Flex
                    alignItems="flex-end"
                    className={mediaClassNames}
                    height="100%"
                  >
                    <Flex height="30px">
                      <GetFeatured />
                    </Flex>
                  </Flex>
                )
              }
            </Media>
          </Flex>

          <Flex className="Featured--image">
            {data ? (
              <Flex as="article" className="Featured--image-card">
                <Link
                  className="Featured--image-link"
                  href={getAssetUrl(data)}
                  onClick={() =>
                    trackClickFeaturedAsset(data, {
                      assetName: data.name,
                      creatorUsername: data.creator?.user?.publicUsername,
                      link: getAssetUrl(data),
                    })
                  }
                >
                  <AssetMedia
                    alt="Featured"
                    asset={data}
                    autoPlay
                    className="Featured--image-media"
                    isMuted
                    mediaStyles={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      borderRadius: "inherit",
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    size={FEATURED_IMAGE_MAX_WIDTH}
                  />

                  {data.creator && (
                    <Item as="footer" className="Featured--image-text-area">
                      <Item.Avatar
                        alt="Featured creator"
                        className="Featured--image-avatar"
                        outline={0}
                        size={40}
                        src={data.creator.imageUrl}
                      />
                      <Item.Content className="Featured--image-content">
                        <Item.Title>{data.name}</Item.Title>
                        <Item.Description
                          className="Featured--image-creator"
                          fontSize={14}
                        >
                          {data.creator.user?.publicUsername}
                        </Item.Description>
                      </Item.Content>
                    </Item>
                  )}
                </Link>
              </Flex>
            ) : (
              <Skeleton className="Featured--skeleton">
                <Skeleton.Row className="Featured--skeleton-row">
                  <Skeleton.Block className="Featured--skeleton-block" />
                  <Skeleton.Block
                    className="Featured--skeleton-block"
                    direction="rtl"
                  />
                </Skeleton.Row>
                <Skeleton.Row>
                  <ItemSkeleton>
                    <ItemSkeleton.Avatar />
                    <ItemSkeleton.Content>
                      <ItemSkeleton.Title />
                      <ItemSkeleton.Description />
                    </ItemSkeleton.Content>

                    <ItemSkeleton.Side>
                      <ItemSkeleton.Title />
                      <ItemSkeleton.Description />
                    </ItemSkeleton.Side>
                  </ItemSkeleton>
                </Skeleton.Row>
              </Skeleton>
            )}
          </Flex>

          <Media lessThan="md">
            {(mediaClassNames, renderChildren) =>
              renderChildren && (
                <Flex
                  className={mediaClassNames}
                  justifyContent="center"
                  width="100%"
                >
                  <GetFeatured />
                </Flex>
              )
            }
          </Media>
        </Flex>
      </Container>
    </>
  )
}

export default fragmentize(Featured, {
  fragments: {
    data: graphql`
      fragment Featured_data on AssetType {
        name
        imagePreviewUrl
        imageUrl
        creator {
          address
          imageUrl
          user {
            publicUsername
          }
        }
        ...asset_url
        ...AssetMedia_asset
        ...itemEvents_data
      }
    `,
  },
})

const Background = styled(Flex)`
  height: 780px;
  background-size: cover;
  background-color: ${props => props.theme.colors.background};
  background-position: center;
  opacity: 0.3;
  filter: blur(8px);
  -webkit-filter: blur(8px);
  mask: linear-gradient(#fff, transparent);
  -webkit-mask: linear-gradient(#fff, transparent);

  ${sizeMQ({
    large: css`
      height: 586px;
    `,
  })};
`

const Container = styled(Flex)`
  height: 780px;

  ${sizeMQ({
    large: css`
      height: 586px;
    `,
  })}

  .Featured--background-container {
    width: 100%;
    position: absolute;
    overflow: hidden;
  }

  .Featured--container {
    margin: 0 auto;
    max-width: min(1280px, calc(100% - 40px));
    width: 100%;
    flex-wrap: wrap;

    &:hover {
      box-shadow: 10px;
    }

    .Featured--title {
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 30px 20px 20px 20px;

      ${sizeMQ({
        large: css`
          width: 45%;
          padding: 110px 20px 44px 30px;
          align-items: flex-start;
        `,
      })}

      .Featured--header {
        margin: 0;
        font-size: 28px;
        text-align: center;
        z-index: 2;
        max-width: 330px;

        ${sizeMQ({
          small: css`
            font-size: 32px;
            max-width: ${FEATURED_IMAGE_MAX_WIDTH}px;
          `,
          large: css`
            text-align: left;
            max-width: 100%;
            margin-right: 10px;
          `,
          extraLarge: css`
            font-size: 45px;
          `,
        })}
      }

      .Featured--subheader {
        margin-top: 20px;
        max-width: 320px;
        text-align: center;
        z-index: 2;
        font-size: 18px;

        ${props =>
          themeVariant({
            variants: {
              light: {
                color: `${props.theme.colors.oil};`,
              },
              dark: {
                color: `${props.theme.colors.text.subtle};`,
              },
            },
          })}

        ${sizeMQ({
          large: css`
            font-size: 24px;
            text-align: left;
          `,
        })}
      }
      .Featured--button-container {
        margin-top: 20px;
        z-index: 2;

        ${sizeMQ({
          large: css`
            margin-top: 40px;
          `,
        })}

        .Featured--button {
          max-width: 120px;
          opacity: 100%;

          ${sizeMQ({
            large: css`
              max-width: 167px;
            `,
          })}
        }
      }
    }

    .Featured--get-featured {
      color: ${props => props.theme.colors.primary};
      font-weight: 600;
      z-index: 2;

      &:hover {
        color: ${props => props.theme.colors.darkSeaBlue};
      }
    }

    .Featured--image {
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding-top: 0;

      ${sizeMQ({
        large: css`
          width: 55%;
          padding: 40px 0px;
          align-items: flex-end;
        `,
      })}

      .AssetMedia--img {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      .Featured--skeleton {
        max-width: 355px;
        ${sizeMQ({
          large: css`
            max-width: 550px;
          `,
        })}

        .Featured--skeleton-row {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          margin-bottom: -10px;

          .Featured--skeleton-block {
            height: 300px;

            ${sizeMQ({
              large: css`
                height: 420px;
              `,
            })}
          }
        }
      }

      .Featured--image-card {
        width: 100%;
        background-color: ${props => props.theme.colors.surface};
        flex-direction: column;
        border-radius: 10px;
        z-index: 2;
        max-width: 355px;
        box-shadow: 0px 0px 10px 0px
          ${props => props.theme.colors.withOpacity.charcoal.light};

        ${sizeMQ({
          large: css`
            max-width: 550px;
            margin-right: 30px;
          `,
        })}

        &:hover {
          transition: box-shadow 0.3s ease-in;
          box-shadow: 0px 0px 50px 0px
            ${props => props.theme.colors.withOpacity.charcoal.light};
        }

        .Image--image {
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }

        .Featured--image-text-area {
          border: none;

          &:hover {
            box-shadow: none;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
          }

          .Featured--image-avatar {
            object-fit: cover;
          }

          .Featured--image-creator {
            color: ${props => props.theme.colors.primary};
            &:hover {
              color: ${props => props.theme.colors.darkSeaBlue};
            }
          }
        }

        .Featured--image-link {
          border-radius: 10px;

          .Featured--image-media {
            height: 80vw;
            z-index: 2;
            border-bottom: 1px solid ${props => props.theme.colors.border};

            ${sizeMQ({
              phoneL: css`
                height: 300px;
              `,
              large: css`
                height: 420px;
              `,
            })}
          }
        }
      }
    }
  }
`

const GetFeaturedModal = () => (
  <>
    <Modal.Header>
      <Modal.Title>Get featured on the homepage</Modal.Title>
    </Modal.Header>

    <ModalBody>
      <ol className="GetFeaturedModal--list">
        <li className="GetFeaturedModal--list-item">
          <strong className="GetFeaturedModal--text-strong">Create</strong> your
          NFT on OpenSea
        </li>
        <li className="GetFeaturedModal--list-item">
          <strong className="GetFeaturedModal--text-strong">Post</strong> a link
          to your NFT on Twitter or Instagram
        </li>
        <li className="GetFeaturedModal--list-item">
          <strong className="GetFeaturedModal--text-strong">Include</strong>{" "}
          @OpenSea and #OpenSeaNFT in your post
        </li>
        <li className="GetFeaturedModal--list-item">
          We'll periodically review these NFTs and select one to feature
        </li>
      </ol>
      <Text className="GetFeaturedModal--text">
        Be sure to{" "}
        <strong className="GetFeaturedModal--text-strong">
          follow us on Twitter and Instagram
        </strong>{" "}
        to receive updates on our featured NFTs.
      </Text>
    </ModalBody>

    <Modal.Footer>
      <Block maxHeight="50px" width="50%">
        <Button
          eventSource="GetFeaturedModal"
          height="100%"
          href={TWITTER_URL}
          width="100%"
        >
          {getSocialIcon({ name: "twitter" })}{" "}
          <Text color="white" marginLeft="8px">
            Twitter
          </Text>
        </Button>
      </Block>

      <Block marginLeft="32px" maxHeight="50px" width="50%">
        <Button
          eventSource="GetFeaturedModal"
          height="100%"
          href={INSTAGRAM_URL}
          width="100%"
        >
          {getSocialIcon({ name: "instagram" })}{" "}
          <Text color="white" marginLeft="8px">
            Instagram
          </Text>
        </Button>
      </Block>
    </Modal.Footer>
  </>
)

const ModalBody = styled(Modal.Body)`
  font-weight: 400;

  ${props =>
    themeVariant({
      variants: {
        light: {
          color: `${props.theme.colors.oil};`,
        },
        dark: {
          color: `${props.theme.colors.text.subtle};`,
        },
      },
    })}

  .GetFeaturedModal--text-strong {
    font-weight: 600;
  }

  .GetFeaturedModal--list {
    padding-left: 20px;

    .GetFeaturedModal--list-item {
      padding-bottom: 10px;
    }
  }
`
