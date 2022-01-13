import React from "react"
import Select, { SelectOption } from "../../../design-system/Select"
import { SearchResultModel } from "../../../lib/graphql/__generated__/AssetSearchQuery.graphql"

const OPTIONS: SelectOption<SearchResultModel | "ALL">[] = [
  { label: "All items", value: "ALL" },
  { label: "Single Items", value: "ASSETS" },
  { label: "Bundles", value: "BUNDLES" },
]

interface Props {
  style?: React.CSSProperties
  model?: SearchResultModel
  setModel: (model?: SearchResultModel) => unknown
}

const AssetSearchModelDropdown = ({ model, setModel, style }: Props) => {
  return (
    <Select
      clearable={false}
      excludeSelectedOption
      options={OPTIONS}
      readOnly
      style={style}
      value={OPTIONS.find(o => o.value === model) ?? OPTIONS[0]}
      onSelect={option =>
        setModel(option?.value === "ALL" ? undefined : option?.value)
      }
    />
  )
}

export default AssetSearchModelDropdown
