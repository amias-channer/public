import React, { useRef } from "react"
import moment from "moment"
import styled, { css } from "styled-components"
import { IS_SERVER } from "../../../constants"
import Block from "../../../design-system/Block"
import Flex from "../../../design-system/Flex"
import Text from "../../../design-system/Text"
import Tooltip from "../../../design-system/Tooltip"
import useSize from "../../../hooks/useSize"
import { trackClickPromoCard } from "../../../lib/analytics/events/homepageEvents"
import { buildCalendarUrl } from "../../../lib/helpers/calendar"
import { fromISO8601 } from "../../../lib/helpers/datetime"
import ActionButton from "../../common/ActionButton.react"
import Image from "../../common/Image.react"
import Link from "../../common/Link.react"
import { sizeMQ } from "../../common/MediaQuery.react"

export const PROMO_CARD_MAX_SIZE = 392

interface Props {
  promotion: {
    id: string
    promoCardImg: string | null
    promoCardLink: string | null
    promoHeader: string | null
    promoSubtitle: string | null
    cardColor: string | null
    saleStartTime: string | null
    saleEndTime: string | null
  }
  now: moment.Moment
}

const PromoCard = ({ promotion, now }: Props) => {
  const containerRef = useRef<HTMLAnchorElement>(null)
  const [width] = useSize(containerRef)
  const size =
    IS_SERVER || width >= PROMO_CARD_MAX_SIZE ? PROMO_CARD_MAX_SIZE : width
  if (
    !promotion.promoCardLink ||
    !promotion.promoCardImg ||
    !promotion.saleStartTime
  ) {
    return null
  }
  const startTime = fromISO8601(promotion.saleStartTime)
  const endTime = promotion.saleEndTime
    ? fromISO8601(promotion.saleEndTime)
    : undefined
  const live =
    fromISO8601(promotion.saleStartTime).isSameOrBefore(now) &&
    (endTime ? endTime.isSameOrAfter(now) : true)
  return (
    <Container>
      {!live && (
        <Flex className="PromoCard--calendar-container">
          <Tooltip content="Save to calendar">
            <ActionButton
              className="PromoCard--calendar"
              href={buildCalendarUrl(
                promotion.promoHeader || "OpenSea drop",
                `View the release on OpenSea`,
                promotion.promoCardLink
                  ? `https://opensea.io${promotion.promoCardLink}`
                  : `https://opensea.io`,
                startTime,
                endTime,
              )}
              icon="calendar_today"
              isSmall
              type="tertiary"
            />
          </Tooltip>
        </Flex>
      )}
      <Link
        className="PromoCard--main"
        href={promotion.promoCardLink}
        ref={containerRef}
        onClick={() =>
          trackClickPromoCard({
            promotionId: promotion.id,
            promotionHeader: promotion.promoHeader,
            link: promotion.promoCardLink,
          })
        }
      >
        <Image
          className="PromoCard--image"
          size={size}
          sizing="cover"
          url={promotion.promoCardImg}
        />
        <Flex
          className="PromoCard--content"
          style={{ backgroundColor: promotion.cardColor ?? undefined }}
          textAlign="center"
        >
          <Text as="div" className="PromoCard--card-title" variant="h4">
            {promotion.promoHeader}
          </Text>
          <Text className="PromoCard--card-text">
            {promotion.promoSubtitle
              ? promotion.promoSubtitle
              : `Explore this exclusive drop on OpenSea`}
          </Text>
          {live ? (
            <Text className="PromoCard--live">Live</Text>
          ) : (
            <Text className="PromoCard--card-date">{`${startTime
              .local()
              .format("dddd, MMMM Do [at] h:mma")}`}</Text>
          )}
        </Flex>
      </Link>
    </Container>
  )
}

export default PromoCard

const Container = styled(Block)`
  display: inline-block;
  width: 100%;
  padding: 10px;
  padding-top: 0;
  margin-top: 48px;
  position: relative;

  .PromoCard--calendar-container {
    position: absolute;
    top: 16px;
    right: 26px;
    z-index: 2;
    width: fit-content;

    .PromoCard--calendar {
      padding: 11px;
    }
  }

  .PromoCard--main {
    color: white;
    display: inline-block;
    border: 1px solid ${props => props.theme.colors.border};
    background-color: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.default};
    cursor: pointer;
    width: 100%;

    &:hover {
      box-shadow: ${props => props.theme.shadow};
      transition: 0.1s;
    }

    .PromoCard--image {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .PromoCard--content {
      flex-direction: column;
      height: 209px;
      padding: 20px 20px 10px;
      align-items: center;
      border-bottom-left-radius: ${props => props.theme.borderRadius.default};
      border-bottom-right-radius: ${props => props.theme.borderRadius.default};

      ${sizeMQ({
        medium: css`
          padding: 20px 35px 10px;
        `,
      })}
    }

    .PromoCard--card-text {
      color: white;
      font-size: 14px;
      font-weight: 400;
      max-width: 90%;
      margin: 20px auto 4px;
      overflow: hidden;
      text-align: center;
      /* Allow only two lines of text  */
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .PromoCard--card-title {
      color: white;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .PromoCard--card-date {
      height: 30px;
      margin-top: auto;
      color: white;
      font-weight: 600;
      align-items: center;
      padding: 1px 0 0 0;
    }

    .PromoCard--live {
      height: 30px;
      margin-top: auto;
      border-radius: ${props => props.theme.borderRadius.default};
      color: ${props => props.theme.colors.white};
      border: 1px solid ${props => props.theme.colors.white};
      font-weight: 500;
      font-size: 14px;
      padding: 4px 10px;
    }
  }
`
