import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import * as reducers from './index'

export default (history: any) =>
  combineReducers({
    router: connectRouter(history),
    ...reducers,
  })
