import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import { useFragment } from "react-relay"
import { RRNLRequestError } from "react-relay-network-modern"
import styled, { css } from "styled-components"
import ErrorActions from "../../actions/errors"
import Block from "../../design-system/Block"
import Button from "../../design-system/Button"
import Tooltip from "../../design-system/Tooltip"
import useAppContext from "../../hooks/useAppContext"
import { useTranslations } from "../../hooks/useTranslations"
import { AccountHeader_data$key } from "../../lib/graphql/__generated__/AccountHeader_data.graphql"
import { AccountHeaderBannerMutation } from "../../lib/graphql/__generated__/AccountHeaderBannerMutation.graphql"
import { clearCache } from "../../lib/graphql/environment/middlewares/cacheMiddleware"
import { graphql } from "../../lib/graphql/graphql"
import { getAccountLink } from "../../lib/helpers/accounts"
import { getAccountChangeAdminUrl } from "../../lib/helpers/admin"
import { stripHtml } from "../../lib/helpers/html"
import Router from "../../lib/helpers/router"
import { dispatch } from "../../store"
import AccountBadge from "../common/AccountBadge.react"
import Banner from "../common/Banner.react"
import CopyAddress from "../common/CopyAddress.react"
import GraphQLError from "../common/GraphQLError.react"
import { sizeMQ } from "../common/MediaQuery.react"
import ProfileImage from "../common/ProfileImage.react"
import Share from "../common/Share.react"
import TextCopier from "../common/TextCopier.react"
import FeatureFlag from "../featureFlag/FeatureFlag.react"
import ImageInput from "../forms/ImageInput.react"
interface Props {
  dataKey: AccountHeader_data$key | null
  isCurrent: boolean
}

type BannerStatus = "done" | "error" | "standby" | "wait"

const AccountHeader = ({ dataKey, isCurrent }: Props) => {
  const [bannerStatus, setBanneStatus] = useState<BannerStatus>("standby")
  const [error, setError] = useState<RRNLRequestError>()
  const { mutate } = useAppContext()
  const { tr } = useTranslations()

  const data = useFragment(
    graphql`
      fragment AccountHeader_data on AccountType {
        address
        bio
        bannerImageUrl
        config
        discordId
        relayId
        names {
          name
          type
        }
        displayName
        ...accounts_url
        ...ProfileImage_data
      }
    `,
    dataKey,
  )

  const editBanner = async ({ value }: { value: File }): Promise<void> => {
    if (!data) {
      return
    }
    const { address } = data
    setBanneStatus("wait")
    try {
      await mutate<AccountHeaderBannerMutation>(
        graphql`
          mutation AccountHeaderBannerMutation($input: AccountMutationInput!) {
            account(input: $input) {
              bannerImageUrl
            }
          }
        `,
        { input: { identity: { address }, bannerImage: value } },
        { shouldAuthenticate: true },
      )
      setBanneStatus("done")
      clearCache()
    } catch (error) {
      setBanneStatus("error")

      if (error instanceof RRNLRequestError) {
        setError(error)
      } else {
        await dispatch(
          ErrorActions.show(
            error,
            `Error submitting request: ${error.message}`,
          ),
        )
      }
    }
  }

  if (!data) {
    return (
      <DivContainer>
        <Banner className="AccountHeader--banner" />
        <div className="AccountHeader--main">
          <div className="AccountHeader--image-placeholder AccountHeader--profile-image" />
          <div className="AccountHeader--title-placeholder" />
          <div className="AccountHeader--subtitle-placeholder" />
          <div className="AccountHeader--bio-placeholder" />
        </div>
      </DivContainer>
    )
  }
  const {
    relayId,
    address,
    bio,
    displayName,
    names,
    bannerImageUrl,
    config,
    discordId,
  } = data

  const name = names
    ? names.find(({ type }) => type === "ens")?.name || names[0]?.name
    : ""
  const editable = isCurrent && !Router.getPath().startsWith("/accounts")

  const pRenderer = ({ children }: { children: React.ReactNode }) => (
    <p className="AccountHeader--bio-text">{children}</p>
  )

  return (
    <DivContainer>
      {editable ? (
        <div className="AccountHeader--banner-anchor">
          <div className="AccountHeader--banner-edit">
            <Tooltip content="Change Banner">
              <span>
                <ImageInput
                  className="AccountHeader--banner-input"
                  onChange={editBanner}
                />
                <Button icon="edit" title="Change Banner" variant="tertiary" />
              </span>
            </Tooltip>
          </div>
          {bannerStatus === "error" && error ? (
            <GraphQLError error={error} />
          ) : null}
        </div>
      ) : null}
      <Banner
        className="AccountHeader--banner"
        imageUrl={bannerImageUrl || undefined}
        loading={bannerStatus === "wait"}
      />
      <div className="AccountHeader--main">
        <div className="AccountHeader--image-container">
          <ProfileImage
            className="AccountHeader--profile-image"
            dataKey={data}
            editable={editable}
            isDynamic
            loaderSize="large"
          />
          <div className="AccountHeader--badge">
            <AccountBadge
              config={config}
              discordId={discordId}
              variant="large"
            />
          </div>
        </div>
        <div className="AccountHeader--title">
          {displayName || tr("Unnamed")}
        </div>
        <div className="AccountHeader--subtitle">
          {name && <TextCopier className="AccountHeader--name" text={name} />}
          <CopyAddress address={address} className="AccountHeader--address" />
        </div>
        <div>
          {bio ? (
            <div className="AccountHeader--bio">
              <ReactMarkdown
                linkTarget="_blank"
                renderers={{ paragraph: pRenderer }}
              >
                {stripHtml(bio)}
              </ReactMarkdown>
            </div>
          ) : (
            <span />
          )}
        </div>
      </div>
      <div className="AccountHeader--quick-links">
        {editable && (
          <Tooltip content="Settings">
            <Block marginRight="10px">
              <Button
                href="/account/settings"
                icon="settings"
                variant="tertiary"
              />
            </Block>
          </Tooltip>
        )}

        <Block height="50px">
          <Share url={getAccountLink(data)}>
            <Button icon="share" title="Share" variant="tertiary" />
          </Share>
        </Block>

        <FeatureFlag flags={["staff"]}>
          <Block height="50px" marginLeft="12px">
            <Tooltip content="Django admin">
              <Button
                href={getAccountChangeAdminUrl(relayId)}
                icon="vpn_key"
                variant="tertiary"
              />
            </Tooltip>
          </Block>
        </FeatureFlag>
      </div>
    </DivContainer>
  )
}

export default AccountHeader

const DivContainer = styled.div`
  display: flex;
  margin: 0;
  flex-direction: column;

  .AccountHeader--banner {
    height: 225px;
  }

  .AccountHeader--main {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: -64px;
    margin-bottom: 12px;
    min-height: 250px;

    .AccountHeader--profile-image {
      border: 2px solid ${props => props.theme.colors.header};
      background-color: ${props => props.theme.colors.header};
      border-radius: 50%;
      width: 130px;
      min-width: 130px;
      height: 130px;
      min-height: 130px;

      &.AccountHeader--image-placeholder {
        background-color: ${props => props.theme.colors.border};
      }
    }

    .AccountHeader--image-container {
      position: relative;

      .AccountHeader--badge {
        font-size: 30px;
        position: absolute;
        bottom: -4px;
        right: 12px;
        z-index: 2;
      }
    }

    .AccountHeader--title {
      align-items: center;
      display: flex;
      font-size: 40px;
      font-weight: 600;
      min-height: 40px;
      margin-top: 4px;
      margin-bottom: 0;
    }

    .AccountHeader--title-placeholder {
      width: 192px;
      margin-top: 14px;
      min-height: 40px;
      margin: 10px;
      border-radius: 4px;
      background-color: ${props => props.theme.colors.border};
    }

    .AccountHeader--subtitle {
      align-items: center;
      display: flex;
      min-height: 27px;

      .AccountHeader--name {
        color: ${props => props.theme.colors.text.subtle};
        font-size: 18px;
        margin-right: 8px;
      }

      .AccountHeader--address {
        display: flex;
        color: ${props => props.theme.colors.text.subtle};
        font-size: 16px;
      }
    }

    .AccountHeader--subtitle-placeholder {
      width: 256px;
      min-height: 31px;
      border-radius: 4px;
      background-color: ${props => props.theme.colors.border};
    }

    .AccountHeader--bio-placeholder {
      width: 128px;
      min-height: 22px;
      margin-top: 8px;
      border-radius: 4px;
      background-color: ${props => props.theme.colors.border};
    }
  }

  .AccountHeader--quick-links {
    align-self: flex-end;
    position: absolute;
    right: 15px;
    top: 312px;
    height: 0px;
    display: flex;

    .AccountHeader--button-text {
      padding-left: 5px;
      display: none;
    }
  }

  .AccountHeader--bio {
    color: ${props => props.theme.colors.text.subtle};
    width: 300px;

    .AccountHeader--bio-text {
      margin: 8px 0 0;
      text-align: center;
    }
  }

  .AccountHeader--banner-anchor {
    position: relative;

    .AccountHeader--banner-edit {
      position: absolute;
      z-index: 1;
      top: 15px;
      right: 15px;

      .AccountHeader--banner-input {
        height: 100%;
        opacity: 0;
        position: absolute;
        padding: 0;
        margin: 0;
        border: 0;
        width: 100%;

        input.ImageInput--input {
          height: 100px;
          width: 80px;
        }
      }
    }
  }

  ${sizeMQ({
    mobile: css`
      .AccountHeader--bio {
        width: 500px;
      }

      .AccountHeader--button-text {
        display: block;
      }
    `,
  })}
`
