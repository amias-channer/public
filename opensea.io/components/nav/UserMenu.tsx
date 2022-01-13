import React from "react"
import styled, { css } from "styled-components"
import AppComponent from "../../AppComponent.react"
import UnstyledButton from "../../design-system/UnstyledButton"
import { IdentityKey } from "../../lib/auth/types"
import { addressesEqual, truncateAddress } from "../../lib/helpers/addresses"
import Router from "../../lib/helpers/router"
import { selectClassNames } from "../../lib/helpers/styling"
import QP from "../../lib/qp/qp"
import { themeVariant } from "../../styles/styleUtils"
import { $nav_height } from "../../styles/variables"
import Icon, { MaterialIcon } from "../common/Icon.react"
import Image from "../common/Image.react"
import { sizeMQ } from "../common/MediaQuery.react"
import { FrameProvider } from "../layout/Frame.react"
import Panel from "../layout/Panel.react"

export type Tab =
  | { type: "account"; key: IdentityKey }
  | { type: "general" }
  | { type: "notifications" }
  | { type: "appearance" }

const tabTypeParam = QP.makeEnumParam<Tab["type"]>({
  account: undefined,
  general: undefined,
  notifications: undefined,
  appearance: undefined,
})

type Props = {
  className?: string
}

export default class UserMenu extends AppComponent<Props> {
  static getTab(): Tab | undefined {
    if (Router.getRouteName() !== "userSettings") {
      return undefined
    }
    const { address, tab } = QP.parse({
      address: QP.Optional(QP.Address),
      tab: QP.Optional(tabTypeParam, "general"),
    })
    if (tab === "account") {
      if (address) {
        return { type: tab, key: { address } }
      }

      throw new QP.ParamError("`address` required for tab `'account'`.")
    }
    return { type: tab }
  }

  renderTab = ({
    icon,
    isActive,
    onClick,
    text,
  }: {
    icon: MaterialIcon
    isActive?: boolean
    onClick: () => unknown
    text: string
  }): React.ReactElement => (
    <UnstyledButton
      className={selectClassNames("UserMenu", {
        item: true,
        "item-active": isActive,
        tab: true,
      })}
      onClick={onClick}
    >
      <Icon className="UserMenu--tab-icon" value={icon} />
      {text}
    </UnstyledButton>
  )

  render() {
    const { className } = this.props
    const { wallet } = this.context
    const tab = UserMenu.getTab()
    const UserSettingsTab = this.renderTab

    return (
      <DivContainer className={className}>
        <FrameProvider className="UserMenu--tabs">
          <Panel
            className="UserMenu--accounts"
            headerClassName="UserMenu--accounts-header"
            icon="account_balance_wallet"
            isContentPadded={false}
            key={wallet.accounts.length}
            mode="always-open"
            title="My wallet"
          >
            {wallet.activeAccount ? (
              <div
                className={selectClassNames("UserMenu", {
                  item: true,
                  "item-active":
                    tab?.type === "account" &&
                    addressesEqual(
                      wallet.activeAccount.address,
                      tab.key.address,
                    ),
                  account: true,
                })}
                key={wallet.activeAccount.relayId}
                onClick={() =>
                  wallet.activeAccount &&
                  Router.pushShallow(
                    `/account/settings${Router.stringifyQueryParams({
                      tab: "account",
                      address: wallet.activeAccount.address,
                    })}`,
                  )
                }
              >
                <Image
                  size={32}
                  sizing="cover"
                  url={wallet.activeAccount.imageUrl}
                  variant="round"
                />
                <div className="UserMenu--account-address">
                  {truncateAddress(wallet.activeAccount.address)}
                </div>
              </div>
            ) : null}
          </Panel>
          <UserSettingsTab
            icon="settings"
            isActive={tab?.type === "general"}
            text="General"
            onClick={() => Router.pushShallow("/account/settings")}
          />
          <UserSettingsTab
            icon="notifications"
            isActive={tab?.type === "notifications"}
            text="Notification Settings"
            onClick={() =>
              Router.pushShallow("/account/settings", { tab: "notifications" })
            }
          />
          <UserSettingsTab
            icon="color_lens"
            isActive={tab?.type === "appearance"}
            text="Appearance"
            onClick={() =>
              Router.pushShallow("/account/settings", { tab: "appearance" })
            }
          />
        </FrameProvider>
      </DivContainer>
    )
  }
}

const DivContainer = styled.div`
  color: ${props => props.theme.colors.withOpacity.text.body.heavy};

  .UserMenu--item {
    width: 100%;
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    display: flex;

    &:hover {
      color: ${props => props.theme.colors.text.heading};
      cursor: pointer;
    }

    &.UserMenu--item-active {
      color: ${props => props.theme.colors.text.heading};
      pointer-events: none;

      ${props =>
        themeVariant({
          variants: {
            light: {
              backgroundColor:
                props.theme.colors.withOpacity.tertiary.veryLight,
            },
            dark: { backgroundColor: props.theme.colors.header },
          },
        })}
    }
  }

  .UserMenu--accounts {
    margin-bottom: 1px;

    .UserMenu--accounts-header {
      color: ${props => props.theme.colors.withOpacity.text.body.heavy};
      background-color: ${props => props.theme.colors.background};
    }
  }

  .UserMenu--account {
    color: ${props => props.theme.colors.withOpacity.text.body.heavy};
    padding: 20px;

    &:last-child {
      border-bottom: none;
    }

    .UserMenu--account-address {
      font-weight: 600;
      margin-left: 8px;
    }
  }

  .UserMenu--tabs {
    position: sticky;
    top: ${$nav_height};
  }

  .UserMenu--tab {
    font-size: 16px;
    font-weight: 600;
    padding: 20px 12px;

    .UserMenu--tab-icon {
      margin-right: 10px;
    }
  }

  ${sizeMQ({
    navbar: css`
      align-self: flex-start;
      flex-shrink: 0;
      height: calc(100vh - ${$nav_height});
      position: sticky;
      top: 64px;
      width: 380px;
    `,
  })}
`
