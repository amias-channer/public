import React from "react"
import { useFragment } from "react-relay"
import styled from "styled-components"
import { Dropdown } from "../../design-system/Dropdown"
import Flex from "../../design-system/Flex"
import UnstyledButton from "../../design-system/UnstyledButton"
import { CollectionCardContextMenu_data$key } from "../../lib/graphql/__generated__/CollectionCardContextMenu_data.graphql"
import { graphql } from "../../lib/graphql/graphql"
import {
  getCollectionRoyaltiesUrl,
  getCollectionEditUrl,
} from "../../lib/helpers/collection"
import CenterAligned from "../common/CenterAligned.react"
import Icon from "../common/Icon.react"
getCollectionRoyaltiesUrl

type Props = {
  dataKey: CollectionCardContextMenu_data$key
}

const CollectionCardContextMenu = ({ dataKey }: Props) => {
  const data = useFragment(
    graphql`
      fragment CollectionCardContextMenu_data on CollectionType {
        ...collection_url
      }
    `,
    dataKey,
  )

  return (
    <Flex position="absolute" right="12px" top="12px">
      <Dropdown
        content={({ List, Item }) => (
          <List>
            <ItemContainer>
              <Item href={getCollectionEditUrl(data)}>
                <Item.Avatar icon="edit" />
                <Item.Content>
                  <Item.Title>Edit</Item.Title>
                </Item.Content>
              </Item>
            </ItemContainer>
            <ItemContainer>
              <Item href={getCollectionRoyaltiesUrl(data)}>
                <Item.Avatar icon="view_list" />
                <Item.Content>
                  <Item.Title>Royalties</Item.Title>
                </Item.Content>
              </Item>
            </ItemContainer>
          </List>
        )}
        placement="bottom-end"
      >
        <Container>
          <UnstyledButton
            onClick={event => {
              event.stopPropagation()
              event.preventDefault()
            }}
          >
            <Icon aria-label="More" value="more_vert" />
          </UnstyledButton>
        </Container>
      </Dropdown>
    </Flex>
  )
}

const ItemContainer = styled.div`
  opacity: 0.85;
  :hover {
    opacity: 1;
  }
`

const Container = styled(CenterAligned)`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.default};
  color: ${props => props.theme.colors.text.body};
  overflow: hidden;
  opacity: 0.9;
  padding: 4px;
  &:hover {
    box-shadow: ${props => props.theme.shadow};
    opacity: 1;
  }
`

export default CollectionCardContextMenu
