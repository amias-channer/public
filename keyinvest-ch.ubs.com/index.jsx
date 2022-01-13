import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'custom-event-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './scss/main.scss';
import './scss/print.scss';
import { ConnectedRouter } from 'connected-react-router';
import i18n, { getInitOptions } from './utils/i18n';
import history from './utils/history';
import App from './main/App';
import { store } from './main/configureStore';
import * as serviceWorker from './main/serviceWorker';
import rootSaga from './main/rootSaga';
import getAppConfig from './main/AppConfig';
import HttpService from './utils/httpService';
import { initAnalytics } from './analytics/Analytics.helper';

store.runSaga(rootSaga);

const bootstrap = () => {
  initAnalytics();
  i18n.init(getInitOptions()).then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>,
      document.getElementById('root') || document.createElement('div'),
    );
  });
};
if (!window.AppConfig) {
  HttpService.fetch(`${HttpService.generateUrl(getAppConfig().pageApiPath)}/config`)
    .then((response) => {
      window.AppConfig = response.data;
    })
    .finally(bootstrap);
} else {
  bootstrap();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
