import { createStore, applyMiddleware } from 'redux'
import * as R from 'ramda'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'

import createRootReducer from '../reducers/rootReducer'

import { history } from './history'

export const sagaMiddleware = createSagaMiddleware()

const composeMiddleware = R.compose(
  applyMiddleware(routerMiddleware(history), sagaMiddleware),
  (process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()) ||
    R.identity
)

export const store = createStore(createRootReducer(history), composeMiddleware)
