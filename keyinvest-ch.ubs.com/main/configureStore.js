import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import {
  PUSH_MANAGER_ADD_SUBSCRIPTION,
  PUSH_MANAGER_RECEIVED_MESSAGE,
  PUSH_MANAGER_REMOVE_SUBSCRIPTION,
  PUSH_MANAGER_UPDATE_STORE_STATE,
  PUSH_MANAGER_UPDATE_STORE_STATE_RECEIVED_MESSAGE,
  PUSH_MANAGER_UPDATE_SUBSCRIPTIONS,
} from '../components/PushManager/actions';
import browserHistory from '../utils/history';
import { CHART_MANAGER_PUSHABLE_CHART_UPDATE } from '../components/Chart/ChartManager/actions';

export default function configureStore(initialState = {}, history) {
  const sagaMiddleware = createSagaMiddleware();
  // Create the store with one middleware
  // 1. sagaMiddleware: Makes redux-sagas work
  const middlewares = [sagaMiddleware, routerMiddleware(history)];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle, indent, max-len */
  const composeEnhancers = process.env.NODE_ENV !== 'production'
      && typeof window === 'object'
      && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
          ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      actionsBlacklist: [
        PUSH_MANAGER_REMOVE_SUBSCRIPTION,
        PUSH_MANAGER_ADD_SUBSCRIPTION,
        PUSH_MANAGER_UPDATE_SUBSCRIPTIONS,
        PUSH_MANAGER_UPDATE_STORE_STATE,
        PUSH_MANAGER_UPDATE_STORE_STATE_RECEIVED_MESSAGE,
        PUSH_MANAGER_RECEIVED_MESSAGE,
        CHART_MANAGER_PUSHABLE_CHART_UPDATE,
      ],
    }) // To enable actions tracing in redux devtools use : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 })
    : compose;
  /* eslint-enable */

  const reduxStore = createStore(createReducer(),
    initialState,
    composeEnhancers(...enhancers));

  reduxStore.runSaga = sagaMiddleware.run;
  reduxStore.injectedReducers = {}; // Reducer registry

  return reduxStore;
}

// Create redux store with history
const reduxStoreInitialState = {};
export const store = configureStore(reduxStoreInitialState, browserHistory);
