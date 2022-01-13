import React from "react"
import styled from "styled-components"
import { CHAIN_IDENTIFIERS_TO_NAMES } from "../../constants"
import Tooltip from "../../design-system/Tooltip"
import { ChainInfo_data } from "../../lib/graphql/__generated__/ChainInfo_data.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { truncateAddress } from "../../lib/helpers/addresses"
import { fromISO8601 } from "../../lib/helpers/datetime"
import { truncateText } from "../../lib/helpers/stringUtils"
import { $bp_small } from "../../styles/variables"
import ExternalLink from "../common/ExternalLink.react"
import Link from "../common/Link.react"
import TextCopier from "../common/TextCopier.react"

interface Props {
  data: ChainInfo_data
  className?: string
}

const ChainInfo = ({
  data: {
    assetContract: { address, chain, openseaVersion, blockExplorerLink },
    isEditableByOwner,
    isFrozen,
    frozenAt,
    tokenId,
    tokenMetadata,
  },
  className,
}: Props) => {
  const metadataStatus = isFrozen
    ? "frozen"
    : isEditableByOwner.value
    ? "editable"
    : "centralized"
  const metadataInfo = {
    frozen: {
      tooltipContent: (
        <>
          This item's metadata was permanently locked and stored in
          decentralized file storage{" "}
          {frozenAt
            ? `on ${fromISO8601(frozenAt).local().format("LL [at] h:mm a")}`
            : null}
        </>
      ),
      label: <Link href={tokenMetadata ?? ""}>Frozen</Link>,
    },
    editable: {
      tooltipContent: <>This item's metadata may be changed by its creator</>,
      label: <>Editable</>,
    },
    centralized: {
      tooltipContent: (
        <>
          This item’s metadata is being hosted on server, but is not editable by
          the creator
        </>
      ),
      label: <>Centralized</>,
    },
  }[metadataStatus]

  return (
    <DivContainer className={className}>
      <div className="ChainInfo--label">
        <div className="ChainInfo--label-type">Contract Address</div>
        <div className="ChainInfo--label-value">
          <ExternalLink target="_blank" url={blockExplorerLink}>
            {truncateAddress(address)}
          </ExternalLink>
        </div>
      </div>
      <div className="ChainInfo--label">
        <div className="ChainInfo--label-type">Token ID</div>
        <div className="ChainInfo--label-value">
          <TextCopier placement="right" text={tokenId}>
            {truncateText(tokenId, 16)}
          </TextCopier>
        </div>
      </div>
      <div className="ChainInfo--label">
        <div className="ChainInfo--label-type">Blockchain</div>
        <div className="ChainInfo--label-value">
          {CHAIN_IDENTIFIERS_TO_NAMES[chain]}
        </div>
      </div>
      {(openseaVersion || isFrozen) && (
        <div className="ChainInfo--label">
          <div className="ChainInfo--label-type">Metadata</div>
          <div className="ChainInfo--label-value">
            <Tooltip content={metadataInfo.tooltipContent} placement="right">
              <span>{metadataInfo.label}</span>
            </Tooltip>
          </div>
        </div>
      )}
    </DivContainer>
  )
}

export default fragmentize(ChainInfo, {
  fragments: {
    data: graphql`
      fragment ChainInfo_data on AssetType {
        assetContract {
          openseaVersion
          address
          chain
          blockExplorerLink
        }
        isEditableByOwner {
          value
        }
        tokenId
        isFrozen
        frozenAt
        tokenMetadata
      }
    `,
  },
})

const DivContainer = styled.div`
  .ChainInfo--label {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    .ChainInfo--label-value {
      color: ${props => props.theme.colors.text.subtle};
      max-width: 365px;
      @media (max-width: ${$bp_small}) {
        max-width: 200px;
      }
    }
  }
`
