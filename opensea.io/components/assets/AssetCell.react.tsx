import React from "react"
import styled, { css } from "styled-components"
import { AssetCell_asset } from "../../lib/graphql/__generated__/AssetCell_asset.graphql"
import { AssetCell_assetBundle } from "../../lib/graphql/__generated__/AssetCell_assetBundle.graphql"
import { fragmentize, getNodes, graphql } from "../../lib/graphql/graphql"
import { getAssetUrl } from "../../lib/helpers/asset"
import Link from "../common/Link.react"
import { sizeMQ } from "../common/MediaQuery.react"
import AssetMedia from "./AssetMedia.react"

interface Props {
  asset: AssetCell_asset | null
  assetBundle: AssetCell_assetBundle | null
}

const AssetCell = ({ asset, assetBundle }: Props) => {
  const assetQuantities = getNodes(assetBundle?.assetQuantities)
  const bundleHasMultipleAssets = assetBundle && assetQuantities.length > 1
  const singleAsset = asset || assetQuantities[0]?.asset

  return (
    <DivContainer>
      <Link
        className="AssetCell--link"
        href={
          bundleHasMultipleAssets
            ? `/bundles/${assetBundle?.slug}`
            : singleAsset
            ? getAssetUrl(singleAsset)
            : ""
        }
      >
        <div className="AssetCell--container">
          {bundleHasMultipleAssets ? (
            <div className="AssetCell--img">
              {assetQuantities.map(assetQuantity => (
                <AssetMedia
                  asset={assetQuantity.asset}
                  className="AssetCell--img-small"
                  key={assetQuantity.relayId}
                />
              ))}
            </div>
          ) : singleAsset ? (
            <AssetMedia
              asset={singleAsset}
              className="AssetCell--img"
              size={48}
            />
          ) : null}

          <span className="AssetCell--name">
            {assetBundle?.name ||
              singleAsset?.name ||
              singleAsset?.collection?.name}
          </span>
        </div>
      </Link>
    </DivContainer>
  )
}

export default fragmentize(AssetCell, {
  fragments: {
    asset: graphql`
      fragment AssetCell_asset on AssetType {
        collection {
          name
        }
        name
        ...AssetMedia_asset
        ...asset_url
      }
    `,
    assetBundle: graphql`
      fragment AssetCell_assetBundle on AssetBundleType {
        assetQuantities(first: 2) {
          edges {
            node {
              asset {
                collection {
                  name
                }
                name
                ...AssetMedia_asset
                ...asset_url
              }
              relayId
            }
          }
        }
        name
        slug
      }
    `,
  },
})

const DivContainer = styled.div`
  .AssetCell--container {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .AssetCell--img {
    border-radius: 4px;
    border: 1px solid ${props => props.theme.colors.border};
    display: flex;
    justify-content: center;
    flex: 0 0 auto;
    height: 48px;
    width: 48px;
  }

  .AssetCell--img-small {
    width: 50%;
  }

  .AssetCell--name {
    display: none;
  }

  .AssetCell--link {
    display: block;
    color: ${props => props.theme.colors.text.on.background};
  }

  ${sizeMQ({
    small: css`
      .AssetCell--name {
        display: inline;
        margin-left: 16px;
        text-align: left;
      }
    `,
  })}
`
