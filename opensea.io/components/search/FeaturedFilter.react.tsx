import React from "react"
import styled from "styled-components"
import Tr from "../../i18n/Tr.react"
import { selectClassNames } from "../../lib/helpers/styling"
import { themeVariant } from "../../styles/styleUtils"
import Panel from "../layout/Panel.react"

export interface Item<T> {
  filter: T
  label: string
}

interface Props<T> {
  className?: string
  setFilters: (filters?: T[]) => unknown
  filters: T[]
  possibleFilterItems: Item<T>[]
  title: string
}

const FeaturedFilter = <T,>({
  className,
  setFilters,
  filters,
  possibleFilterItems,
  title,
}: Props<T>) => (
  <DivContainer className={className}>
    <Panel
      bodyClassName="FeaturedFilter--items"
      mode="start-open"
      title={<Tr>{title}</Tr>}
    >
      {possibleFilterItems.map(({ filter, label }) => {
        const isSelected = filters.includes(filter)
        return (
          <div
            className={selectClassNames("FeaturedFilter", {
              item: true,
              isSelected,
            })}
            key={label}
            onClick={() => {
              const newFilters = isSelected
                ? filters.filter(f => f !== filter)
                : [...filters, filter]
              setFilters(newFilters.length ? newFilters : undefined)
            }}
          >
            <Tr>{label}</Tr>
          </div>
        )
      })}
    </Panel>
  </DivContainer>
)
export default FeaturedFilter

const DivContainer = styled.div`
  font-weight: 500;
  user-select: none;

  .FeaturedFilter--items {
    display: flex;
    flex-flow: wrap;

    .FeaturedFilter--item {
      align-items: center;
      border: 1px solid ${props => props.theme.colors.border};
      border-radius: 5px;
      font-weight: 400px;
      color: ${props => props.theme.colors.text.body};
      background-color: ${props => props.theme.colors.input};
      display: flex;
      height: 40px;
      margin: 4px;
      padding: 10px;
      width: calc(50% - 8px);
      cursor: pointer;

      &.FeaturedFilter--isSelected {
        color: ${props => props.theme.colors.text.on.primary};
        background-color: ${props => props.theme.colors.primary};
        border-color: ${props => props.theme.colors.primary};
      }

      &:hover {
        box-shadow: ${props => props.theme.shadow};
        transition: 0.2s;

        ${props =>
          themeVariant({
            variants: { dark: { backgroundColor: props.theme.colors.ash } },
          })}
      }
    }
  }
`
