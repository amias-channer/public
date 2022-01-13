import { VFC, useMemo } from 'react'
import { isUndefined, sortBy, slice, isEmpty } from 'lodash'
import { Item, Group, ItemSkeleton } from '@revolut/ui-kit'

import { Percents } from '@revolut/rwa-core-components'
import { useLocale } from '@revolut/rwa-core-i18n'
import { formatMoney } from '@revolut/rwa-core-utils'

import { useCryptoHoldings, useCryptoTargetCurrency } from '../../hooks'
import { CryptoAvatar } from '../CryptoAvatar'
import { NoCryptoFoundItem } from '../NoCryptoFoundItem'

type Props = {
  onItemClick: (cryptoCode: string) => void
  maxAmount?: number
  filterValue?: string
}

export const CRYPTO_HOLDINGS_SKELETON_TEST_ID = 'crypto-holdings-skeleton-testid'

export const CryptoHoldingsList: VFC<Props> = ({
  maxAmount,
  filterValue,
  onItemClick,
}) => {
  const { locale } = useLocale()

  const { targetCurrency } = useCryptoTargetCurrency()
  const { getAllHoldings } = useCryptoHoldings(targetCurrency)

  const { items: cryptoItems, isLoading } = getAllHoldings()

  const sortedCryptoItems = useMemo(
    () =>
      slice(
        sortBy(
          cryptoItems.filter((item) => {
            if (filterValue) {
              const lowerCasedValue = filterValue.toLowerCase()
              return (
                item.name.toLowerCase().includes(lowerCasedValue) ||
                item.code.toLowerCase().includes(lowerCasedValue)
              )
            }
            return true
          }),
          (cryptoItem) => cryptoItem.totalPrice,
        ).reverse(),
        0,
        maxAmount,
      ),
    [cryptoItems, filterValue, maxAmount],
  )

  const onCryptoItemClick = (cryptoCode: string) => () => {
    onItemClick(cryptoCode)
  }

  if (isLoading) {
    return (
      <Group data-testid={CRYPTO_HOLDINGS_SKELETON_TEST_ID}>
        <ItemSkeleton />
        <ItemSkeleton />
        <ItemSkeleton />
      </Group>
    )
  }

  if (isEmpty(sortedCryptoItems)) {
    return <NoCryptoFoundItem />
  }

  return (
    <Group>
      {sortedCryptoItems.map((cryptoItem) => (
        <Item
          key={cryptoItem.code}
          use="button"
          onClick={onCryptoItemClick(cryptoItem.code)}
        >
          <Item.Avatar>
            <CryptoAvatar cryptoCode={cryptoItem.code} />
          </Item.Avatar>
          <Item.Content>
            <Item.Title>{cryptoItem.name}</Item.Title>
            <Item.Description>
              {formatMoney(cryptoItem.amount, cryptoItem.code, locale)}
            </Item.Description>
          </Item.Content>
          <Item.Side>
            <Item.Value>
              {formatMoney(cryptoItem.totalPrice, targetCurrency, locale)}
            </Item.Value>
            {!isUndefined(cryptoItem.growthIndex) && (
              <Item.Value variant="secondary">
                <Percents value={cryptoItem.growthIndex} />
              </Item.Value>
            )}
          </Item.Side>
        </Item>
      ))}
    </Group>
  )
}
