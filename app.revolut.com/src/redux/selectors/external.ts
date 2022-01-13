import * as R from 'ramda'
import { createSelector } from 'reselect'

export const externalSelector = R.prop('external')

export const preFillMessageSelector = createSelector(
  externalSelector,
  R.prop('preFillMessage')
)
