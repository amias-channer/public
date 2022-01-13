import React from "react"
import styled, { css } from "styled-components"
import useAppContext from "../../hooks/useAppContext"
import { getIsTestnet } from "../../store"
import { $network_banner_height } from "../../styles/variables"
import Icon from "../common/Icon.react"
import { sizeMQ } from "../common/MediaQuery.react"

export const TestnetNotice = () => {
  const { showBanner, updateContext } = useAppContext()
  if (!showBanner) {
    return null
  }

  return (
    <DivContainer>
      {getIsTestnet() ? (
        <span>
          You're viewing data from the test networks, but your wallet is
          connected to the main network. To use OpenSea, please switch to{" "}
          <a className="TestnetNotice--link" href="https://opensea.io">
            opensea.io
          </a>
        </span>
      ) : (
        <span>
          Your wallet is connected to the Rinkeby test network. To use OpenSea
          on Rinkeby, please switch to{" "}
          <a className="TestnetNotice--link" href="https://testnets.opensea.io">
            testnets.opensea.io
          </a>
        </span>
      )}
      <Icon
        className="TestnetNotice--close"
        value="close"
        onClick={() => updateContext({ showBanner: false })}
      />
    </DivContainer>
  )
}

export default TestnetNotice

const DivContainer = styled.div`
  align-items: center;
  background: ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.text.on.warning};
  display: flex;
  justify-content: center;
  padding: 12px 20px;
  height: ${$network_banner_height};

  .TestnetNotice--link {
    text-decoration: underline;
    color: ${props => props.theme.colors.text.on.warning};
  }

  .TestnetNotice--close {
    cursor: pointer;
    margin-left: 16px;
  }

  ${sizeMQ({
    mobile: css`
      font-size: 14px;
    `,
  })}
`
