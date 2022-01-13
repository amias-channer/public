import React, { useState, useMemo, useCallback } from "react"
import { noop, orderBy } from "lodash"
import { useRouter } from "next/router"
import styled from "styled-components"
import {
  WALLET_NAME,
  getWalletConfiguration,
  ALL_WALLETS,
  WalletSupport,
  WalletConfiguration,
} from "../../../constants"
import Block from "../../../design-system/Block"
import List, { ListItem } from "../../../design-system/List"
import Loader from "../../../design-system/Loader/Loader.react"
import Text from "../../../design-system/Text"
import Tooltip from "../../../design-system/Tooltip"
import UnstyledButton from "../../../design-system/UnstyledButton"
import useAppContext from "../../../hooks/useAppContext"
import useToasts from "../../../hooks/useToasts"
import { trackSelectWallet } from "../../../lib/analytics/events/walletEvents"
import chain from "../../../lib/chain/chain"
import { getMobileWalletLink } from "../../../lib/helpers/wallet"
import { $nav_height } from "../../../styles/variables"
import ActionButton from "../../common/ActionButton.react"
import Icon from "../../common/Icon.react"
import Link from "../../common/Link.react"
import VerticalAligned from "../../common/VerticalAligned.react"
import FeatureFlag from "../../featureFlag/FeatureFlag.react"

const FEW_WALLETS_DISPLAY_COUNT = 4

type WalletItemAction =
  | { href: string }
  | Pick<JSX.IntrinsicElements["i"], "onClick" | "onKeyPress">

export const ConnectCompatibleWallet = () => {
  const { query } = useRouter()
  const { wallet, isMobile } = useAppContext()
  const [showAllOptions, setShowAllOptions] = useState(false)
  const [installingWallet, setInstallingWallet] = useState<string>()
  const { attempt } = useToasts()

  const isWalletSupported = useCallback(
    ({ supports }: WalletConfiguration) => {
      return (
        supports === WalletSupport.BOTH ||
        supports === (isMobile ? WalletSupport.MOBILE : WalletSupport.DESKTOP)
      )
    },
    [isMobile],
  )

  const trackWalletSelected = (walletName: WALLET_NAME) => {
    trackSelectWallet({ walletName, source: "wallet sidebar" })
  }

  const installWallet = async (walletName: WALLET_NAME) => {
    if (installingWallet) {
      return
    }

    trackWalletSelected(walletName)
    setInstallingWallet(walletName)
    try {
      await attempt(() => wallet.install(walletName))
    } finally {
      setInstallingWallet(undefined)
    }
  }

  const getWalletAction = (
    walletName: WALLET_NAME,
    { installLink }: WalletConfiguration,
  ): WalletItemAction => {
    const isProviderInstalled = chain.isProviderInstalled(walletName)

    if (isProviderInstalled) {
      return { onClick: () => installWallet(walletName) }
    } else if (isMobile) {
      const mobileLink = getMobileWalletLink(walletName, query)
      if (mobileLink) {
        return {
          href: mobileLink,
          onClick: () => trackWalletSelected(walletName),
        }
      }
    } else if (installLink) {
      return {
        href: installLink,
        onClick: () => trackWalletSelected(walletName),
      }
    }

    return { onClick: () => installWallet(walletName) }
  }

  const shownWallets = useMemo(() => {
    const byPlatform = orderBy(
      ALL_WALLETS,
      walletName => isWalletSupported(getWalletConfiguration(walletName)),
      ["desc"],
    )

    return byPlatform.slice(
      0,
      showAllOptions ? undefined : FEW_WALLETS_DISPLAY_COUNT,
    )
  }, [isWalletSupported, showAllOptions])

  const renderWallet = (walletName: WALLET_NAME) => {
    const configuration = getWalletConfiguration(walletName)
    const supportedOnPlatform = isWalletSupported(configuration)

    const listItem = (
      <ListItem
        disabled={Boolean(installingWallet) || !supportedOnPlatform}
        key={walletName}
        {...(supportedOnPlatform
          ? getWalletAction(walletName, configuration)
          : { onClick: noop })}
      >
        <ListItem.Avatar height="30px" src={configuration.alternativeLogo} />
        <ListItem.Content>
          <ListItem.Title fontWeight={700}>{walletName}</ListItem.Title>
        </ListItem.Content>
        {!supportedOnPlatform && (
          <ListItem.Side>
            <ListItem.Description>
              {isMobile ? "desktop" : "mobile"} only
            </ListItem.Description>
          </ListItem.Side>
        )}

        {walletName === installingWallet && (
          <ListItem.Side>
            <Loader size="small" />
          </ListItem.Side>
        )}
      </ListItem>
    )

    if (configuration.featureFlags && configuration.featureFlags.length > 0) {
      return (
        <FeatureFlag flags={configuration.featureFlags}>{listItem}</FeatureFlag>
      )
    }

    return listItem
  }

  return (
    <DivContainer>
      <Block>
        <Text margin={0}>
          Connect with one of our available{" "}
          <Tooltip
            content={
              <>
                A crypto wallet is an application or hardware device that allows
                individuals to store and retrieve digital assets.{" "}
                <Link href="https://openseahelp.zendesk.com/hc/en-us/articles/1500007978402-Wallets-supported-by-OpenSea">
                  Learn more
                </Link>
              </>
            }
            interactive
            placement="bottom-end"
          >
            <UnstyledButton>
              <Text
                as="span"
                className="ConnectCompatibleWallet--wallet-info"
                color="primary"
                display="inline-flex"
              >
                <span>wallet</span>
                <VerticalAligned ml="4px">
                  <Icon size={20} value="info" variant="outlined" />
                </VerticalAligned>
              </Text>
            </UnstyledButton>
          </Tooltip>{" "}
          providers or create a new one.
        </Text>
      </Block>

      <Block marginBottom={$nav_height} marginTop="24px">
        <List className="ConnectCompatibleWallet--wallet-list">
          {shownWallets.map(renderWallet)}
        </List>

        <ActionButton
          className="ConnectCompatibleWallet--show-more"
          type="tertiary"
          onClick={() => setShowAllOptions(prev => !prev)}
        >
          {showAllOptions ? "Show fewer options" : "Show more options"}
        </ActionButton>
      </Block>
    </DivContainer>
  )
}

export default ConnectCompatibleWallet

const DivContainer = styled(Block)`
  .ConnectCompatibleWallet--wallet-list {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
  }

  .ConnectCompatibleWallet--wallet-info {
    font-weight: 600;

    :hover {
      color: ${props => props.theme.colors.darkSeaBlue};
    }
  }

  .ConnectCompatibleWallet--show-more {
    width: 100%;
    border-radius: 0;
    border-bottom-left-radius: ${props => props.theme.borderRadius.default};
    border-bottom-right-radius: ${props => props.theme.borderRadius.default};
  }
`
