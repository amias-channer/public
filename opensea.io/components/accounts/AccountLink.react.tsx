import React from "react"
import { useFragment } from "react-relay"
import styled from "styled-components"
import Tooltip from "../../design-system/Tooltip"
import useAppContext from "../../hooks/useAppContext"
import { useTranslations } from "../../hooks/useTranslations"
import Tr from "../../i18n/Tr.react"
import TrFragment from "../../i18n/TrFragment.react"
import TrVar from "../../i18n/TrVar.react"
import { AccountLink_data$key } from "../../lib/graphql/__generated__/AccountLink_data.graphql"
import { graphql } from "../../lib/graphql/graphql"
import { getAccountLink } from "../../lib/helpers/accounts"
import { formatAddress } from "../../lib/helpers/addresses"
import { BigNumber, quantityDisplay } from "../../lib/helpers/numberUtils"
import { truncateText } from "../../lib/helpers/stringUtils"
import { selectClassNames } from "../../lib/helpers/styling"
import { ExternalLinkProps } from "../common/ExternalLink.react"
import Link from "../common/Link.react"
import ProfileImage from "../common/ProfileImage.react"

interface Props {
  className?: string
  dataKey: AccountLink_data$key
  isCreator?: boolean
  isOwner?: boolean
  mode?: "light"
  variant?: "only-image" | "no-image" | "both"
  ownedQuantity?: BigNumber
  target?: ExternalLinkProps["target"]
  iconSize?: number
  handleOverflow?: boolean
}

const MAX_USERNAME_LEN = 21

const AccountLink = ({
  className,
  dataKey,
  isCreator,
  isOwner,
  mode,
  variant = "both",
  ownedQuantity,
  target,
  iconSize = 22,
  handleOverflow = true,
}: Props) => {
  const { wallet } = useAppContext()
  const { tr } = useTranslations()

  const data = useFragment(
    graphql`
      fragment AccountLink_data on AccountType {
        address
        user {
          publicUsername
        }
        ...ProfileImage_data
        ...wallet_accountKey
        ...accounts_url
      }
    `,
    dataKey,
  )

  const { address, user } = data
  const truncatedPublicUsername = user?.publicUsername
    ? truncateText(user?.publicUsername, MAX_USERNAME_LEN)
    : undefined

  const displayText = wallet.isActiveAccount(data)
    ? tr("you")
    : truncatedPublicUsername || formatAddress(address)

  return (
    <DivContainer
      className={selectClassNames(
        "AccountLink",
        {
          "light-container": mode === "light",
          "ellipsis-overflow": variant !== "both" && handleOverflow,
          "variant-both": variant === "both",
        },
        className,
      )}
      data-testid="AccountLink"
    >
      {variant !== "no-image" && (
        <Link
          href={getAccountLink(data)}
          target={target}
          onClick={e => e.stopPropagation()}
        >
          {data ? (
            <Tooltip content={displayText}>
              <span>
                <ProfileImage
                  className={selectClassNames("AccountLink", {
                    image: !mode,
                    "light-image": mode === "light",
                  })}
                  dataKey={data}
                  size={iconSize}
                />
              </span>
            </Tooltip>
          ) : null}
        </Link>
      )}
      <Tr>
        {isCreator ? (
          <>Created by&nbsp;</>
        ) : isOwner ? (
          ownedQuantity ? (
            <TrFragment>
              <TrVar example="42">
                {truncateText(quantityDisplay(ownedQuantity), 19)}
              </TrVar>
              &nbsp;owned by&nbsp;
            </TrFragment>
          ) : (
            <>Owned by&nbsp;</>
          )
        ) : (
          ""
        )}
        <TrVar example="Alice">
          {variant !== "only-image" && (
            <Link
              className={selectClassNames("AccountLink", {
                "light-text": mode === "light",
                "ellipsis-overflow": handleOverflow,
                "ellipsis-variant-both": handleOverflow && variant === "both",
              })}
              href={getAccountLink(data)}
              target={target}
              onClick={e => {
                e.stopPropagation()
              }}
            >
              <span>{displayText}</span>
            </Link>
          )}
        </TrVar>
      </Tr>
    </DivContainer>
  )
}

export default AccountLink

const DivContainer = styled.div`
  display: inline;
  align-items: center;
  height: 24px;
  width: 100%;

  &.AccountLink--variant-both {
    display: inline-flex;
  }

  .AccountLink--ellipsis-variant-both {
    display: inline-block;
  }

  .AccountLink--ellipsis-overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .AccountLink--image {
    cursor: pointer;
    margin-right: 8px;
  }

  &.AccountLink--light-container {
    .AccountLink--light-image {
      border: 2px solid white;
      border-radius: 50%;
      margin: 0 4px;
    }

    .AccountLink--light-text {
      color: white;
    }

    &:hover {
      .AccountLink--light-image {
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.6);
      }

      .AccountLink--light-text {
        text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.6);
      }
    }
  }
`
