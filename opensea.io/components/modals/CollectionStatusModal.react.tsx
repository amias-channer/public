import React from "react"
import Modal from "../../design-system/Modal"
import ExternalLink from "../common/ExternalLink.react"
import Panel from "../layout/Panel.react"

export type VerificationStatus =
  | "verified"
  | "mintable"
  | "safelisted"
  | "unapproved"

interface CollectionStatusModalProps {
  address?: string
  blockExplorerLink?: string
  verificationStatus: VerificationStatus
}

export const CollectionStatusModal = ({
  address,
  blockExplorerLink,
  verificationStatus,
}: CollectionStatusModalProps) => {
  return (
    <>
      <Modal.Header>
        <Modal.Title>What does this mean?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Panel
          icon="verified"
          iconColor="blue"
          mode={
            verificationStatus === "verified" ? "start-open" : "start-closed"
          }
          title="Verified Collection"
        >
          This collection is verified.
          <br />
          <br />
          In most cases, OpenSea verifies a collection when there is either
          uncommonly high traction around the project or it represents a
          well-known public brand. Projects with verified accounts on Instagram
          or Twitter are good candidates for this designation, but will not
          necessarily be verified by OpenSea.
          <br />
          <br />
          We no longer allow projects to request verification, but instead make
          this designation at our sole discretion.
          <br />
          <br />
          You should always do your own research, proceed with caution, and be
          certain that the contract address of the project is exactly what you
          expect, even when you're buying an asset on a verified collection.
          {verificationStatus === "verified" && address && blockExplorerLink ? (
            <>
              <br />
              <br />
              This token was minted on the smart contract at the address below:
              <br />
              <br />
              <ExternalLink target="_blank" url={blockExplorerLink}>
                {address}
              </ExternalLink>
            </>
          ) : null}
        </Panel>
        <br />
        <Panel
          icon="report"
          iconColor="yellow"
          iconTheme="outlined"
          mode={
            verificationStatus === "mintable" ? "start-open" : "start-closed"
          }
          title="Mintable Collection"
        >
          Mintable collections allow users to create their own digital items,
          which could include duplicate or fake versions of items from other
          projects. You should always do your own research, proceed with
          caution, and be certain that the smart contract address of the project
          is exactly what you expect.
          {verificationStatus === "mintable" && address && blockExplorerLink ? (
            <>
              <br />
              <br />
              This token was minted on the smart contract at the address below:
              <br />
              <br />
              <ExternalLink target="_blank" url={blockExplorerLink}>
                {address}
              </ExternalLink>
            </>
          ) : null}
        </Panel>
      </Modal.Body>
    </>
  )
}

export default CollectionStatusModal
