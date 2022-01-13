import { VFC } from 'react'
import { Avatar, Group, Item, Popup, PopupProps } from '@revolut/ui-kit'

import { CurrenciesType, CurrencyProperties } from '@revolut/rwa-core-types'
import { AssetProject, getAsset } from '@revolut/rwa-core-utils'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'

type SelectPocketPopupProps = {
  currenciesCodes: ReadonlyArray<string>
  onCurrencySelected: (currency: CurrencyProperties) => void
} & Omit<PopupProps, 'variant'>

export const SelectCurrencyPopup: VFC<SelectPocketPopupProps> = ({
  currenciesCodes,
  onCurrencySelected,
  onExit,
  ...rest
}) => {
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)

  const options = currenciesCodes.reduce((acc, item) => {
    acc[item] = currencies[item]

    return acc
  }, {}) as CurrencyProperties[]

  const handleCurrencySelected = (currency: CurrencyProperties) => {
    onCurrencySelected(currency)
    onExit?.()
  }

  return (
    <Popup {...rest} variant="bottom-sheet" onExit={onExit}>
      <Group>
        {Object.values(options).map((item) => (
          <Item key={item.code} use="button" onClick={() => handleCurrencySelected(item)}>
            <Item.Avatar>
              <Avatar
                image={getAsset(`flags/${item.country}.svg`, AssetProject.Business)}
              />
            </Item.Avatar>
            <Item.Content>
              <Item.Title>{item.code}</Item.Title>
              <Item.Description>{item.currency}</Item.Description>
            </Item.Content>
          </Item>
        ))}
      </Group>
    </Popup>
  )
}
