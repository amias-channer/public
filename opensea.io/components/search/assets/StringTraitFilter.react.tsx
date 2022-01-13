import React, { useState } from "react"
import _ from "lodash"
import { useFragment } from "react-relay"
import styled from "styled-components"
import { StringTraitFilter_data$key } from "../../../lib/graphql/__generated__/StringTraitFilter_data.graphql"
import { graphql } from "../../../lib/graphql/graphql"
import { flatMap } from "../../../lib/helpers/array"
import { snakeCaseToSentenceCase } from "../../../lib/helpers/stringUtils"
import Panel from "../../layout/Panel.react"
import Scrollbox from "../../layout/Scrollbox.react"
import SearchInput from "../SearchInput.react"

const MAX_SCROLLBOX_SIZE = 5

interface Props {
  className?: string
  data: StringTraitFilter_data$key
  hideCounts?: boolean
  setValues: (values?: string[]) => unknown
  values: string[]
}

const StringTraitFilter = ({
  className,
  data: dataKey,
  setValues,
  hideCounts,
  values,
}: Props) => {
  const [query, setQuery] = useState("")

  const data = useFragment(
    graphql`
      fragment StringTraitFilter_data on StringTraitType {
        counts {
          count
          value
        }
        key
      }
    `,
    dataKey,
  )

  const valueSet = new Set(values)
  const items = flatMap(
    _.orderBy(data.counts, ["count", "value"], ["desc", "asc"]),
    ({ count, value }) => {
      if (!value.toLowerCase().includes(query.toLowerCase())) {
        return []
      }
      const checked = valueSet.has(value)
      return [
        <div
          className="StringTraitFilter--item"
          key={value}
          onClick={() => {
            const newValues = checked
              ? values.filter(v => v !== value)
              : [...values, value]
            setValues(newValues.length ? newValues : undefined)
          }}
        >
          <input
            checked={checked}
            className="StringTraitFilter--checkbox"
            readOnly
            type="checkbox"
          />
          <div className="StringTraitFilter--value">
            {snakeCaseToSentenceCase(value)}
          </div>
          {hideCounts ? null : (
            <div className="StringTraitFilter--count">{count}</div>
          )}
        </div>,
      ]
    },
  )
  return (
    <DivContainer className={className}>
      <Panel
        icon="list"
        mode="start-closed"
        title={snakeCaseToSentenceCase(data.key)}
      >
        {data.counts.length <= MAX_SCROLLBOX_SIZE ? (
          items
        ) : (
          <>
            <SearchInput
              className="StringTraitFilter--search"
              placeholder="Filter"
              query={query}
              onChange={q => setQuery(q)}
            />
            <Scrollbox className="StringTraitFilter--results" theme="dark">
              {items}
            </Scrollbox>
          </>
        )}
      </Panel>
    </DivContainer>
  )
}

export default StringTraitFilter

const DivContainer = styled.div`
  .StringTraitFilter--search {
    margin-bottom: 5px;
  }

  .StringTraitFilter--item {
    align-items: center;
    display: flex;
    height: 40px;
    padding: 10px 2px;
    cursor: pointer;

    .StringTraitFilter--value {
      color: ${props => props.theme.colors.text.body};
      margin-left: 8px;
    }

    .StringTraitFilter--count {
      color: ${props => props.theme.colors.text.body};
      margin-left: auto;
    }
  }

  .StringTraitFilter--results {
    height: calc(40px * ${MAX_SCROLLBOX_SIZE});
  }
`
