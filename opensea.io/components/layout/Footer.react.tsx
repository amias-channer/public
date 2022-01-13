import React from "react"
import styled, { css } from "styled-components"
import { OPENSEA_URL, OPENSEA_WHITE_LOGO_IMG } from "../../constants"
import Block from "../../design-system/Block"
import Button from "../../design-system/Button"
import { useTheme } from "../../design-system/Context/ThemeContext"
import Flex from "../../design-system/Flex"
import {
  marketPlaceLinks,
  myAccountLinks,
  resourcesLinks,
  getSocialLinks,
  statLinks,
} from "../../lib/helpers/links"
import { themeVariant } from "../../styles/styleUtils"
import Image from "../common/Image.react"
import Link from "../common/Link.react"
import { sizeMQ } from "../common/MediaQuery.react"
import MailingSignupForm from "./MailingSignupForm.react"

const Footer = () => {
  const companyLinks = [
    {
      url: "/about",
      label: "About",
    },
    {
      url: "/careers",
      label: "Careers",
    },
  ]
  const { theme } = useTheme()

  return (
    <DivContainer>
      <div className="Footer--container">
        <Flex className="Footer--row">
          <Flex className="Footer--column Footer--half">
            <Block className="Footer--section-header">Stay in the loop</Block>
            <Block className="Footer--text">
              Join our mailing list to stay in the loop with our newest feature
              releases, NFT drops, and tips and tricks for navigating OpenSea.
            </Block>
            <MailingSignupForm />
          </Flex>
          <Flex className="Footer--column Footer--half">
            <Block className="Footer--section-header">Join the community</Block>

            <Flex flexWrap="wrap" justifyContent="center">
              {getSocialLinks({ width: 30 }).map(link => (
                <Button
                  aria-label={link.label}
                  className="Footer--social-button"
                  href={link.url}
                  key={link.url}
                  variant={theme === "dark" ? "secondary" : "primary"}
                >
                  {link.logo}
                </Button>
              ))}
            </Flex>
          </Flex>
        </Flex>
        <Flex className="Footer--row">
          <Flex className="Footer--column Footer--quarter">
            <Image size={44} url={OPENSEA_WHITE_LOGO_IMG} />
            <Link
              className="Footer--section-header"
              href={OPENSEA_URL}
              rel="noreferrer"
              target="_blank"
            >
              OpenSea
            </Link>
            <Block className="Footer--text">
              The world’s first and largest digital marketplace for crypto
              collectibles and non-fungible tokens (NFTs). Buy, sell, and
              discover exclusive digital assets.
            </Block>
          </Flex>
          <Flex className="Footer--three-quarters">
            <Flex className="Footer--link-column">
              <Block className="Footer--link-header">Marketplace</Block>
              {marketPlaceLinks.map(link => (
                <Link className="Footer--link" href={link.url} key={link.url}>
                  {link.label}
                </Link>
              ))}
            </Flex>
            <Flex className="Footer--link-column">
              <Block className="Footer--link-header">My Account</Block>
              {myAccountLinks.map(link => (
                <Link className="Footer--link" href={link.url} key={link.url}>
                  {link.label}
                </Link>
              ))}
              <Block className="Footer--link-header" marginTop="48px">
                Stats
              </Block>
              {statLinks.map(link => (
                <Link className="Footer--link" href={link.url} key={link.url}>
                  {link.label}
                </Link>
              ))}
            </Flex>
            <Flex className="Footer--link-column">
              <Block className="Footer--link-header">Resources</Block>
              {resourcesLinks.map(link => (
                <Link className="Footer--link" href={link.url} key={link.url}>
                  {link.label}
                </Link>
              ))}
            </Flex>
            <Flex className="Footer--link-column">
              <Block className="Footer--link-header">Company</Block>
              {companyLinks.map(link => (
                <Link className="Footer--link" href={link.url} key={link.url}>
                  {link.label}
                </Link>
              ))}
            </Flex>
          </Flex>
        </Flex>

        <Flex className="Footer--bottom">
          <Flex className="Footer--bottom-section">
            <p>© 2018 - {new Date().getFullYear()} Ozone Networks, Inc</p>
          </Flex>
          <Flex className="Footer--bottom-section">
            <Link className="Footer--link" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="Footer--link" href="/tos">
              Terms of Service
            </Link>
          </Flex>
        </Flex>
      </div>
    </DivContainer>
  )
}

export default Footer

const DivContainer = styled.div`
  color: ${props => props.theme.colors.white};
  display: flex;
  height: auto;
  justify-content: center;
  position: relative;
  width: 100%;

  ${props =>
    themeVariant({
      variants: {
        light: {
          backgroundColor: props.theme.colors.darkSeaBlue,
        },
        dark: {
          backgroundColor: props.theme.colors.charcoal,
        },
      },
    })}

  .Footer--container {
    width: 85%;

    .Footer--column {
      flex-direction: column;
      padding-top: 20px;
      padding-left: 0;

      &.Footer--half {
        width: 100%;
        align-items: center;
        text-align: center;

        ${sizeMQ({
          extraLarge: css`
            width: 50%;
            padding-top: 40px;
            align-items: flex-start;
            text-align: left;

            &:first-of-type {
              padding-right: 64px;
            }

            &:last-of-type {
              padding-left: 64px;
            }
          `,
        })}
      }

      &.Footer--quarter {
        width: 100%;
        align-items: center;
        text-align: center;

        ${sizeMQ({
          tabletL: css`
            width: 25%;
            padding-top: 40px;
            align-items: flex-start;
            text-align: left;
          `,
        })}
      }
    }

    .Footer--three-quarters {
      width: 100%;
      height: fit-content;
      align-items: flex-start;
      padding-top: 20px;
      padding-left: 0;
      justify-content: space-around;
      flex-wrap: wrap;

      ${sizeMQ({
        tabletL: css`
          width: 75%;
          padding-top: 40px;
          align-items: flex-start;
          padding-left: 72px;
        `,
      })}

      .Footer--link-column {
        flex-direction: column;
        height: 50%;
        width: 50%;
        padding-top: 20px;
        align-items: center;

        &:first-of-type {
          margin-bottom: 16px;
        }

        ${sizeMQ({
          medium: css`
            width: 20%;
            height: 100%;
            padding-top: 0;
            align-items: flex-start;
          `,
        })}
      }
    }

    .Footer--bottom {
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      margin-top: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;

      .Footer--bottom-section {
        width: 100%;
        justify-content: center;
        text-align: center;

        .Footer--link {
          color: ${props => props.theme.colors.cloud};
          margin-top: 0;
          font-size: 12px;

          &:last-of-type {
            margin-left: 16px;
          }

          &:hover {
            font-weight: 500;
          }
        }

        ${sizeMQ({
          medium: css`
            width: 75%;
            justify-content: flex-start;
            text-align: default;

            &:last-of-type {
              width: 25%;
              justify-content: flex-end;
            }
          `,
        })}
      }
    }

    .Footer--text {
      font-size: 16px;
      color: ${props => props.theme.colors.cloud};
    }

    .Footer--link-header {
      font-size: 16px;
      font-weight: 600;
      color: ${props => props.theme.colors.white};
    }

    .Footer--section-header {
      color: ${props => props.theme.colors.white};
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
      margin-top: 8px;
    }

    .Footer--social-button {
      margin-right: 12px;
      width: 54px;
      height: 54px;
      margin-top: 8px;

      &:hover {
        filter: brightness(1.1);
        border: 1px solid rgba(0, 0, 0, 0);
        background-color: ${props => props.theme.colors.primary};
      }
    }

    .Footer--link {
      color: ${props => props.theme.colors.cloud};
      font-size: 14px;
      margin-top: 12px;

      &:hover {
        font-weight: 500;
      }
    }

    .Footer--row {
      flex-wrap: wrap;
      padding-bottom: 40px;
      margin-bottom: 20px;
      border-bottom: solid 1px
        ${props => props.theme.colors.withOpacity.fog.light};
    }

    ${sizeMQ({
      mobile: css`
        width: 85%;
      `,
      medium: css`
        width: 82.5%;
      `,
    })}
  }
`
