import React from "react"
import styled from "styled-components"
import {
  ChainIdentifier,
  CHAIN_IDENTIFIERS_TO_NAMES,
  CHAIN_IDENTIFIER_INFORMATION,
} from "../../../constants"
import { useTranslations } from "../../../hooks/useTranslations"
import { selectClassNames } from "../../../lib/helpers/styling"
import { getChainIdentifiers } from "../../../store"
import Image from "../../common/Image.react"
import Panel from "../../layout/Panel.react"
import Scrollbox from "../../layout/Scrollbox.react"

interface Props {
  activeChains: ChainIdentifier[]
  className?: string
  setChains: (values?: ChainIdentifier[]) => unknown
}

const ChainFilter = ({ activeChains, className, setChains }: Props) => {
  const { tr } = useTranslations()

  const items = getChainIdentifiers().map(chain => {
    const isSelected = activeChains.includes(chain)

    return [
      <div
        className="ChainFilter--item"
        key={chain}
        onClick={() => {
          const newChains = isSelected
            ? activeChains.filter((s: ChainIdentifier) => s !== chain)
            : [...activeChains, chain]
          setChains(newChains.length ? newChains : undefined)
        }}
      >
        <div
          className={selectClassNames("ChainFilter", {
            "image-container": true,
            isSelected,
          })}
        >
          <Image
            className="ChainFilter--image"
            size={32}
            sizing="cover"
            url={
              isSelected
                ? "/static/images/checkmark.svg"
                : CHAIN_IDENTIFIER_INFORMATION[chain].logo
            }
            variant="round"
          />
        </div>
        <div className="ChainFilter--chain">
          {CHAIN_IDENTIFIERS_TO_NAMES[chain]}
        </div>
      </div>,
    ]
  })

  return (
    <DivContainer className={className}>
      <Panel mode="start-closed" title={tr("Chains")}>
        <Scrollbox className="ChainFilter--results" theme="dark">
          {items}
        </Scrollbox>
      </Panel>
    </DivContainer>
  )
}

export default ChainFilter

const DivContainer = styled.div`
  .ChainFilter--item {
    align-items: center;
    display: flex;
    height: 40px;
    padding: 0 8px;
    cursor: pointer;

    .ChainFilter--chain {
      margin-left: 8px;
    }

    .ChainFilter--image-container {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid ${props => props.theme.colors.border};

      &.ChainFilter--isSelected {
        padding: 8px;
      }
    }

    @media (hover: hover) {
      &:hover {
        color: ${props => props.theme.colors.text.on.background};
        .ChainFilter--image-container {
          transform: scale(1.1);
        }
      }
    }
  }

  .ChainFilter--results {
    max-height: 200px;
  }
`
