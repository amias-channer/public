import React, { useState } from "react"
import { RecordProxy } from "relay-runtime"
import styled from "styled-components"
import Drawer from "../../../design-system/Drawer"
import Dropdown from "../../../design-system/Dropdown"
import Flex from "../../../design-system/Flex"
import Loader from "../../../design-system/Loader/Loader.react"
import { Breakpoint, Media } from "../../../design-system/Media"
import Text from "../../../design-system/Text"
import UnstyledButton from "../../../design-system/UnstyledButton"
import useAppContext from "../../../hooks/useAppContext"
import useToasts from "../../../hooks/useToasts"
import { useTranslations } from "../../../hooks/useTranslations"
import {
  trackLogout,
  trackRefreshFunds,
} from "../../../lib/analytics/events/appEvents"
import { WalletSidebarHeaderRefreshFundsMutation } from "../../../lib/graphql/__generated__/WalletSidebarHeaderRefreshFundsMutation.graphql"
import { graphql } from "../../../lib/graphql/graphql"
import CopyAddress from "../../common/CopyAddress.react"
import Icon from "../../common/Icon.react"
import Image from "../../common/Image.react"
import VerticalAligned from "../../common/VerticalAligned.react"

type Props = {
  fullscreenBreakpoint: Breakpoint
  close: () => unknown
}

export const WalletSidebarHeader = ({ fullscreenBreakpoint, close }: Props) => {
  const { tr } = useTranslations()
  const { attempt, showSuccessMessage } = useToasts()
  const { wallet, logout, mutate } = useAppContext()
  const address = wallet.activeAccount?.address
  const username = wallet.activeAccount?.user?.publicUsername
  const imageUrl = wallet.activeAccount?.imageUrl
  const [isRefresingFunds, setIsRefreshingFunds] = useState(false)

  const refreshFunds = async (onDone: () => unknown) => {
    setIsRefreshingFunds(true)
    trackRefreshFunds()

    try {
      await attempt(async () => {
        await mutate<WalletSidebarHeaderRefreshFundsMutation>(
          graphql`
            mutation WalletSidebarHeaderRefreshFundsMutation {
              wallet {
                refreshFunds {
                  symbol
                  chain
                  quantity
                }
              }
            }
          `,
          {},
          {
            shouldAuthenticate: true,
            updater: (store, data) => {
              const accountWallet = store
                .getRoot()
                .getOrCreateLinkedRecord("wallet", "WalletType", { address })!

              const accountFunds = accountWallet.getLinkedRecords("funds") ?? []
              const fundsRecordLookup = accountFunds.reduce((acc, record) => {
                const key = `${record.getValue("symbol")}-${record.getValue(
                  "chain",
                )}`
                return { ...acc, [key]: record }
              }, {} as Record<string, RecordProxy | undefined>)

              data.wallet.refreshFunds.forEach(
                ({ chain, symbol, quantity }) => {
                  const key = `${symbol}-${chain}`
                  const fundRecord = fundsRecordLookup[key]
                  if (fundRecord) {
                    fundRecord.setValue(quantity, "quantity")
                  }
                },
              )
            },
          },
        )
        showSuccessMessage("Funds successfully refreshed")
      })
    } finally {
      setIsRefreshingFunds(false)
      onDone()
    }
  }

  const textContent = (
    <Flex>
      <VerticalAligned marginRight="8px">
        {imageUrl ? (
          <Image
            className="WalletSidebar--account-image"
            size={30}
            sizing="cover"
            url={imageUrl}
          />
        ) : (
          <Icon size={30} value="account_circle" />
        )}
      </VerticalAligned>
      <VerticalAligned>
        <Text
          as="span"
          className="WalletSidebar--user-title"
          maxWidth="160px"
          variant="bold"
        >
          {username || tr("My wallet")}
        </Text>
      </VerticalAligned>
    </Flex>
  )

  return (
    <StyledHeader>
      <Drawer.Title display="flex">
        <Media lessThan={fullscreenBreakpoint}>
          {(mediaClassNames, renderChildren) =>
            renderChildren && (
              <VerticalAligned className={mediaClassNames} mr="8px">
                <UnstyledButton>
                  <Icon
                    color="gray"
                    title="Back"
                    value="chevron_left"
                    onClick={close}
                  />
                </UnstyledButton>
              </VerticalAligned>
            )
          }
        </Media>

        {address ? (
          <Dropdown
            content={({ List, Item, close }) => (
              <List>
                <Item
                  onClick={() => {
                    trackLogout()
                    logout()
                    close()
                  }}
                >
                  <Item.Avatar icon="logout" />
                  <Item.Content>
                    <Item.Title>{tr("Log out")}</Item.Title>
                  </Item.Content>
                </Item>

                <Item
                  disabled={isRefresingFunds}
                  onClick={() => refreshFunds(close)}
                >
                  <Item.Avatar icon="sync" />
                  <Item.Content>
                    <Item.Title>{tr("Refresh funds")}</Item.Title>
                  </Item.Content>

                  {isRefresingFunds && (
                    <Item.Side>
                      <Loader size="small" />
                    </Item.Side>
                  )}
                </Item>
              </List>
            )}
          >
            <UnstyledButton>
              <VerticalAligned>{textContent}</VerticalAligned>
              {address && (
                <VerticalAligned padding="4px">
                  <Icon color="gray" title="Back" value="keyboard_arrow_down" />
                </VerticalAligned>
              )}
            </UnstyledButton>
          </Dropdown>
        ) : (
          textContent
        )}
      </Drawer.Title>

      {address && (
        <Drawer.Subtitle className="WalletSidebar--subtitle">
          <CopyAddress address={address} />
        </Drawer.Subtitle>
      )}
    </StyledHeader>
  )
}

const StyledHeader = styled(Drawer.Header)`
  .WalletSidebar--account-image {
    border-radius: ${props => props.theme.borderRadius.circle};
    border: 2px solid ${props => props.theme.colors.border};
  }

  .WalletSidebar--user-title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .WalletSidebar--subtitle > *:hover {
    color: ${props => props.theme.colors.darkGray};
  }
`
