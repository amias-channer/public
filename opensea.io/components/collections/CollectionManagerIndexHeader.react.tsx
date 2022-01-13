import React from "react"
import styled, { css } from "styled-components"
import { COLLECTION_MANAGER_POST_URL } from "../../constants"
import Block from "../../design-system/Block"
import Button from "../../design-system/Button/Button.react"
import Dropdown from "../../design-system/Dropdown/Dropdown.react"
import Tooltip from "../../design-system/Tooltip"
import { trackClickCreateCollection } from "../../lib/analytics/events/collectionEvents"
import Icon, { MaterialIcon } from "../common/Icon.react"
import Link from "../common/Link.react"
import { sizeMQ } from "../common/MediaQuery.react"

type BaseOptionProps = {
  label: string
  href: string
}

type OptionWithIconProps = BaseOptionProps & {
  icon: MaterialIcon
  logo?: undefined
}

type OptionWithLogoProps = BaseOptionProps & {
  logo: string
  icon?: undefined
}

type MintOptionProps = OptionWithIconProps | OptionWithLogoProps

interface Props {
  onClickCreate: () => void
}

const MINT_OPTIONS: Array<MintOptionProps> = [
  {
    label: "Import an existing smart contract",
    icon: "code",
    href: "/get-listed",
  },
  {
    label: "Mint on Rarible",
    logo: "/static/images/logos/rarible-icon.svg",
    href: "https://app.rarible.com/create",
  },
  {
    label: "Mint on Mintbase",
    logo: "/static/images/logos/mintbase-icon.svg",
    href: "https://mintbase.io",
  },
  {
    label: "Mint on Cargo",
    logo: "/static/images/logos/cargo-icon.svg",
    href: "https://app.cargo.build/",
  },
  {
    label: "Mint on Mintable",
    logo: "/static/images/logos/mintable-icon.svg",
    href: "https://mintable.app",
  },
  {
    label: "Mint on Zora",
    logo: "/static/images/logos/zora-icon.svg",
    href: "https://zora.co",
  },
]

const CollectionManagerIndexHeader = ({ onClickCreate }: Props) => {
  const handleCreateClick = () => {
    trackClickCreateCollection()
    onClickCreate()
  }
  return (
    <InfoContainer>
      <div className="collectionManagerIndexHeader--info">
        Create, curate, and manage collections of unique NFTs to share and sell.
        <Tooltip
          content={
            <div>
              Collections can be created either directly on OpenSea or imported
              from an existing smart contract. You can also mint on other
              services like Rarible or Mintable and import the items to OpenSea.{" "}
              <Link href={COLLECTION_MANAGER_POST_URL}>Learn more</Link>
            </div>
          }
          interactive
        >
          <div className="collectionManagerIndexHeader--info-icon">
            <Icon
              color="gray"
              cursor="pointer"
              size={24}
              value="info"
              variant="outlined"
            />
          </div>
        </Tooltip>
      </div>
      <div className="collectionManagerIndexHeader--buttons">
        <Block marginRight="16px">
          <Button onClick={handleCreateClick}>Create a collection</Button>
        </Block>
        <Dropdown
          items={MINT_OPTIONS}
          renderItem={({ close, item, Item }) => {
            const avatarProps = item.icon
              ? { icon: item.icon }
              : { src: item.logo }

            return (
              <Item
                eventSource="collection_manager_dropdown"
                href={item.href}
                key={item.label}
                onClick={close}
              >
                <Item.Avatar {...avatarProps} outline={2} size={22} />
                <Item.Content>
                  <Item.Title>{item.label}</Item.Title>
                </Item.Content>
              </Item>
            )
          }}
        >
          <Button
            aria-label="More options"
            icon="more_vert"
            padding="12px"
            variant="tertiary"
          />
        </Dropdown>
      </div>
    </InfoContainer>
  )
}

const InfoContainer = styled.div`
  .collectionManagerIndexHeader--info {
    margin: 18px auto 0;
    text-align: center;
    max-width: 320px;
    font-size: 16px;

    .collectionManagerIndexHeader--info-icon {
      display: inline-block;
      margin-left: 8px;
      margin-bottom: -5px;
    }
  }

  .collectionManagerIndexHeader--buttons {
    margin: 24px auto 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .collectionManagerIndexHeader--more-btn {
      padding: 12px;
    }
  }

  ${sizeMQ({
    tabletS: css`
      .collectionManagerIndexHeader--info {
        display: flex;
        align-items: center;
        max-width: 100%;
      }
      .collectionManagerIndexHeader--buttons {
        justify-content: flex-start;
      }
    `,
  })}
`

export default CollectionManagerIndexHeader
