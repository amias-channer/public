import React from "react"
import styled, { css } from "styled-components"
import Checkbox from "../../design-system/Checkbox"
import Text from "../../design-system/Text"
import Link from "../common/Link.react"
import { sizeMQ } from "../common/MediaQuery.react"

interface Props {
  hasAcceptedTerms: boolean
  isBundle: boolean
  isReviewChecked: boolean
  isToSChecked: boolean
  onReviewChecked: (value: boolean) => unknown
  onToSChecked: (value: boolean) => unknown
}

const AcknowledgementCheckboxes = ({
  hasAcceptedTerms,
  isBundle,
  isReviewChecked,
  isToSChecked,
  onReviewChecked,
  onToSChecked,
}: Props) => (
  <DivContainer>
    {isBundle && (
      <div className="AcknowledgementCheckboxes--tos-row">
        <Checkbox
          checked={isReviewChecked}
          className="AcknowledgementCheckboxes--tos-row-checkbox"
          id="review"
          name="review"
          onChange={onReviewChecked}
        />
        <Text
          as="label"
          className="AcknowledgementCheckboxes--tos-text"
          htmlFor="review"
        >
          By checking this box, I acknowledge that this bundle contains an item
          that has not been reviewed or approved by OpenSea.
        </Text>
      </div>
    )}
    {!hasAcceptedTerms && (
      <div className="AcknowledgementCheckboxes--tos-row">
        <Checkbox
          checked={isToSChecked}
          className="AcknowledgementCheckboxes--tos-row-checkbox"
          id="tos"
          name="tos"
          onChange={onToSChecked}
        />
        <Text
          as="label"
          className="AcknowledgementCheckboxes--tos-text"
          htmlFor="tos"
        >
          By checking this box, I agree to OpenSea's{" "}
          <Link href="/tos" target="_blank">
            Terms of Service
          </Link>
        </Text>
      </div>
    )}
  </DivContainer>
)

const DivContainer = styled.div`
  padding: 20px 0;

  .AcknowledgementCheckboxes--tos-row {
    display: flex;
    align-items: center;
    padding-top: 16px;

    .AcknowledgementCheckboxes--tos-text {
      font-size: 14px;
      display: inline;
      ${sizeMQ({
        tabletS: css`
          font-size: 15px;
        `,
      })}

      .AcknowledgementCheckboxes--tos-verification-icon {
        display: inline;
      }
    }

    .AcknowledgementCheckboxes--tos-row-checkbox {
      margin-right: 12px;
    }
  }
`

export default AcknowledgementCheckboxes
