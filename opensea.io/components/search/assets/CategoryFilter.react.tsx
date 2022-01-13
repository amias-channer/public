import React from "react"
import styled from "styled-components"
import { CATEGORIES } from "../../../constants"
import { useTheme } from "../../../design-system/Context/ThemeContext"
import { useTranslations } from "../../../hooks/useTranslations"
import { selectClassNames } from "../../../lib/helpers/styling"
import Image from "../../common/Image.react"
import Panel from "../../layout/Panel.react"
import Scrollbox from "../../layout/Scrollbox.react"

export interface Props {
  selectedCategory?: string
  className?: string
  setCategoryFilter: (slug: string) => unknown
}

interface ItemProps {
  className?: string
  imageUrl?: string
  isActive?: boolean
  name: string
  onClick?: () => void
}

const Item = ({ imageUrl, isActive, name, onClick }: ItemProps) => {
  return (
    <div
      className={selectClassNames("CategoryFilter", {
        isActive,
        item: true,
      })}
      onClick={onClick}
    >
      <Image
        className="CategoryFilter--item-image"
        size={32}
        sizing="cover"
        url={isActive ? "/static/images/checkmark.svg" : imageUrl}
        variant="round"
      />
      <div className="CategoryFilter--name">{name}</div>
    </div>
  )
}

const CategoryFilter = ({
  selectedCategory,
  className,
  setCategoryFilter,
}: Props) => {
  const { theme } = useTheme()
  const { tr } = useTranslations()

  const items = CATEGORIES.map(category => {
    return (
      <Item
        imageUrl={`/static/images/icons/${category.slug}-${theme}.svg`}
        isActive={category.slug === selectedCategory}
        key={category.slug}
        name={category.name}
        onClick={() => setCategoryFilter(category.slug)}
      />
    )
  })

  return (
    <DivContainer className={className}>
      <Panel mode="start-closed" title={tr("Categories")}>
        <Scrollbox className="CategoryFilter--panel" theme="dark">
          {items}
        </Scrollbox>
      </Panel>
    </DivContainer>
  )
}

export default React.memo(CategoryFilter)

const DivContainer = styled.div`
  position: relative;
  display: block;
  z-index: 4;
  width: 100%;

  .CategoryFilter--panel {
    max-height: 220px;
    overflow: auto;
  }

  .CategoryFilter--item {
    align-items: center;
    color: ${props => props.theme.colors.text.body};
    cursor: pointer;
    display: flex;
    height: 40px;
    padding: 0 8px;

    .CategoryFilter--item-image {
      min-width: 32px;
      border: 1px solid ${props => props.theme.colors.border};
    }

    &.CategoryFilter--isActive {
      .CategoryFilter--item-image {
        background-color: ${props => props.theme.colors.surface};
        opacity: 1;
        padding: 8px;
      }
    }

    @media (hover: hover) {
      &:hover {
        color: ${props => props.theme.colors.text.on.background};
        .CategoryFilter--item-image {
          transform: scale(1.1);
        }
      }
    }

    .CategoryFilter--name {
      font-weight: 400;
      margin-left: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`
