import React from "react"
import Select, { SelectOption } from "../../../design-system/Select"
import Auth from "../../../lib/auth"
import { SearchSortBy } from "../../../lib/graphql/__generated__/AssetSearchQuery.graphql"

interface Sort {
  sortAscending: boolean
  sortBy: SearchSortBy
}

const SORTS: Sort[] = [
  { sortAscending: false, sortBy: "LISTING_DATE" },
  { sortAscending: false, sortBy: "CREATED_DATE" },
  { sortAscending: false, sortBy: "LAST_SALE_DATE" },
  { sortAscending: false, sortBy: "LAST_TRANSFER_DATE" },
  { sortAscending: true, sortBy: "EXPIRATION_DATE" },
  { sortAscending: true, sortBy: "PRICE" },
  { sortAscending: false, sortBy: "PRICE" },
  { sortAscending: false, sortBy: "LAST_SALE_PRICE" },
  { sortAscending: false, sortBy: "VIEWER_COUNT" },
  { sortAscending: false, sortBy: "FAVORITE_COUNT" },
  { sortAscending: true, sortBy: "CREATED_DATE" },
]

const STAFF_SORTS: Sort[] = [
  { sortAscending: false, sortBy: "STAFF_SORT_1" },
  { sortAscending: false, sortBy: "STAFF_SORT_2" },
  { sortAscending: false, sortBy: "STAFF_SORT_3" },
]

const SORT_LABELS: Record<SearchSortBy, [string, string]> = {
  BIRTH_DATE: ["Oldest", "Recently Created"],
  CREATED_DATE: ["Oldest", "Recently Created"],
  EXPIRATION_DATE: ["Ending Soon", "Ending Latest"],
  LISTING_DATE: ["Listed: Oldest", "Recently Listed"],
  PRICE: ["Price: Low to High", "Price: High to Low"],
  UNIT_PRICE: ["Lowest Token Price", "Highest Token Price"],
  LAST_SALE_DATE: ["Sold Longest Ago", "Recently Sold"],
  LAST_SALE_PRICE: ["Lowest Last Sale", "Highest Last Sale"],
  LAST_TRANSFER_DATE: ["Least Recently Transferred", "Recently Received"],
  VIEWER_COUNT: ["Fewest Viewers", "Most Viewed"],
  SALE_COUNT: ["Fewest Sales", "Most Sales"],
  FAVORITE_COUNT: ["Least Favorited", "Most Favorited"],
  STAFF_SORT_1: ["Rev Staff Sort 1", "Staff Sort 1"],
  STAFF_SORT_2: ["Rev Staff Sort 2", "Staff Sort 2"],
  STAFF_SORT_3: ["Rev Staff Sort 3", "Staff Sort 3"],
  "%future added value": ["", ""],
}

interface Props {
  setSort: (sort: Sort) => unknown
  sort?: Partial<Sort>
  sortOptions: SearchSortBy[]
  style?: React.CSSProperties
  isStaff?: boolean
}

const getLabel = (sort?: Partial<Sort>): string =>
  sort && sort.sortBy
    ? SORT_LABELS[sort.sortBy][sort.sortAscending ? 0 : 1]
    : "Sort by"

type SortBySelectOption = SelectOption<SearchSortBy> & {
  isStaff?: boolean
  sortAscending?: boolean
}

const mapSortToOption = (sort: Partial<Sort>): SortBySelectOption => {
  const label = getLabel(sort)
  return {
    value: sort.sortBy!,
    label,
    key: label,
    sortAscending: sort.sortAscending,
  }
}

const AssetSearchSortDropdown = ({
  setSort,
  sort,
  sortOptions,
  style,
  isStaff,
}: Props) => {
  const options = (isStaff ? [...STAFF_SORTS, ...SORTS] : SORTS)
    .filter(
      s =>
        (s.sortAscending !== !!sort?.sortAscending ||
          s.sortBy !== sort?.sortBy) &&
        s.sortBy &&
        sortOptions.includes(s.sortBy),
    )
    .map(mapSortToOption)

  const setSortWithOption = (option: SortBySelectOption) => {
    setSort({
      sortBy: option.value,
      sortAscending: option.sortAscending ?? false,
    })
  }

  const setStaffSortWithOption = async (option: SortBySelectOption) => {
    await Auth.UNSAFE_login()
    setSortWithOption(option)
  }

  return (
    <Select
      clearable={false}
      options={options}
      placeholder="Sort by"
      readOnly
      style={style}
      value={sort?.sortBy ? mapSortToOption(sort) : undefined}
      onSelect={option => {
        if (option) {
          STAFF_SORTS.map(s => s.sortBy).includes(option.value)
            ? setStaffSortWithOption(option)
            : setSortWithOption(option)
        }
      }}
    />
  )
}
export default AssetSearchSortDropdown
