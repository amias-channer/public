import React from "react"
import styled, { css } from "styled-components"
import Block from "../../design-system/Block"
import Modal from "../../design-system/Modal"
import ScrollingPaginator from "../../design-system/ScrollingPaginator"
import Text from "../../design-system/Text"
import { ReferralsModal_data } from "../../lib/graphql/__generated__/ReferralsModal_data.graphql"
import { ReferralsModalQuery } from "../../lib/graphql/__generated__/ReferralsModalQuery.graphql"
import {
  getNodes,
  graphql,
  GraphQLProps,
  paginate,
  PaginationProps,
} from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import { fromISO8601, fromNowWithSeconds } from "../../lib/helpers/datetime"
import { truncateText } from "../../lib/helpers/stringUtils"
import { themeVariant } from "../../styles/styleUtils"
import AccountLink from "../accounts/AccountLink.react"
import AssetCell from "../assets/AssetCell.react"
import AssetQuantity from "../assets/AssetQuantity.react"
import ExternalLink from "../common/ExternalLink.react"
import Icon from "../common/Icon.react"
import Image from "../common/Image.react"
import Link from "../common/Link.react"
import LiveTimestamp from "../common/LiveTimestamp.react"
import { sizeMQ } from "../common/MediaQuery.react"
import Row from "../common/Row.react"
import TextCopyInput from "../forms/TextCopyInput.react"
import Panel from "../layout/Panel.react"
import Scrollbox from "../layout/Scrollbox.react"

interface Props {}

const NO_RESULTS_IMG = "/static/images/empty-results.svg"
const PAGE_SIZE = 10

class ReferralsModal extends GraphQLComponent<
  ReferralsModalQuery,
  Props & ReferralsModalPaginateProps & PaginationProps<ReferralsModalQuery>
> {
  render() {
    const { data, page } = this.props
    const { isMobile, wallet } = this.context

    const referrals = getNodes(data?.referrals)
    const referralLink = `https://opensea.io?ref=${
      wallet.getActiveAccountKey()?.address
    }`
    const textToShow = isMobile ? truncateText(referralLink, 30) : referralLink

    return (
      <>
        <Modal.Header>
          <Modal.Title>Refer a friend to OpenSea</Modal.Title>
        </Modal.Header>

        <StyledBody>
          {wallet.hasRegisteredUser() ? (
            <>
              <Text textAlign="center">
                Copy your unique referral link and share it far and wide. Any
                time a new user buys something on OpenSea, you’ll earn at least
                1% of the sale! Referrals are processed in bulk each month. Due
                to high gas prices, only referrals earning over .005 ETH will be
                processed.
              </Text>
              <div className="ReferralsModal--copy">
                <TextCopyInput
                  label="Referral Link"
                  textToCopy={referralLink}
                  textToShow={textToShow}
                />
              </div>
            </>
          ) : (
            <>
              <Text>
                In order to refer a friend, you need to set your username, which
                can be done on the{" "}
                <Link href="/account/settings">Account Settings</Link> page.
              </Text>
            </>
          )}
          <Panel
            icon="notes"
            isContentPadded={false}
            mode="always-open"
            title="Referred Sales"
          >
            {data && !referrals.length ? (
              <Block padding="12px">
                <Image
                  className="ReferralsModal--no-data-img"
                  height={100}
                  url={NO_RESULTS_IMG}
                />
                <Text textAlign="center">No referrals yet</Text>
                <div className="Orders--no-data-text"></div>
              </Block>
            ) : (
              <Scrollbox className="ReferralsModal--scroll-container">
                <Row
                  columnIndexClassName={{ 0: "ReferralsModal--item-col" }}
                  isHeader
                >
                  {[
                    "Item",
                    "Referral",
                    "Sale Price",
                    "Date",
                    "Affiliate Payout",
                  ]}
                </Row>
                {referrals.map(referral => {
                  const matchedSale = referral.matchedSale
                  const asset = matchedSale?.assetQuantity?.asset || null
                  const assetBundle = matchedSale?.assetBundle || null
                  const price = matchedSale?.price
                  const blockchainExplorerLink =
                    referral.paymentTransaction?.blockExplorerLink

                  return (
                    <Row
                      columnIndexClassName={{ 0: "ReferralsModal--item-col" }}
                      key={referral.relayId}
                    >
                      <AssetCell asset={asset} assetBundle={assetBundle} />
                      {referral.referredAccount && (
                        <AccountLink dataKey={referral.referredAccount} />
                      )}

                      {price ? <AssetQuantity data={price} /> : null}
                      <LiveTimestamp
                        renderFormattedTimestamp={() =>
                          fromNowWithSeconds(fromISO8601(referral.createdDate))
                        }
                      />
                      {blockchainExplorerLink ? (
                        <ExternalLink
                          className="ReferralsModal--view"
                          url={blockchainExplorerLink}
                        >
                          View
                          <Icon
                            className="ReferralsModal--view-icon"
                            value="open_in_new"
                          />
                        </ExternalLink>
                      ) : (
                        "Pending"
                      )}
                    </Row>
                  )
                })}

                <ScrollingPaginator
                  intersectionOptions={{ rootMargin: "512px" }}
                  isFirstPageLoading={!data}
                  page={page}
                  size={PAGE_SIZE}
                />
              </Scrollbox>
            )}
          </Panel>
        </StyledBody>
      </>
    )
  }
}

const query = graphql`
  query ReferralsModalQuery(
    $cursor: String
    $count: Int = 10
    $referrer: IdentityInputType
  ) {
    ...ReferralsModal_data
      @arguments(cursor: $cursor, count: $count, referrer: $referrer)
  }
`

interface ReferralsModalPaginateProps {
  data: ReferralsModal_data | null
}

export default withData<ReferralsModalQuery, Props>(
  paginate<
    ReferralsModalQuery,
    Props & ReferralsModalPaginateProps & GraphQLProps<ReferralsModalQuery>
  >(ReferralsModal, {
    fragments: {
      data: graphql`
        fragment ReferralsModal_data on Query
        @argumentDefinitions(
          cursor: { type: "String" }
          count: { type: "Int", defaultValue: 10 }
          referrer: { type: "IdentityInputType" }
        ) {
          referrals(referrer: $referrer, first: $count, after: $cursor)
            @connection(key: "ReferralsModal_referrals") {
            edges {
              node {
                matchedSale {
                  price {
                    ...AssetQuantity_data
                  }
                  assetBundle {
                    ...AssetCell_assetBundle
                  }
                  assetQuantity {
                    asset {
                      ...AssetCell_asset
                    }
                  }
                }
                paymentTransaction {
                  blockExplorerLink
                }
                createdDate
                relayId
                referredAccount {
                  ...AccountLink_data
                }
              }
            }
          }
        }
      `,
    },
    query,
  }),
  query,
)

const StyledBody = styled(Modal.Body)`
  .ReferralsModal--scroll-container {
    max-height: 400px;
  }

  .ReferralsModal--copy {
    margin: 8px 0 20px 0;
    display: flex;
    justify-content: center;
    text-align: left;
    width: 100%;
  }

  .ReferralsModal--empty {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px;

    .ReferralsModal--no-data-img {
      ${themeVariant({ variants: { dark: { opacity: 0.5 } } })}
    }

    .ReferralsModal--no-data-text {
      text-align: center;
    }
  }

  .ReferralsModal--item-col {
    flex-basis: 80px;
  }

  .ReferralsModal--view {
    display: flex;
    align-items: center;
  }

  .ReferralsModal--view-icon {
    margin-left: 4px;
  }

  ${sizeMQ({
    small: css`
      .ReferralsModal--item-col {
        flex-basis: 200px;
      }
    `,
  })}
`
