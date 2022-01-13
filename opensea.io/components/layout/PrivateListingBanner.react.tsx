import React from "react"
import styled from "styled-components"
import AccountLink from "../../components/accounts/AccountLink.react"
import Block from "../../design-system/Block"
import { PrivateListingBannerQuery } from "../../lib/graphql/__generated__/PrivateListingBannerQuery.graphql"
import { graphql } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import NoticeBanner from "./NoticeBanner.react"

interface Props {}

class PrivateListingBanner extends GraphQLComponent<
  PrivateListingBannerQuery,
  Props
> {
  render() {
    const { data } = this.props
    const { wallet } = this.context
    const maker = data?.tradeSummary?.bestAsk?.maker
    const isOwner = maker && wallet.isActiveAccount(maker)
    const taker = data?.tradeSummary?.bestAsk?.taker
    if (!data || !taker || !data?.tradeSummary?.bestAsk) {
      return null
    }

    const identityPart = (
      <Block display="inline-block">
        <AccountLink
          className="PrivateListingBanner--account-link"
          dataKey={taker}
          mode="light"
        />
      </Block>
    )

    return (
      <DivContainer>
        <NoticeBanner>
          <div className="PrivateListingBanner--content">
            {isOwner ? (
              <div className="PrivateListingBanner--identity-sentence">
                This is a private listing that you made for {identityPart}.
              </div>
            ) : !wallet.activeAccount ? (
              // TODO: add this back after confirming why it's there: className="item--banner-hoverable"
              <>
                <div className="PrivateListingBanner--identity-sentence">
                  This listing is reserved for {identityPart}.
                </div>
                <div>
                  If this is you, switch to this wallet to complete your
                  purchase.
                </div>
              </>
            ) : !wallet.isActiveAccount(taker) ? (
              // TODO: @DJViau When the modal from the account settings tasks gets merged, use it here to prompt the user to connect.
              // <Modal
              //   render={() => (
              //     <>
              //       <h4>Please switch accounts</h4>
              //       <p>
              //         If you control {truncateAddress(taker?.address)}, please
              //         switch to that address to buy this item.
              //       </p>
              //     </>
              //   )}
              // >
              // TODO: put the `NoticeBanner` back in here.
              // </ModalV2>
              // TODO: add this back: className="item--banner-hoverable".
              <>
                <div className="PrivateListingBanner--identity-sentence">
                  This listing is reserved for {identityPart}.
                </div>

                <div>
                  If this is you, connect to this wallet to complete your
                  purchase.
                </div>
              </>
            ) : (
              "This listing is reserved for you!"
            )}
          </div>
        </NoticeBanner>
      </DivContainer>
    )
  }
}

export default withData<PrivateListingBannerQuery, Props>(
  PrivateListingBanner,
  graphql`
    query PrivateListingBannerQuery(
      $archetype: ArchetypeInputType
      $bundle: BundleSlug
      $includePrivate: Boolean!
    ) {
      tradeSummary(
        archetype: $archetype
        bundle: $bundle
        includePrivate: $includePrivate
      ) {
        bestAsk {
          taker {
            address
            ...AccountLink_data
            ...wallet_accountKey
          }
          maker {
            ...wallet_accountKey
          }
        }
      }
    }
  `,
)

const DivContainer = styled.div`
  width: 100%;

  .PrivateListingBanner--content {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    font-size: 16px;
    justify-content: center;
    width: 100%;

    .PrivateListingBanner--identity-sentence {
      margin-right: 4px;

      .PrivateListingBanner--account-link {
        margin-left: 4px;
        padding: 6px 0;
        vertical-align: bottom;
      }
    }
  }

  /* 
  // Left here for reference to address the TODO comments above from dan

  .item--banner-content {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    font-size: 16px;
    justify-content: center;

    .item--banner-identity-sentence {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-right: 4px;

      .item--banner-account-link {
        margin-left: 4px;
        padding: 6px 0;

        .item--banner-account-image {
          border: 2px solid white;
          border-radius: 12px;
          margin: 0 4px;
          width: 24px;
        }

        .item--banner-account-text {
          color: white;
        }

        &:hover {
          .item--banner-account-image {
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.6);
          }

          .item--banner-account-text {
            text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.6);
          }
        }
      }
    }

    .item--banner--help-icon {
      cursor: pointer;
      margin: 6px 0 0 4px;
      opacity: 0.75;
    }
  } 
  
  .item--banner-hoverable {
    cursor: pointer;

    &:hover {
      background: {HUES.offShore};
    }
  }
  */
`
