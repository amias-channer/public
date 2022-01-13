import { Pocket, Currency, PocketState, PocketType } from '@revolut/rwa-core-types'

export const findCurrentActivePocketByCurrency = (
  pockets: Pocket[],
  currency: Currency,
) =>
  pockets.find(
    (pocket) =>
      pocket.currency === currency &&
      pocket.type === PocketType.Current &&
      pocket.state === PocketState.Active,
  )
