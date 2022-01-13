import React from "react"
import styled from "styled-components"
import { OPENSEA_LOGO_IMG, OPENSEA_URL } from "../../constants"
import Text from "../../design-system/Text"
import useAppContext from "../../hooks/useAppContext"
import { HUES } from "../../styles/themes"
import { $nav_height } from "../../styles/variables"
import Icon from "../common/Icon.react"
import Image from "../common/Image.react"
import Link from "../common/Link.react"
import OpenSeaLetters from "../svgs/OpenSeaLetters.react"

const FULL_TEXT = "Powered by the largest cryptomarketplace"
const SHORT_TEXT = "Powered by"

const PoweredByOpenSeaNotice = () => {
  const { isMobile } = useAppContext()
  return (
    <DivPoweredByOpenSeaNotice>
      <div className="notice-wrapper">
        <Icon color="gray" value="power" />
        <Text variant="info">{isMobile ? SHORT_TEXT : FULL_TEXT}</Text>
        <Link
          className="PoweredByOpenSeaNotice--link"
          href={OPENSEA_URL}
          rel="noreferrer"
          target="_blank"
        >
          <Image alt="Logo" size={40} url={OPENSEA_LOGO_IMG} />
          <OpenSeaLetters
            className="PoweredByOpenSeaNotice--link-letters"
            fill={HUES.charcoal}
            width={100}
          />
        </Link>
      </div>
    </DivPoweredByOpenSeaNotice>
  )
}

export default PoweredByOpenSeaNotice

const DivPoweredByOpenSeaNotice = styled.div`
  background-color: ${props => props.theme.colors.surface};
  bottom: 0;
  display: flex;
  height: ${$nav_height};
  justify-content: flex-end;
  position: fixed;
  width: 100%;
  z-index: 2;

  .notice-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin: 0 32px 8px 0;

    .PoweredByOpenSeaNotice--link {
      align-items: center;
      margin-left: 8px;
      display: flex;

      .PoweredByOpenSeaNotice--link-letters {
        margin-left: 10px;
        margin-top: 4px;
      }
    }

    i {
      margin: 0 4px 0 0;
    }

    p {
      font-size: 13px;
    }
  }

  .night {
    i {
      color: ${props => props.theme.colors.withOpacity.gray.light};
    }

    p {
      color: ${props => props.theme.colors.withOpacity.gray.light};
    }
  }
`
