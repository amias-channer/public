import React, { useEffect } from "react"
import styled, { css } from "styled-components"
import { SUPPORT_URL } from "../../../constants"
import AppContainer from "../../../containers/AppContainer.react"
import Button from "../../../design-system/Button"
import { useTheme } from "../../../design-system/Context/ThemeContext"
import Text from "../../../design-system/Text"
import { trackErrorPage } from "../../../lib/analytics/events/pageEvents"
import { getIsTestnet } from "../../../store"
import CenterAligned from "../../common/CenterAligned.react"
import Image from "../../common/Image.react"
import { sizeMQ } from "../../common/MediaQuery.react"
import TrendingCollections from "../../common/TrendingCollections.react"

export type ErrorPageProps = {
  statusCode: number
}

export const ErrorPage = ({ statusCode }: ErrorPageProps) => {
  const { theme } = useTheme()

  useEffect(() => {
    trackErrorPage({
      error_code: statusCode,
      path: window.location.pathname,
    })
  }, [statusCode])

  const render404Content = () => (
    <DivContainer>
      <CenterAligned className="error--404-container">
        <div className="error--404">
          <Text className="error--404-text" textAlign="right" variant="body">
            4
          </Text>

          <Image
            className="error--404-gif"
            url={
              theme === "dark"
                ? "/static/images/404-compass-full-dark.gif"
                : "/static/images/404-compass-full.gif"
            }
          />

          <Text className="error--404-text" textAlign="left" variant="body">
            4
          </Text>
        </div>
      </CenterAligned>

      <CenterAligned className="error--message">
        <Text as="h1" className="error--title" textAlign="center" variant="h2">
          This page is lost.
        </Text>
        <Text className="error--body-message" variant="body">
          We've explored deep and wide,
          <br /> but we can't find the page you were looking for.
        </Text>
        <Button className="error--action-button" href="/">
          Navigate back home
        </Button>
      </CenterAligned>
    </DivContainer>
  )

  const renderErrorContent = () => (
    <div className="error--message">
      <Text as="h1" textAlign="center" variant="h2">
        Oops, something went wrong
      </Text>
      <Text textAlign="center" variant="subtitle">
        Yikes, looks like something went wrong on our end. If the issue
        persists, please shoot us a note so we can help out.
      </Text>
      <Button className="error--action-button" href={SUPPORT_URL}>
        Contact Support
      </Button>
    </div>
  )

  const isTestnet = getIsTestnet()

  return (
    <AppContainer>
      <DivContainer>
        <div className="NotFound_hero">
          {statusCode === 404 ? render404Content() : renderErrorContent()}
        </div>
        <div className="NotFound_main_content">
          <div className="container">
            {!isTestnet ? <TrendingCollections /> : null}
          </div>
        </div>
      </DivContainer>
    </AppContainer>
  )
}

const DivContainer = styled.div`
  .error--404-container {
    height: 280px;
    margin-top: 44px;

    .error--404 {
      display: flex;
      vertical-align: middle;
      width: 420px;

      .error--404-text {
        font-weight: bold;
        color: #e5e8eb;
        width: 33.33%;
        font-size: 180px;
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }

  .error--title {
    margin: 0;
  }

  .error--message {
    text-align: center;
    padding-bottom: 100px;
    padding-left: 15%;
    padding-right: 15%;
  }

  .error--body-message {
    font-size: 18px;
    color: ${props => props.theme.colors.darkGray};

    ${sizeMQ({
      small: css`
        font-size: 20px;
      `,
    })}
  }

  .error--collections-featured {
    font-size: 20px;
    height: 200px;
    width: 200px;
    white-space: normal;
    text-align: center;

    ${sizeMQ({
      small: css`
        height: 358px;
        width: 326px;
      `,
    })}
  }

  .error--action-button {
    width: 204px;
    display: inline-block;
    margin-top: 10px;
  }
`
