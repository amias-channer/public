import { VFC } from 'react'
import { Search } from '@revolut/ui-kit'

import { BoxStyled, SearchButtonMask } from './styled'

type SearchInputButtonProps = {
  onClick: () => void
  placeholder: string
}

export const SearchInputButton: VFC<SearchInputButtonProps> = ({
  onClick,
  placeholder,
  ...rest
}) => {
  return (
    <BoxStyled {...rest} onClick={onClick}>
      <Search placeholder={placeholder} value="" tabIndex={-1} />
      <SearchButtonMask />
    </BoxStyled>
  )
}
