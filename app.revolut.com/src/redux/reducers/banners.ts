import { createAction, createReducer } from 'redux-act'
import * as R from 'ramda'

import {
  SERVICE_UNAVAILABLE_BANNER,
  UNAVAILABLE_ID,
  BannerVariant,
} from '../../constants/banners'

export type BannerType = {
  id: string
  variant?: typeof BannerVariant[keyof typeof BannerVariant]
  title?: React.ReactNode
  text?: React.ReactNode
  important?: boolean
  availablePath?: RegExp
  forbiddenPath?: RegExp
}

export type ReducerStateType = BannerType[]

const banners = createReducer<ReducerStateType>({}, [])

export const removeBanner = createAction<string | string[]>('BANNER/REMOVE')
banners.on(removeBanner, (state, payload) =>
  Array.isArray(payload)
    ? state.filter(({ id }) => !payload.includes(id))
    : state.filter(({ id }) => id !== payload)
)

export const addBanner = createAction<BannerType | BannerType[]>('BANNER/ADD')
banners.on(addBanner, (state, payload: BannerType) => {
  const cleanState = R.reject(R.propEq('id', payload.id), state)

  return Array.isArray(payload)
    ? [...payload, ...cleanState]
    : [payload, ...cleanState]
})

export const clearBanners = createAction<void>('BANNER/CLEAR')
banners.on(clearBanners, () => [])

/* Service unavailable banner */
export const unavailable = createAction<void>('set service unavailable banner')
banners.on(unavailable, (state) => [SERVICE_UNAVAILABLE_BANNER, ...state])

export const available = createAction<void>('remove service unavailable banner')
banners.on(available, R.reject(R.propEq('id', UNAVAILABLE_ID)))

export default banners
