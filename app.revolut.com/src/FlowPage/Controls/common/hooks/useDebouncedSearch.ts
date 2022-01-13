import { useDebounce } from '@react-hook/debounce'
import { useState } from 'react'

const DEBOUNCED_SEARCH_TIMEOUT = 300

export const useDebouncedSearch = <T>(
  items: T[],
  searchFn: (items: T[], searchString: string) => T[],
) => {
  const [filterInputValue, setFilterInputValue] = useState('')
  const [filteredItems, setFilteredItems] = useDebounce(items, DEBOUNCED_SEARCH_TIMEOUT)

  const debouncedSearch = (value: string) => {
    setFilterInputValue(value)
    setFilteredItems(searchFn(items, value))
  }

  return { filterInputValue, filteredItems, debouncedSearch }
}
