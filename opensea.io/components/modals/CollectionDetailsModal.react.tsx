import React, { Suspense, useState } from "react"
import { times } from "lodash"
import { useLazyLoadQuery } from "react-relay"
import styled, { css } from "styled-components"
import Block from "../../design-system/Block"
import Checkbox from "../../design-system/Checkbox"
import Flex from "../../design-system/Flex"
import Modal from "../../design-system/Modal"
import { useMultiStepFlowContext } from "../../design-system/Modal/MultiStepFlow.react"
import Skeleton from "../../design-system/Skeleton"
import Text from "../../design-system/Text"
import { CollectionDetailsModalQuery } from "../../lib/graphql/__generated__/CollectionDetailsModalQuery.graphql"
import { graphql } from "../../lib/graphql/graphql"
import { fromISO8601, fromNowWithSeconds } from "../../lib/helpers/datetime"
import { shortSymbolDisplay } from "../../lib/helpers/numberUtils"
import { pluralize } from "../../lib/helpers/stringUtils"
import { selectClassNames } from "../../lib/helpers/styling"
import { themeVariant } from "../../styles/styleUtils"
import AccountLink from "../accounts/AccountLink.react"
import CollectionConfidenceScore from "../collections/CollectionConfidenceScore.react"
import CenterAligned from "../common/CenterAligned.react"
import Icon from "../common/Icon.react"
import Link from "../common/Link.react"
import { sizeMQ } from "../common/MediaQuery.react"

type Props = {
  assetId: string
  renderNextModal: () => React.ReactNode
}

type ContentProps = {
  assetId: string
}

const CollectionDetailsModalContent = ({ assetId }: ContentProps) => {
  const { asset } = useLazyLoadQuery<CollectionDetailsModalQuery>(
    graphql`
      query CollectionDetailsModalQuery($asset: AssetRelayID!) {
        asset(asset: $asset) {
          collection {
            name
            createdDate
            slug
            owner {
              address
              createdDate
              displayName
              ...AccountLink_data
            }
            stats {
              totalVolume
              totalSales
              totalSupply
            }
          }
          ...CollectionConfidenceScore_data
        }
      }
    `,
    { asset: assetId },
  )

  const {
    collection: { createdDate, name, owner, slug, stats },
  } = asset

  const createdAgo = fromNowWithSeconds(fromISO8601(createdDate))
  const { totalSales, totalSupply, totalVolume } = stats
  const irregularCollectionName = /( {2})|[-_~|]/.test(name)

  const detailRows = [
    {
      type: "Created",
      info: {
        heading: createdAgo,
        subheading: `(${shortSymbolDisplay(totalSupply)} ${pluralize(
          "item",
          totalSupply,
        )})`,
      },
    },
    {
      type: "Sales",
      info: {
        heading: `${shortSymbolDisplay(totalSales)} sales`,
        subheading: `(${
          totalVolume < 1
            ? totalVolume.toFixed(2)
            : totalVolume < 100
            ? totalVolume.toFixed(1)
            : shortSymbolDisplay(totalVolume)
        } ETH total)`,
      },
    },
    {
      type: "Creator",
      info: {
        heading: owner && (
          <AccountLink dataKey={owner} target="_blank" variant="no-image" />
        ),
        subheading:
          owner &&
          `(Member since ${fromISO8601(owner.createdDate).format(
            "MMM D, YYYY",
          )})`,
      },
    },
    {
      type: "Name",
      info: {
        heading: (
          <Link href={`/collection/${slug}`} target="_blank">
            {name}
          </Link>
        ),
        warningText:
          irregularCollectionName &&
          "Name includes special characters or irregular spacing",
      },
    },
  ]

  return (
    <div className="CollectionDetailsModal--content">
      <Block borderBottom={"1px solid"} borderColor="border">
        <CollectionConfidenceScore dataKey={asset} />
      </Block>
      {detailRows.map(({ type, info }) => {
        const subheading = info.subheading && (
          <AccompanyingText>{info.subheading}</AccompanyingText>
        )

        return (
          <React.Fragment key={type}>
            <div
              className={selectClassNames("CollectionDetailsModal", {
                detail: true,
                noBorder: type === "Name",
              })}
            >
              <div className="CollectionDetailsModal--detail-type">{type}</div>
              <div className="CollectionDetailsModal--detail-info">
                <MainText>
                  {info.heading}
                  {info.warningText && (
                    <Block
                      display="inline"
                      marginLeft="8px"
                      verticalAlign="middle"
                    >
                      <Icon
                        color="yellow"
                        value="report_problem"
                        variant="outlined"
                      />
                    </Block>
                  )}
                </MainText>{" "}
                {subheading}
              </div>
            </div>
            {info.warningText && (
              <div
                className="CollectionDetailsModal--name-warning"
                key={`warning-${type}`}
              >
                {info.warningText}
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

const ContentLoading = () => (
  <Skeleton height="auto" marginTop="36px">
    {times(4, idx => (
      <Skeleton.Row className="CollectionDetailsModal--detail" key={idx}>
        <Skeleton.Line className="CollectionDetailsModal--detail-type" />
        <Skeleton.Line width="100%" />
      </Skeleton.Row>
    ))}
  </Skeleton>
)

const CollectionDetailsModal = ({ assetId, renderNextModal }: Props) => {
  const [hasConfirmed, setHasConfirmed] = useState(false)
  const { onNext } = useMultiStepFlowContext()
  const handleNext = () => {
    setHasConfirmed(true)
    setTimeout(() => {
      onNext(renderNextModal())
    }, 500)
  }

  return (
    <>
      <Modal.Header>
        <Modal.Title>Review collection details</Modal.Title>
      </Modal.Header>

      <Modal.Body height="auto">
        <DivContainer>
          As an open marketplace, anyone can upload content, including content
          that may resemble others. Please review:
          <Suspense fallback={<ContentLoading />}>
            <CollectionDetailsModalContent assetId={assetId} />
          </Suspense>
        </DivContainer>
      </Modal.Body>

      <Modal.Footer>
        <CenterAligned>
          <Flex alignItems="center" paddingY="8px">
            <Checkbox
              checked={hasConfirmed}
              id="review-confirmation"
              onChange={() => handleNext()}
            />
            <Block marginLeft="8px">
              <Text
                as="label"
                className="CollectionDetailsModal--confirmation-label"
                htmlFor="review-confirmation"
              >
                I have reviewed this information and this is the correct
                collection
              </Text>
            </Block>
          </Flex>
        </CenterAligned>
      </Modal.Footer>
    </>
  )
}

const MainText = styled(Text).attrs({
  as: "span",
  variant: "bold",
})`
  max-width: 100%;
  margin-right: 8px;
  flex-shrink: 0;
  white-space: pre-wrap;
`

const AccompanyingText = styled(Text).attrs({
  as: "span",
})`
  color: ${props => props.theme.colors.text.subtle};
  font-size: 14px;
`

const DivContainer = styled.div`
  padding-bottom: 16px;

  .CollectionDetailsModal--content {
    margin-top: 24px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 5px;
  }

  .CollectionDetailsModal--detail {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-size: 16px;
    margin: 0 16px;

    .CollectionDetailsModal--detail-info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
    }

    &.CollectionDetailsModal--noBorder {
      border-bottom: 0;
    }
  }

  .CollectionDetailsModal--detail-type {
    width: 76px;
    flex-shrink: 0;
    line-height: 24px;
    margin-right: 16px;
  }

  .CollectionDetailsModal--name-warning {
    margin: -12px 0 24px;
    margin-left: 108px;
    margin-right: 16px;
  }

  ${sizeMQ({
    tabletS: css`
      padding: 16px 24px;

      .CollectionDetailsModal--detail {
        margin: 0 24px;
      }

      .CollectionDetailsModal--detail-type {
        margin-right: 50px;
      }

      .CollectionDetailsModal--name-warning {
        margin-left: 150px;
        margin-right: 24px;
      }

      .CollectionDetailsModal--confirmation-label {
        font-size: 16px;
      }
    `,
  })}

  .CollectionDetailsModal--confirmation-label {
    ${({ theme }) =>
      themeVariant({
        variants: {
          dark: { color: theme.colors.white },
          light: { color: theme.colors.oil },
        },
      })}
  }
`

export default CollectionDetailsModal
