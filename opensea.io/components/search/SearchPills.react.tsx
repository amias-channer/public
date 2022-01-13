import React from "react"
import styled, { css } from "styled-components"
import Modal, { ModalProps } from "../../design-system/Modal"
import UnstyledButton from "../../design-system/UnstyledButton"
import useAppContext from "../../hooks/useAppContext"
import { useTranslations } from "../../hooks/useTranslations"
import Tr from "../../i18n/Tr.react"
import { SearchPills_data } from "../../lib/graphql/__generated__/SearchPills_data.graphql"
import { fragmentize, getNodes, graphql } from "../../lib/graphql/graphql"
import { flatMap } from "../../lib/helpers/array"
import guid from "../../lib/helpers/guid"
import { appendClassName, selectClassNames } from "../../lib/helpers/styling"
import Icon, { MaterialIcon } from "../common/Icon.react"
import Image from "../common/Image.react"
import { sizeMQ } from "../common/MediaQuery.react"
import CollectionModalContent from "../modals/CollectionModalContent.react"
import Pill from "../v2/Pill.react"

export interface Props {
  collections: string[]
  data: SearchPills_data | null
  items?: Item[]
  pillClassName?: string
  resultCount?: number
  onDeleteCollection: (slug: string) => unknown
  onClear: () => unknown
  style?: React.CSSProperties
  showResultCount?: boolean
}

export interface Item {
  label: React.ReactNode
  imageUrl?: string
  icon?: MaterialIcon
  renderModal?: ModalProps["children"]
  onDelete: () => unknown
  onClick?: () => unknown
}

const SearchPills = ({
  collections,
  onClear,
  data,
  items,
  onDeleteCollection,
  pillClassName,
  resultCount,
  style,
  showResultCount = true,
}: Props) => {
  const { isEmbedded } = useAppContext()
  const { tr } = useTranslations()

  // On embed mode, we want to hide all of the collection pills
  const collectionItems = isEmbedded
    ? []
    : flatMap(collections ?? [], (slug): Item[] => {
        const collection = getNodes(data?.selectedCollections).find(
          c => c.slug === slug,
        )

        if (!collection) {
          return []
        }

        const { imageUrl, name } = collection
        const renderModal = () => <CollectionModalContent data={collection} />
        return [
          {
            imageUrl: imageUrl || undefined,
            label: name,
            onDelete: () => onDeleteCollection(slug),
            renderModal,
          },
        ]
      })

  const allItems = [...collectionItems, ...(items || [])]

  return (
    <DivContainer
      className={selectClassNames("SearchPills", {
        hasContent: !!(!resultCount && allItems.length),
      })}
      data-testid="search-pills"
      style={style}
    >
      {showResultCount && resultCount ? (
        <div className="SearchPills--result-count-wrapper">
          <div className="SearchPills--result-count">
            {resultCount !== undefined ? (
              <>
                {resultCount.toLocaleString()}
                <Tr> results</Tr>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
      {allItems.map(
        ({ label, imageUrl, icon, renderModal, onClick, onDelete }) => {
          const pillContent = (
            <div
              className={appendClassName(
                "SearchPills--pill-content",
                renderModal || onClick ? "SearchPills--clickable-media" : "",
              )}
            >
              {imageUrl ? (
                <Image
                  className={"SearchPills--img"}
                  size={32}
                  sizing="cover"
                  url={imageUrl}
                  onClick={onClick}
                />
              ) : icon ? (
                <Icon
                  className={"SearchPills--icon"}
                  value={icon}
                  onClick={onClick}
                />
              ) : null}

              <span
                className={imageUrl || icon ? "SearchPills--pill-name" : ""}
              >
                {label}
              </span>
            </div>
          )

          return (
            <Pill
              className={appendClassName("SearchPills--pill", pillClassName)}
              key={typeof label === "string" ? label : guid()}
              scopeDeleteToIcon={renderModal !== undefined}
              variant="secondary"
              onDelete={onDelete}
            >
              {renderModal ? (
                <Modal
                  trigger={open => (
                    <UnstyledButton style={{ display: "flex" }} onClick={open}>
                      {pillContent}
                    </UnstyledButton>
                  )}
                >
                  {renderModal}
                </Modal>
              ) : (
                pillContent
              )}
            </Pill>
          )
        },
      )}
      {allItems.length ? (
        <div className="SearchPills--clear-wrapper" onClick={onClear}>
          <div className="SearchPills--clear">{tr("Clear All")}</div>
        </div>
      ) : null}
    </DivContainer>
  )
}

export default fragmentize(SearchPills, {
  fragments: {
    data: graphql`
      fragment SearchPills_data on Query
      @argumentDefinitions(collections: { type: "[CollectionSlug!]" }) {
        selectedCollections: collections(
          first: 25
          collections: $collections
          includeHidden: true
        ) {
          edges {
            node {
              imageUrl
              name
              slug
              ...CollectionModalContent_data
            }
          }
        }
      }
    `,
  },
})

const DivContainer = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;

  &.SearchPills--hasContent {
    padding: 0;
  }

  .SearchPills--pill {
    margin-bottom: 10px;
    margin-right: 10px;

    .SearchPills--pill-content {
      display: flex;
      align-items: center;
    }

    .SearchPills--img {
      border-radius: 16px;
      height: 32px;
      width: 32px;
      border: 1px solid ${props => props.theme.colors.border};
    }

    .SearchPills--icon,
    .SearchPills--img {
      margin-right: 8px;
    }

    .SearchPills--clickable-media {
      cursor: pointer;
    }
  }

  .SearchPills--clear-wrapper {
    .SearchPills--clear {
      align-items: center;
      color: ${props => props.theme.colors.primary};
      cursor: pointer;
      display: flex;
      opacity: 0.9;

      @media (hover: hover) {
        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .SearchPills--clear-wrapper,
  .SearchPills--result-count-wrapper,
  .SearchPills--pill {
    display: none;
  }

  ${sizeMQ({
    small: css`
      .SearchPills--clear-wrapper,
      .SearchPills--result-count-wrapper,
      .SearchPills--pill {
        display: flex;
        margin-bottom: 10px;
        margin-right: 10px;
      }
    `,
  })}
`
