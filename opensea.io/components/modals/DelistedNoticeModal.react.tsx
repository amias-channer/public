import React from "react"
import { SUPPORT_URL } from "../../constants"
import Modal from "../../design-system/Modal"
import Text from "../../design-system/Text"
import ActionButton from "../common/ActionButton.react"
import ExternalLink from "../common/ExternalLink.react"

type DelistedNoticeProps = {
  onClose: () => void
  variant: "account" | "home"
}

export const DelistedNoticeModal = ({
  onClose,
  variant,
}: DelistedNoticeProps) => {
  return (
    <>
      <Modal.Header>
        <Modal.Title>
          {variant === "account" ? "This item" : "The item you tried to visit"}{" "}
          is no longer available on OpenSea
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="DelistedNotice--content">
          <Text>
            {variant === "account"
              ? "This item"
              : "The item you tried to visit"}{" "}
            is no longer available on OpenSea. It will not be visible or
            accessible to anyone browsing the marketplace
            {variant === "account" ? " or your profile" : ""}.
          </Text>
          <Text>
            To learn more about why{" "}
            {variant === "account"
              ? "this item"
              : "the item you tried to visit"}{" "}
            is no longer available on OpenSea, read{" "}
            <ExternalLink url="https://openseahelp.zendesk.com/hc/en-us/articles/1500010625362">
              our Help Center guide on this topic
            </ExternalLink>
            . If you have questions or concerns regarding this action, contact
            the OpenSea team <ExternalLink url={SUPPORT_URL}>here</ExternalLink>
            .
          </Text>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <ActionButton type="secondary" onClick={onClose}>
          Close
        </ActionButton>
      </Modal.Footer>
    </>
  )
}

export default DelistedNoticeModal
