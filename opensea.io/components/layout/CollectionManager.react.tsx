import React from "react"
import styled, { css } from "styled-components"
import {
  DEFAULT_IMG,
  // MAX_ASSET_SHORTNAME_LENGTH,
} from "../../constants"
import AppContainer from "../../containers/AppContainer.react"
import Block from "../../design-system/Block"
import Flex from "../../design-system/Flex"
import { truncateText } from "../../lib/helpers/stringUtils"
import { appendClassName, selectClassNames } from "../../lib/helpers/styling"
import { $nav_height, $orange } from "../../styles/variables"
import Icon from "../common/Icon.react"
import Link from "../common/Link.react"
import { sizeMQ } from "../common/MediaQuery.react"
import VerticalAligned from "../common/VerticalAligned.react"
import Head from "./Head.react"

interface Props {
  // TODO: Can these breadcrumbs be generated via routing instead of using props? - Roy
  breadcrumbLinks?: Array<{
    href?: string
    label: string
  }>
  children?: React.ReactNode
  containerClassName?: string
  className?: string
  fullWidth?: boolean
  hasMargins?: boolean
  title?: string
  titleBadge?: string
  subtitle?: React.ReactNode
}

const CollectionManager = ({
  breadcrumbLinks,
  children,
  className,
  containerClassName,
  fullWidth,
  hasMargins,
  title,
  titleBadge,
  subtitle,
}: Props) => (
  <AppContainer hideFooter>
    <DivContainer>
      <Head
        description="Manage your collections"
        image={DEFAULT_IMG}
        title="Collection Manager"
      />
      <section
        className={appendClassName("CollectionManager--main", className)}
      >
        {breadcrumbLinks && (
          <div className="CollectionManager--topbar">
            {breadcrumbLinks.map(breadcrumb => (
              <Flex key={breadcrumb.label}>
                {breadcrumb.href ? (
                  <Link
                    className="CollectionManager--breadcrumb-link"
                    href={breadcrumb.href}
                  >
                    <span>{truncateText(breadcrumb.label, 15)}</span>
                  </Link>
                ) : (
                  <span className="CollectionManager--breadcrumb-current">
                    {truncateText(breadcrumb.label, 15)}
                  </span>
                )}

                {(title || breadcrumb.href) && (
                  <VerticalAligned>
                    <Icon color="gray" size={12} value="chevron_right" />
                  </VerticalAligned>
                )}
              </Flex>
            ))}
            {title && (
              <span className="CollectionManager--breadcrumb-current">
                {truncateText(title, 15)}
              </span>
            )}
          </div>
        )}
        <div
          className={selectClassNames(
            "CollectionManager",
            {
              container: true,
              "container-with-margins": hasMargins || !!title,
              "container-with-topbar": !!breadcrumbLinks,
              "narrow-container": !fullWidth,
            },
            containerClassName,
          )}
        >
          <header className="CollectionManager--header-container">
            {title ? (
              <Block as="h1" className="CollectionManager--header-title">
                {title}
                {titleBadge && (
                  <span className="CollectionManager--title-badge">
                    {titleBadge}
                  </span>
                )}
              </Block>
            ) : null}
            {subtitle ? (
              <div className="CollectionManager--header-subtitle">
                {subtitle}
              </div>
            ) : null}
          </header>
          {children}
        </div>
      </section>
    </DivContainer>
  </AppContainer>
)
export default CollectionManager

const DivContainer = styled.div`
  .CollectionManager--sidebar-item {
    align-items: center;
    display: flex;
    justify-content: center;
    color: ${props => props.theme.colors.withOpacity.text.body.heavy};
    padding: 12px 16px;

    &:hover {
      background-color: ${props => props.theme.colors.hover};
      color: ${props => props.theme.colors.text.body};
      font-weight: 500;
    }

    .CollectionManager--sidebar-item-text {
      display: none;
    }

    ${sizeMQ({
      medium: css`
        justify-content: initial;

        .CollectionManager--sidebar-item-text {
          display: initial;
          margin-left: 8px;
        }
      `,
    })}
  }

  .CollectionManager--main {
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .CollectionManager--topbar {
    align-items: center;
    background-color: ${props => props.theme.colors.surface};
    border-bottom: 1px solid ${props => props.theme.colors.border};
    display: flex;
    align-items: center;
    height: ${$nav_height};
    padding: 0 8px;
    position: fixed;
    width: 100%;
    z-index: 4;

    .CollectionManager--breadcrumb-link {
      margin: 0 8px;
      color: ${props => props.theme.colors.gray};
      font-size: 11px;
      &:hover {
        text-decoration: underline;
      }
    }

    .CollectionManager--breadcrumb-current {
      margin: 0 8px;
      color: ${props => props.theme.colors.text.body};
      font-size: 11px;
    }

    ${sizeMQ({
      tabletS: css`
        .CollectionManager--breadcrumb-link,
        .CollectionManager--breadcrumb-current {
          font-size: 14px;
        }
      `,
    })}
  }

  .CollectionManager--container {
    &.CollectionManager--container-with-margins {
      margin: 0 12px 50px;

      ${sizeMQ({
        medium: css`
          margin: 10px 30px 50px;
        `,
      })}
    }

    &.CollectionManager--container-with-topbar {
      padding: ${$nav_height} 16px;
      width: 100%;

      &.container {
        padding-left: 0;
        padding-right: 0;
      }
    }

    &:not(.CollectionManager--container-with-topbar) {
      max-width: 1280px;
    }
  }

  .CollectionManager--narrow-container:not(.container) {
    width: 100%;
    max-width: 800px;
  }

  .CollectionManager--header-container {
    display: flex;
    flex-direction: column;
  }

  .CollectionManager--header-title {
    font-size: 26px;
    font-weight: 500;
    margin-top: 16px;
    margin-right: 32px;
    margin-bottom: 6px;
  }

  .CollectionManager--header-subtitle {
    font-size: 15px;
    font-weight: 400;
    margin: 0 4px 12px 0;
  }

  .CollectionManager--title-badge {
    color: ${$orange};
    position: relative;
    top: -10px;
    font-size: 16px;
    left: 8px;
  }
`
