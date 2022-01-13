import React from "react"
import ReactMarkdown from "react-markdown"
import styled from "styled-components"
import Modal from "../../design-system/Modal"
import Skeleton from "../../design-system/Skeleton"
import Text from "../../design-system/Text"
import useAppContext from "../../hooks/useAppContext"
import { UnlockableContentModalQuery } from "../../lib/graphql/__generated__/UnlockableContentModalQuery.graphql"
import { graphql, GraphQLProps } from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import ActionButton from "../common/ActionButton.react"
import Icon from "../common/Icon.react"
import { VerticalAligned } from "../common/VerticalAligned.react"

type UnlockableContentProps = {
  onClose: () => void
}

class UnlockableContent extends GraphQLComponent<
  UnlockableContentModalQuery,
  UnlockableContentProps
> {
  render() {
    const {
      data,
      onClose,
      variables: { isOwner },
    } = this.props
    const unlockableContent = data?.archetype?.asset?.unlockableContent

    return (
      <>
        <Modal.Header>
          <Modal.Title>Unlockable Content</Modal.Title>
        </Modal.Header>

        <StyledBody>
          <div className="UnlockableContent--content">
            {!data || !unlockableContent ? (
              <Skeleton>
                <Skeleton.Line variant="full" />
                <Skeleton.Line variant="full" />
                <Skeleton.Line variant="full" />
                <Skeleton.Line variant="full" />
              </Skeleton>
            ) : (
              <ReactMarkdown linkTarget="_blank">
                {unlockableContent}
              </ReactMarkdown>
            )}
          </div>

          {!isOwner ? (
            <Text variant="small">
              This content can only be unlocked and revealed by the owner of
              this item.
            </Text>
          ) : null}
        </StyledBody>

        <Modal.Footer>
          <ActionButton type="secondary" onClick={onClose}>
            Close
          </ActionButton>
        </Modal.Footer>
      </>
    )
  }
}

const StyledBody = styled(Modal.Body)`
  .UnlockableContent--content {
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 5px;
    padding: 18px;
    overflow: auto;
  }
`

export type Props = {
  className?: string
} & Pick<GraphQLProps<UnlockableContentModalQuery>, "variables">

const UnlockableContentModal = ({ variables }: Props) => {
  const { login } = useAppContext()
  const { isOwner } = variables

  const handleOpen = (open: () => unknown) => async () => {
    if (isOwner) {
      await login()
    }
    open()
  }

  return (
    <Modal
      trigger={open => (
        <UnlockableContentModalDivContainer onClick={handleOpen(open)}>
          <Icon color={"purple"} value={isOwner ? "lock_open" : "lock"} />
          <VerticalAligned style={{ marginLeft: "8px" }}>
            {isOwner ? (
              <Text as="span" className="UnlockableContentModal--magic-text">
                Reveal unlockable content
              </Text>
            ) : (
              <Text as="span">
                Includes{" "}
                <span className="UnlockableContentModal--magic-text">
                  unlockable content
                </span>
              </Text>
            )}
          </VerticalAligned>
        </UnlockableContentModalDivContainer>
      )}
    >
      {onClose =>
        withData<UnlockableContentModalQuery, UnlockableContentProps>(
          UnlockableContent,
          graphql`
            query UnlockableContentModalQuery(
              $archetype: ArchetypeInputType!
              $isOwner: Boolean!
            ) {
              archetype(archetype: $archetype) @include(if: $isOwner) {
                asset {
                  unlockableContent(identity: {})
                }
              }
            }
          `,
        )({ onClose, variables })
      }
    </Modal>
  )
}

export default UnlockableContentModal

const UnlockableContentModalDivContainer = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 5px;
  padding: 16px;
  cursor: pointer;
  width: 100%;

  .UnlockableContentModal--magic-text {
    color: ${props => props.theme.colors.octopus};
    font-weight: 500;
  }
`
