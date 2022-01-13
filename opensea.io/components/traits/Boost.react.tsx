import React from "react"
import { useFragment } from "react-relay"
import styled from "styled-components"
import { Boost_collection$key } from "../../lib/graphql/__generated__/Boost_collection.graphql"
import { Boost_trait$key } from "../../lib/graphql/__generated__/Boost_trait.graphql"
import { graphql } from "../../lib/graphql/graphql"
import Router from "../../lib/helpers/router"
import { checkAndReplace } from "../../lib/helpers/stringUtils"
import { $primary_6, $ultralight_grey } from "../../styles/variables"
import Icon from "../common/Icon.react"
import Link from "../common/Link.react"

const BOOST_PERCENTAGE = "BOOST_PERCENTAGE"

interface BoostProps {
  className?: string
  collection: Boost_collection$key
  trait: Boost_trait$key
}

const Boost = ({
  className,
  collection: collectionDataKey,
  trait: traitDataKey,
}: BoostProps) => {
  const { displayType, floatValue, intValue, traitType } = useFragment(
    graphql`
      fragment Boost_trait on TraitType {
        displayType
        floatValue
        intValue
        traitType
      }
    `,
    traitDataKey,
  )

  const { numericTraits, slug } = useFragment(
    graphql`
      fragment Boost_collection on CollectionType {
        numericTraits {
          key
          value {
            max
            min
          }
        }
        slug
      }
    `,
    collectionDataKey,
  )

  const value =
    floatValue === null ? (intValue === null ? null : +intValue) : floatValue
  const traitMax = numericTraits.find(t => t.key === traitType)?.value.max || 0
  if (value === null || traitMax === null) {
    return null
  }

  const barPercent =
    displayType !== "BOOST_PERCENTAGE" && traitMax
      ? Math.round((value / traitMax) * 100)
      : value
  const boostPrefix = +value > 0 ? "+" : ""
  const boostText = displayType === BOOST_PERCENTAGE ? `${value}%` : `${value}`

  const rotation = (barPercent / 100) * 180
  const rotationStyling = `rotate(${rotation}deg)`

  return (
    <Link
      href={`/assets/${slug}${Router.stringifyQueryParams({
        search: {
          numericTraits: [
            {
              name: traitType,
              ranges: [{ min: value, max: value }],
            },
          ],
        },
      })}`}
    >
      <DivContainer className={className}>
        <div className="Boost--radial-progress" data-progress={barPercent}>
          <div className="Boost--circle">
            <div
              className="Boost--mask Boost--full"
              style={{ transform: rotationStyling }}
            >
              <div
                className="Boost--fill"
                style={{ transform: rotationStyling }}
              />
            </div>
            <div className="Boost--mask Boost--half">
              <div
                className="Boost--fill"
                style={{ transform: rotationStyling }}
              />
              <div
                className="Boost--fill Boost--fix"
                style={{ transform: `rotate(${rotation * 2}deg)` }}
              />
            </div>
          </div>
          <div className="Boost--inset">
            <div
              className={`Boost--icon-wrapper ${
                displayType === BOOST_PERCENTAGE
                  ? "icon_percentage"
                  : "icon_number"
              }`}
              data-assetvalue={
                displayType === BOOST_PERCENTAGE ? `+${traitMax}%` : `+${value}`
              }
            >
              <Icon className="material-icons Boost--icon" value="flash_on" />
            </div>
          </div>
        </div>
        <div className="Boost--label-wrapper">
          <h6 className="Boost--label-trait-type">
            {checkAndReplace(traitType, "_", " ")}
          </h6>
          <p className="Boost--label-trait-value">
            {boostPrefix}
            {boostText}
          </p>
        </div>
      </DivContainer>
    </Link>
  )
}

export default Boost

const DivContainer = styled.div`
  cursor: pointer;

  .Boost--label {
    display: flex;
    font-weight: 500;
    justify-content: space-between;

    .Boost--value {
      color: ${props => props.theme.colors.text.subtle};
    }
  }

  .Boost--label-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    .Boost--label-trait-type {
      font-size: 14px;
      margin: 7px 0 0 0;
      text-transform: none;
      color: black;
      width: min-content;
      min-width: 65px;
      text-align: center;
    }
    .Boost--label-trait-value {
      font-size: 14px;
      color: ${$primary_6};
      opacity: 0.6;
      margin: 0;
    }
  }

  .Boost--radial-progress {
    cursor: pointer;
    margin: 5px 0;
    width: 60px;
    height: 60px;

    background-color: white;
    border-radius: 50%;
    border: solid 1px ${$ultralight_grey};

    &:hover {
      .Boost--inset {
        .Boost--icon-wrapper {
          .Boost--icon {
            display: none;
          }

          &:after {
            content: attr(data-assetvalue);
            font-size: 14px;
          }
        }
      }
    }
    .Boost--circle {
      .Boost--mask,
      .Boost--fill {
        width: 60px;
        height: 60px;
        position: absolute;
        border-radius: 50%;
      }
      .Boost--mask,
      .Boost--fill {
        backface-visibility: hidden;
        transition: transform 1s;
        border-radius: 50%;
      }
      .Boost--mask {
        clip: rect(0px, 60px, 60px, 30px);
        .Boost--fill {
          clip: rect(0px, 30px, 60px, 0px);
          background-color: #6bd9fc;
        }
      }
    }
    .Boost--inset {
      width: 48px;
      height: 48px;
      position: absolute;
      margin-left: 6px;
      margin-top: 6px;

      background-color: #2d9cdb;
      border-radius: 50%;

      display: flex;
      align-items: center;
      justify-content: center;

      .Boost--icon {
        color: white;
        font-size: 30px;
        width: auto;
        height: auto;
        justify-content: center;
        align-items: center;
        display: flex;

        .material-icons {
          margin-right: 0px;
        }
      }
    }
  }
`
