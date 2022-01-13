import React, { useCallback, useEffect, useRef, useState } from "react"
import { debounce, DebouncedFunc } from "lodash"
import { useUpdate } from "react-use"
import { Promiseable } from "../../lib/helpers/promise"
import Select, {
  LoadingConfiguration,
  SelectOption,
  SelectProps,
} from "../Select"

const DEBOUNCE_DELAY = 300

type Cache = Record<string, ReadonlyArray<SelectOption> | undefined>

export type AsyncSelectProps = {
  loadingConfiguration?: LoadingConfiguration
  useCache?: boolean
  search: (query: string) => Promiseable<ReadonlyArray<SelectOption>>
} & Pick<
  SelectProps,
  | "value"
  | "onSelect"
  | "placeholder"
  | "startEnhancer"
  | "clearable"
  | "id"
  | "name"
>

const searchFilter = () => true

export const AsyncSelect = ({
  loadingConfiguration,
  value,
  useCache = true,
  search,
  ...rest
}: AsyncSelectProps) => {
  const [isLoading, setIsLoading] = useState<SelectProps["isLoading"]>(false)
  const cacheRef = useRef<Cache>({})
  const handleSearchDebouncedRef = useRef<DebouncedFunc<typeof handleSearch>>()
  const queryRef = useRef("")

  const forceUpdate = useUpdate()

  const handleSearch = useCallback(
    async (query: string) => {
      queryRef.current = query

      // Use cached results, if applicable.
      if (useCache && cacheRef.current[query]) {
        // Re-render the component with the cached results.
        forceUpdate()
        return
      }

      setIsLoading(loadingConfiguration ?? true)

      const results = await search(query)
      cacheRef.current[query] = results

      setIsLoading(false)
    },
    [forceUpdate, search, useCache, loadingConfiguration],
  )

  // Set the debounced search function.
  useEffect(() => {
    handleSearchDebouncedRef.current = debounce(handleSearch, DEBOUNCE_DELAY)
    return () => {
      handleSearchDebouncedRef.current &&
        handleSearchDebouncedRef.current.cancel()
    }
  }, [handleSearch])

  const handleInputChange = useCallback((query: string) => {
    handleSearchDebouncedRef.current && handleSearchDebouncedRef.current(query)
  }, [])

  // Clear the search every time we execute a "new" search
  useEffect(() => {
    queryRef.current = ""
    handleSearch("")
  }, [value, handleSearch])

  const cachedQuery = cacheRef.current[queryRef.current] ?? []

  return (
    <Select
      isLoading={isLoading}
      options={cachedQuery}
      searchFilter={searchFilter}
      value={value}
      onChange={handleInputChange}
      {...rest}
    />
  )
}

export default AsyncSelect
