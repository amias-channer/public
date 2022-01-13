import React, { useMemo, useState } from "react"
import { useInterval } from "react-use"
import styled, { css } from "styled-components"
import { useWallet } from "../../../containers/WalletProvider.react"
import Block from "../../../design-system/Block"
import Flex from "../../../design-system/Flex"
import List from "../../../design-system/List/List.react"
import Skeleton from "../../../design-system/Skeleton"
import Text from "../../../design-system/Text"
import { useTranslations } from "../../../hooks/useTranslations"
import { WalletFundsQuery } from "../../../lib/graphql/__generated__/WalletFundsQuery.graphql"
import {
  graphql,
  GraphQLProps,
  refetchify,
  RefetchProps,
} from "../../../lib/graphql/graphql"
import { withData } from "../../../lib/graphql/GraphQLRenderer"
import { displayUSD } from "../../../lib/helpers/numberUtils"
import ActionButton from "../../common/ActionButton.react"
import AddFundsModalV2 from "../../trade/AddFundsModalV2.react"
import { FundListItem } from "./FundListItem.react"
import { calculateFundsBalance, orderWalletFunds } from "./utils"

const REFETCH_INTERVAL = 30 * 1000 // every 30 seconds
const EMPTYLIST = [] as const

type Props = GraphQLProps<WalletFundsQuery> & RefetchProps<WalletFundsQuery>

export const WalletFunds = ({ data, refetch, variables }: Props) => {
  const [showAllOptions, setShowAllOptions] = useState(false)
  const funds = data?.wallet.funds ?? EMPTYLIST
  const isLoading = data?.wallet.funds === undefined
  const showViewAllTokensButton = funds.length > 3
  const totalBalance = useMemo(() => calculateFundsBalance(funds), [funds])
  const orderedFunds = useMemo(() => orderWalletFunds(funds), [funds])
  const { chain: activeChain } = useWallet()
  const { tr } = useTranslations()

  useInterval(() => refetch(variables, { force: true }), REFETCH_INTERVAL)

  const renderFundsList = () => {
    if (!isLoading && funds.length === 0) {
      return null
    }

    return (
      <List className="WalletFunds--list">
        {isLoading ? (
          <>
            <FundListItem.Skeleton />
            <FundListItem.Skeleton />
            <FundListItem.Skeleton />
          </>
        ) : (
          (showAllOptions ? orderedFunds : orderedFunds.slice(0, 3)).map(
            ({
              symbol,
              name,
              usdPrice,
              quantity,
              image,
              chain,
              supportedSwaps,
            }) => {
              return (
                <FundListItem
                  chain={chain}
                  image={image ?? undefined}
                  key={`${symbol}-${chain}`}
                  name={name ?? undefined}
                  quantity={quantity}
                  refetch={() => refetch(variables, { force: true })}
                  supportedSwaps={supportedSwaps}
                  symbol={symbol}
                  usdPrice={usdPrice ?? undefined}
                />
              )
            },
          )
        )}
      </List>
    )
  }

  return (
    <DivContainer $showViewAllTokensButton={showViewAllTokensButton}>
      <Block>
        <Flex className="WalletFunds--balance" justifyContent="center">
          <Block>
            <Text marginBottom="6px" textAlign="center" variant="small">
              {tr("Total balance")}
            </Text>
            <Text marginTop={0} textAlign="center" variant="h4">
              {isLoading ? (
                <Skeleton.Line height="24px" variant="full" />
              ) : (
                `$${displayUSD(totalBalance)} USD`
              )}
            </Text>
          </Block>
        </Flex>

        <AddFundsModalV2
          trigger={open => (
            <ActionButton className="WalletFunds--add-funds" onClick={open}>
              {tr("Add Funds")}
            </ActionButton>
          )}
          variables={
            activeChain === "KLAYTN" || activeChain === "BAOBAB"
              ? { chain: activeChain, symbol: "KLAY" }
              : { symbol: "ETH" }
          }
        />
      </Block>

      <Block marginTop={24}>{renderFundsList()}</Block>

      {showViewAllTokensButton && (
        <ActionButton
          className="WalletFunds--show-more"
          type="tertiary"
          onClick={() => setShowAllOptions(prev => !prev)}
        >
          {showAllOptions ? "Show Fewer Tokens" : "View All Available Tokens"}
        </ActionButton>
      )}
    </DivContainer>
  )
}

const DivContainer = styled.div<{ $showViewAllTokensButton: boolean }>`
  ${props =>
    props.$showViewAllTokensButton &&
    css`
      .WalletFunds--list {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: none;
      }
    `}

  .WalletFunds--show-more {
    width: 100%;
    border-radius: 0;
    border-bottom-left-radius: ${props => props.theme.borderRadius.default};
    border-bottom-right-radius: ${props => props.theme.borderRadius.default};
  }

  .WalletFunds--balance {
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.default};
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .WalletFunds--add-funds {
    width: 100%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`

const query = graphql`
  query WalletFundsQuery($address: AddressScalar!) {
    wallet(address: $address) {
      funds {
        name
        symbol
        image
        quantity
        usdPrice
        chain
        supportedSwaps {
          symbol
          chain {
            identifier
          }
        }
      }
    }
  }
`

export default withData<WalletFundsQuery>(
  refetchify<WalletFundsQuery, GraphQLProps<WalletFundsQuery>>(WalletFunds, {
    query,
  }),
  query,
)
