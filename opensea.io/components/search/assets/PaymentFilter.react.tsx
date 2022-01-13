import React from "react"
import _ from "lodash"
import styled from "styled-components"
import AppComponent from "../../../AppComponent.react"
import ScrollingPaginator from "../../../design-system/ScrollingPaginator"
import { PaymentFilter_data } from "../../../lib/graphql/__generated__/PaymentFilter_data.graphql"
import { PaymentFilterQuery } from "../../../lib/graphql/__generated__/PaymentFilterQuery.graphql"
import {
  getNodes,
  graphql,
  paginate,
  PaginationProps,
} from "../../../lib/graphql/graphql"
import { OrderedSet } from "../../../lib/helpers/array"
import throttle from "../../../lib/helpers/throttle"
import Panel from "../../layout/Panel.react"
import Scrollbox from "../../layout/Scrollbox.react"
import SearchInput from "../SearchInput.react"

const PAGE_SIZE = 10

interface Props {
  activeSymbols: string[]
  className?: string
  data: PaymentFilter_data | null
  setPaymentAssets: (values?: string[]) => unknown
}

interface State {
  symbolSubstring: string
}

class PaymentFilter extends AppComponent<
  Props & PaginationProps<PaymentFilterQuery>,
  State
> {
  state: State = {
    symbolSubstring: "",
  }

  fetch = throttle(() => {
    const { refetch } = this.props
    const { symbolSubstring } = this.state
    refetch(PAGE_SIZE, { symbolSubstring: symbolSubstring || undefined })
  })

  search = (symbolSubstring: string) => {
    this.setState({ symbolSubstring }, () =>
      this.fetch(undefined, { force: !symbolSubstring }),
    )
  }

  render() {
    const { activeSymbols, className, data, page, setPaymentAssets } =
      this.props
    const { symbolSubstring } = this.state
    const collection = data?.PaymentFilter_collection
    const rawPaymentAssets = collection
      ? collection.paymentAssets
      : getNodes(data?.paymentAssets)

    const paymentAssets = new OrderedSet(
      paymentAsset => paymentAsset.symbol,
      rawPaymentAssets,
    ).elements

    const sortedSymbols = _.sortBy(paymentAssets.map(p => p.symbol).sort(), [
      s => s && !["WETH", "ETH"].includes(s),
    ])

    const items = sortedSymbols.map(symbol => {
      // This does the filtering within the dropdown.
      if (
        !symbol ||
        !symbol.toLowerCase().includes(symbolSubstring.toLowerCase())
      ) {
        return []
      }
      // Shows a checkmark next to the ticker if it's selected.
      const checked = activeSymbols.includes(symbol)

      return [
        <div
          className="PaymentFilter--item"
          key={symbol}
          onClick={() => {
            const newSymbols = checked
              ? // If it's already checked, remove it.
                activeSymbols.filter((s: string) => s !== symbol)
              : // If it's not already checked, add it.
                [...activeSymbols, symbol]
            this.setState({ symbolSubstring: "" }, () =>
              setPaymentAssets(newSymbols.length ? newSymbols : undefined),
            )
          }}
        >
          <input
            checked={checked}
            className="PaymentFilter--checkbox"
            readOnly
            type="checkbox"
          />
          <div className="PaymentFilter--symbol">{symbol}</div>
        </div>,
      ]
    })

    return (
      <DivContainer className={className}>
        <Panel mode={"start-closed"} title={this.tr("On Sale In")}>
          {collection ? (
            <Scrollbox className="PaymentFilter--results" theme="dark">
              {items}
            </Scrollbox>
          ) : (
            <>
              <SearchInput
                className="PaymentFilter--search"
                placeholder="Filter"
                query={symbolSubstring}
                onChange={this.search}
              />
              <Scrollbox className="PaymentFilter--results" theme="dark">
                {items}
                {!collection ? (
                  <ScrollingPaginator
                    intersectionOptions={{ rootMargin: "512px" }}
                    page={page}
                    size={PAGE_SIZE}
                  />
                ) : null}
              </Scrollbox>
            </>
          )}
        </Panel>
      </DivContainer>
    )
  }
}

export default paginate<PaymentFilterQuery, Props>(PaymentFilter, {
  fragments: {
    data: graphql`
      fragment PaymentFilter_data on Query
      @argumentDefinitions(
        collection: { type: "CollectionSlug" }
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        symbolSubstring: { type: "String" }
      ) {
        paymentAssets(
          after: $cursor
          asset_Symbol_Icontains: $symbolSubstring
          first: $count
        ) @connection(key: "PaymentFilter_paymentAssets") {
          edges {
            node {
              symbol
              relayId
            }
          }
        }
        PaymentFilter_collection: collection(collection: $collection) {
          paymentAssets {
            symbol
            relayId
          }
        }
      }
    `,
  },
  query: graphql`
    query PaymentFilterQuery(
      $collection: CollectionSlug
      $count: Int
      $cursor: String
      $symbolSubstring: String
    ) {
      query {
        ...PaymentFilter_data
          @arguments(
            collection: $collection
            count: $count
            cursor: $cursor
            symbolSubstring: $symbolSubstring
          )
      }
    }
  `,
})

const DivContainer = styled.div`
  .PaymentFilter--search {
    margin-bottom: 5px;
  }

  .PaymentFilter--item {
    align-items: center;
    display: flex;
    height: 40px;
    padding: 10px 2px;
    cursor: pointer;

    .PaymentFilter--symbol {
      color: ${props => props.theme.colors.text.body};
      margin-left: 8px;
    }
  }

  .PaymentFilter--results {
    max-height: 200px;
  }
`
