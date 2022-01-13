import React from "react"
import styled from "styled-components"
import EnsActions from "../../actions/ens"
import Input from "../../design-system/Input"
import Modal from "../../design-system/Modal"
import { DCL_ENS_BASE_REGISTRAR_CONFIG, getAddress } from "../../lib/contracts"
import { EnsManualEntryModal_asset } from "../../lib/graphql/__generated__/EnsManualEntryModal_asset.graphql"
import { fragmentize, graphql } from "../../lib/graphql/graphql"
import { registrarAddressToDomain } from "../../lib/helpers/ens"
import ActionButton from "../common/ActionButton.react"
import Loading from "../common/Loading.react"

interface Props {
  asset: EnsManualEntryModal_asset
}

interface State {
  hasError: boolean
  isOpen: boolean
  name: string
  view: "input" | "wait" | "done"
}

class EnsManualEntryModal extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    isOpen: false,
    name: "",
    view: "input",
  }

  render() {
    const { isOpen, view } = this.state

    return (
      <DivContainer>
        <a>
          <div
            className="EnsManualEntryModal--cta"
            onClick={() => this.setState({ isOpen: true })}
          >
            I know the name
          </div>
        </a>
        <Modal isOpen={isOpen} onClose={() => this.setState({ isOpen: false })}>
          <>
            {view === "input"
              ? this.renderInputView()
              : view === "wait"
              ? this.renderWaitView()
              : this.renderDoneView()}
          </>
        </Modal>
      </DivContainer>
    )
  }

  renderInputView() {
    const { hasError, name } = this.state
    const { asset } = this.props
    const address = asset.assetContract.address

    const ensSubtype =
      getAddress(DCL_ENS_BASE_REGISTRAR_CONFIG) === address
        ? "Decentraland Name"
        : "ENS"
    const headerText = `Manual ${ensSubtype} Entry`
    const descriptionText = `Know the name associated with this ${ensSubtype} asset? Enter it here!`
    const domain = registrarAddressToDomain[address]

    return (
      <>
        <Modal.Header>
          <Modal.Title>{headerText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SectionDescription>{descriptionText}</SectionDescription>
          <Input
            endEnhancer={<span>{domain || ".eth"}</span>}
            name="name"
            placeholder="mydomain"
            required
            value={name}
            onChange={event =>
              this.setState({
                hasError: false,
                name: event.target && event.target.value,
              })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <ActionButton
            onClick={() => this.setState({ view: "wait" }, this.handleSubmit)}
          >
            Submit
          </ActionButton>

          {hasError && (
            <SectionError>
              Error: The provided name did not match this ENS asset.
            </SectionError>
          )}
        </Modal.Footer>
      </>
    )
  }

  renderWaitView() {
    return (
      <>
        <Modal.Header>
          <Modal.Title>Verifying name...</Modal.Title>
        </Modal.Header>

        <Modal.Body display="flex" justifyContent="center">
          <Loading />
        </Modal.Body>
      </>
    )
  }

  renderDoneView() {
    return (
      <>
        <Modal.Header>
          <Modal.Title>It's a match! Reloading...</Modal.Title>
        </Modal.Header>

        <Modal.Body display="flex" justifyContent="center">
          <Loading />
        </Modal.Body>
      </>
    )
  }

  handleSubmit = async () => {
    const { asset } = this.props
    const { name } = this.state
    const domain = registrarAddressToDomain[asset.assetContract.address]
    const fullAssertedName = `${name}${domain || ".eth"}`
    try {
      const { tokenId } = await EnsActions.getAsset(fullAssertedName)
      if (tokenId !== asset.tokenId) {
        throw new Error("Invalid asset ID")
      }
      this.setState({ view: "done" }, () =>
        setTimeout(() => location.reload(true), 1000),
      )
    } catch {
      this.setState({
        hasError: true,
        view: "input",
      })
    }
  }
}

export default fragmentize(EnsManualEntryModal, {
  fragments: {
    data: graphql`
      fragment EnsManualEntryModal_asset on AssetType {
        assetContract {
          address
        }
        tokenId
      }
    `,
  },
})

const DivContainer = styled.div`
  .EnsManualEntryModal--cta {
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
  }
`

const SectionDescription = styled.section`
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 20px;
  text-align: center;
`

const SectionError = styled.div`
  margin-top: 8px;
  text-align: center;
  color: red;
  font-size: 12px;
`
