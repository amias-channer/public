import React, { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import styled from "styled-components"
import Block from "../../design-system/Block"
import Flex from "../../design-system/Flex"
import FlexEnd from "../../design-system/FlexEnd"
import Lightbox from "../../design-system/Lightbox"
import Modal from "../../design-system/Modal"
import Skeleton from "../../design-system/Skeleton"
import Text from "../../design-system/Text"
import UnstyledButton from "../../design-system/UnstyledButton"
import Tr from "../../i18n/Tr.react"
import TrVar from "../../i18n/TrVar.react"
import { CollectionHeader_data } from "../../lib/graphql/__generated__/CollectionHeader_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { readCollectionVerificationStatus } from "../../lib/helpers/verification"
import { themeVariant } from "../../styles/styleUtils"
import Banner from "../common/Banner.react"
import Icon from "../common/Icon.react"
import Image from "../common/Image.react"
import SocialBar from "../common/SocialBar.react"
import CollectionStatusModal from "../modals/CollectionStatusModal.react"
import CollectionStatsBar from "./CollectionStatsBar.react"
import { VerificationIcon } from "./VerificationIcon.react"

interface Props {
  data?: CollectionHeader_data | null
  isCategory: boolean
}

const CollectionHeader = ({ data, isCategory }: Props) => {
  const renderPlaceHolder = () => {
    return (
      <DivContainer>
        <Banner className="CollectionHeader--banner" />
        <Skeleton
          alignItems="center"
          className="CollectionHeader--info"
          marginBottom="20px"
        >
          <Skeleton.Circle
            className="CollectionHeader--collection-image CollectionHeader--with-border"
            height="130px"
            width="130px"
          />
          <Skeleton.Row>
            <Skeleton.Line height="48px" width="100px" />
            <Skeleton.Line direction="rtl" height="48px" width="100px" />
          </Skeleton.Row>
          <Skeleton.Row>
            <Skeleton.Line height="24px" width="180px" />
            <Skeleton.Line direction="rtl" height="24px" width="180px" />
          </Skeleton.Row>
          <Skeleton.Row>
            <Skeleton.Line height="24px" width="180px" />
            <Skeleton.Line direction="rtl" height="24px" width="180px" />
          </Skeleton.Row>
        </Skeleton>
      </DivContainer>
    )
  }

  if (!data) {
    return renderPlaceHolder()
  }
  const verificationStatus = readCollectionVerificationStatus(data)
  const { bannerImageUrl, name, imageUrl } = data
  return (
    <DivContainer>
      <Banner
        className="CollectionHeader--banner"
        imageUrl={bannerImageUrl || undefined}
      />
      {!isCategory ? (
        <Flex alignItems="center" flexDirection="column" marginBottom="20px">
          {imageUrl ? (
            <Block className="CollectionHeader--info">
              <Lightbox
                trigger={open => (
                  <UnstyledButton onClick={open}>
                    <Image
                      className="CollectionHeader--collection-image"
                      size={130}
                      sizing="cover"
                      url={imageUrl}
                      variant="round"
                    />
                  </UnstyledButton>
                )}
              >
                <Image sizing="cover" url={imageUrl} variant="round" />
              </Lightbox>
              <Modal
                trigger={open => (
                  <UnstyledButton
                    className="CollectionHeader--verification-status-modal-trigger"
                    onClick={open}
                  >
                    <VerificationIcon
                      className="CollectionHeader--verification-icon"
                      size="large"
                      verificationStatus={verificationStatus}
                    />
                  </UnstyledButton>
                )}
              >
                <CollectionStatusModal
                  verificationStatus={verificationStatus}
                />
              </Modal>
            </Block>
          ) : (
            <Skeleton alignItems="center" className="CollectionHeader--info">
              <Skeleton.Circle
                className="CollectionHeader--collection-image CollectionHeader--with-border"
                height="130px"
                width="130px"
              />
            </Skeleton>
          )}
          <FlexEnd marginRight="40px" marginTop="-44px" width="100%">
            <SocialBar data={data} />
          </FlexEnd>
          <Flex alignItems="center">
            <Text
              marginTop="0.25rem"
              maxWidth="600px"
              textAlign="center"
              variant="h2"
            >
              <span>{name}</span>
            </Text>
          </Flex>
          <CollectionStatsBar data={data} />
          <CollectionDescription data={data} />
        </Flex>
      ) : (
        <Flex alignItems="center" flexDirection="column" marginBottom="20px">
          <Text maxWidth="600px" textAlign="center" variant="h2">
            Explore {name}
          </Text>
          <CollectionDescription data={data} />
        </Flex>
      )}
    </DivContainer>
  )
}

const DESCRIPTION_MAX_HEIGHT = 130

const CollectionDescription = ({
  data,
}: {
  data?: CollectionHeader_data | null
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<string | number>("fit-content")
  const overflowed = useRef(0)
  useEffect(() => {
    overflowed.current =
      containerRef.current &&
      containerRef.current.scrollHeight > DESCRIPTION_MAX_HEIGHT + 24
        ? containerRef.current.scrollHeight
        : 0
    setMaxHeight(DESCRIPTION_MAX_HEIGHT)
  }, [])

  if (!data) {
    return null
  }
  const { description, name } = data
  const closed = overflowed.current && maxHeight === DESCRIPTION_MAX_HEIGHT

  return description ? (
    <>
      <div
        className="CollectionHeader--description"
        ref={containerRef}
        style={{
          maxHeight: maxHeight,
          mask: closed ? "linear-gradient(#fff 45%, transparent)" : undefined,
          WebkitMask: closed
            ? "linear-gradient(#fff 45%, transparent)"
            : undefined,
        }}
      >
        <ReactMarkdown linkTarget="_blank">{description}</ReactMarkdown>
      </div>
      {overflowed.current ? (
        <Flex maxWidth="400px" width="100%">
          <UnstyledButton
            className="CollectionHeader--expand-container"
            onClick={() => {
              setMaxHeight(
                closed && containerRef.current
                  ? containerRef.current.scrollHeight
                  : DESCRIPTION_MAX_HEIGHT,
              )
            }}
          >
            <Icon
              className="CollectionHeader--expand"
              value={closed ? "expand_more" : "expand_less"}
            />
          </UnstyledButton>
        </Flex>
      ) : null}
    </>
  ) : (
    <div className="CollectionHeader--description">
      <Tr>
        Welcome to the home of <TrVar example="Colorglyphs">{name}</TrVar> on
        OpenSea. Discover the best items in this collection.
      </Tr>
    </div>
  )
}

export default fragmentize(CollectionHeader, {
  fragments: {
    data: graphql`
      fragment CollectionHeader_data on CollectionType {
        name
        description
        imageUrl
        bannerImageUrl
        ...CollectionStatsBar_data
        ...SocialBar_data
        ...verification_data
      }
    `,
  },
})

const DivContainer = styled.div`
  position: relative;
  .CollectionHeader--info {
    margin-top: -64px;
    position: relative;
  }

  .CollectionHeader--verification-status-modal-trigger {
    display: inline-flex;
    margin-left: 4px;
    position: absolute;
    bottom: 0;
    right: 8px;
  }

  .CollectionHeader--banner {
    height: 220px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  .CollectionHeader--collection-image {
    ${props =>
      themeVariant({
        variants: {
          light: {
            border: `2px solid ${props.theme.colors.fog};`,
            background: props.theme.colors.fog,
          },
          dark: {
            border: `2px solid ${props.theme.colors.oil};`,
            background: props.theme.colors.oil,
          },
        },
      })}
  }

  .CollectionHeader--with-border {
    ${props =>
      themeVariant({
        variants: {
          light: {
            border: `2px solid ${props.theme.colors.white};`,
          },
          dark: {
            border: `2px solid ${props.theme.colors.oil};`,
          },
        },
      })}
  }

  .CollectionHeader--verification-icon {
    height: fit-content;
  }

  .CollectionHeader--expand-container {
    width: 100%;
    justify-content: center;
    border-radius: 10px;
    transition: 0.2s background-color;

    &:hover {
      background-color: ${props =>
        props.theme.colors.withOpacity.gray.veryLight};
    }

    .CollectionHeader--expand {
      color: ${props => props.theme.colors.gray};

      &:hover {
        color: ${props => props.theme.colors.darkGray};
      }
    }
  }

  .CollectionHeader--description {
    color: ${props => props.theme.colors.text.subtle};
    text-align: center;
    max-width: 800px;
    padding: 20px;
    overflow: hidden;
    transition: max-height 100ms;

    * {
      margin-top: 0px;
      font-size: 16px;
    }
  }
`
