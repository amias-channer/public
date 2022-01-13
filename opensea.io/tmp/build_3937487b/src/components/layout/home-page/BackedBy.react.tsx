import React from "react"
import styled, { css } from "styled-components"
import Flex from "../../../design-system/Flex"
import { themeVariant } from "../../../styles/styleUtils"
import { Link } from "../../common/Link.react"
import { sizeMQ } from "../../common/MediaQuery.react"
import AndressenHorowitzLogo from "../../svgs/AndressenHorowitzLogo.react"
import BlockChainCapitalLogo from "../../svgs/BlockChainCapitalLogo.react"
import CoinbaseLogo from "../../svgs/CoinbaseLogo.react"
import DapperLogo from "../../svgs/DapperLogo.react"
import FoundersFundLogo from "../../svgs/FoundersFundLogo.react"
import QuantStampLogo from "../../svgs/QuantStampLogo.react"
import TrustWalletLogo from "../../svgs/TrustWalletLogo.react"
import YCombinatorLogo from "../../svgs/YCombinatorLogo.react"

const BackedBy = () => {
  return (
    <FlexContainer>
      <Flex className="BackedBy--logos">
        <Link aria-label="Andreessen Horowitz" href="https://a16z.com/">
          <AndressenHorowitzLogo className="BackedBy--logo" />
        </Link>
        <Link aria-label="Coinbase" href="https://www.coinbase.com/">
          <CoinbaseLogo className="BackedBy--logo" />
        </Link>
        <Link aria-label="YCombinator" href="https://www.ycombinator.com/">
          <YCombinatorLogo className="BackedBy--logo" />
        </Link>
        <Link aria-label="Trust Wallet" href="https://trustwallet.com/">
          <TrustWalletLogo className="BackedBy--logo" />
        </Link>
        <Link aria-label="Dapper Labs" href="https://www.dapperlabs.com/">
          <DapperLogo className="BackedBy--logo" />
        </Link>
        <Link aria-label="Quantstamp" href="https://quantstamp.com/">
          <QuantStampLogo className="BackedBy--logo" />
        </Link>
        <Link aria-label="Founders Fund" href="https://foundersfund.com/">
          <FoundersFundLogo className="BackedBy--logo" />
        </Link>
        <Link
          aria-label="Blockchain Capital"
          href="https://blockchain.capital/"
        >
          <BlockChainCapitalLogo className="BackedBy--logo" />
        </Link>
      </Flex>
    </FlexContainer>
  )
}

export default BackedBy

const FlexContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  height: 400px;

  ${props =>
    themeVariant({
      variants: {
        light: {
          backgroundColor: props.theme.colors.primary,
        },
        dark: {
          backgroundColor: props.theme.colors.withOpacity.charcoal.light,
        },
      },
    })}

  ${sizeMQ({
    phoneXs: css`
      height: 220px;
    `,
    small: css`
      height: 130px;
    `,
    extraLarge: css`
      height: 100px;
    `,
  })}

  .BackedBy--logos {
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;

    ${sizeMQ({
      phoneXs: css`
        max-width: 355px;
      `,
      small: css`
        max-width: 720px;
      `,
      extraLarge: css`
        max-width: 1280px;
      `,
    })}

    .BackedBy--logo {
      height: 25px;
      margin: 10px;
      width: 150px;

      ${sizeMQ({
        phoneXs: css`
          width: 126px;
        `,
      })}
      ${props =>
        themeVariant({
          variants: {
            light: {
              fill: props.theme.colors.withOpacity.surface.heavy,
            },
            dark: {
              fill: props.theme.colors.withOpacity.gray.heavy,
            },
          },
        })}

      &:hover {
        ${props =>
          themeVariant({
            variants: {
              light: {
                fill: props.theme.colors.surface,
              },
              dark: {
                fill: props.theme.colors.gray,
              },
            },
          })}

        .TrustWalletLogo--frame,
      .YCombinatorLogo--square {
          ${props =>
            themeVariant({
              variants: {
                light: {
                  stroke: props.theme.colors.surface,
                },
                dark: {
                  stroke: props.theme.colors.gray,
                },
              },
            })}
        }
      }

      .BlockStackLogo--holes {
        fill: ${props => props.theme.colors.primary};
      }

      .TrustWalletLogo--letters,
      .TrustWalletLogo--shield,
      .YCombinatorLogo--y,
      .YCombinatorLogo--letters {
        fill: inherit;
      }
      .TrustWalletLogo--frame,
      .YCombinatorLogo--square {
        fill: none;
        ${props =>
          themeVariant({
            variants: {
              light: {
                stroke: props.theme.colors.withOpacity.surface.heavy,
              },
              dark: {
                stroke: props.theme.colors.withOpacity.gray.heavy,
              },
            },
          })}
      }
    }
  }
`
