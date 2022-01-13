import React, { useState } from "react"
import styled from "styled-components"
import { Z_INDEX } from "../../../constants/zIndex"
import { Media } from "../../../design-system/Media"
import { appendClassName, selectClassNames } from "../../../lib/helpers/styling"
import Icon from "../../common/Icon.react"
import Link from "../../common/Link.react"

export const BANNER_HEIGHT = "56px"

interface Props {
  heading: string
  headingMobile?: string
  text: string
  url: string
  ctaText: string
  onClose: () => unknown
}

const AnnouncementBanner = ({
  heading,
  headingMobile,
  text,
  url,
  ctaText,
  onClose,
}: Props) => {
  const [closed, setClosed] = useState(false)
  return (
    <DivContainer
      className={selectClassNames("AnnouncementBanner", { closed })}
    >
      <div className="AnnouncementBanner--text">
        <Media greaterThanOrEqual="sm">
          <Link className="AnnouncementBanner--link" href={url}>
            <strong className="AnnouncementBanner--alert">{heading}</strong>{" "}
            {text}{" "}
          </Link>
          <Link
            className={selectClassNames("AnnouncementBanner", {
              link: true,
              linkUnderlined: true,
            })}
            href={url}
          >
            {ctaText}
          </Link>
        </Media>

        <Media lessThan="sm">
          {(mediaClassNames, renderChildren) =>
            renderChildren && (
              <Link
                className={appendClassName(
                  "AnnouncementBanner--link",
                  mediaClassNames,
                )}
                href={url}
              >
                <strong className="AnnouncementBanner--alert">
                  {headingMobile ?? heading}
                </strong>{" "}
                {text}{" "}
              </Link>
            )
          }
        </Media>
      </div>
      <Icon
        className="AnnouncementBanner--close"
        value="close"
        onClick={() => {
          onClose()
          setClosed(true)
        }}
      />
    </DivContainer>
  )
}

export default AnnouncementBanner

const DivContainer = styled.div`
  color: ${props => props.theme.colors.cloud};
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  height: ${BANNER_HEIGHT};
  z-index: ${Z_INDEX.ANNOUNCEMENT_BANNER};
  transition: top 0.5s;
  width: 100%;
  /* WARRIORS COLORS
  background: linear-gradient(-45deg, #ffcc33, #003399, #ffcc33, #003399); */
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  &.AnnouncementBanner--closed {
    top: -${BANNER_HEIGHT};
  }

  .AnnouncementBanner--text {
    display: flex;
    justify-content: center;
    text-align: center;
    width: 100%;

    .AnnouncementBanner--alert {
      margin-left: 8px;
      margin-right: 4px;
    }

    .AnnouncementBanner--link {
      color: ${props => props.theme.colors.cloud};

      &.AnnouncementBanner--linkUnderlined {
        text-decoration: underline;
        margin-left: 8px;
      }
    }
  }

  .AnnouncementBanner--close {
    margin-right: 20px;
    width: fit-content;
    cursor: pointer;
  }
`
