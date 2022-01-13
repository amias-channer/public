import React from 'react';
import { Route } from 'react-router-dom';
import { concat } from 'ramda';
import { createLocation } from 'history';
import { getMappedComponentByStateName } from '../pages/pagesConfig';
import { getNavigationTopNodesFromAppConfig } from '../utils/utils';
import LanguageChangePage from '../pages/LanguageChangePage';
import {
  STATE_NAME_LANGUAGE_CHANGE,
  STATE_NAME_ERROR_PAGE,
  STATE_NAME_PRODUCT_LIST,
} from './constants';

const prepareStaticRoutes = () => [
  <Route path="/languageChange" key={STATE_NAME_LANGUAGE_CHANGE} exact component={LanguageChangePage} />,
  <Route path="*" key={STATE_NAME_ERROR_PAGE} exact render={getMappedComponentByStateName(STATE_NAME_ERROR_PAGE)} />,
];

const getRoutePath = (url, stateName) => {
  if (stateName === STATE_NAME_PRODUCT_LIST) {
    return `${createLocation(url).pathname}/:filterParams*`;
  }
  return createLocation(url).pathname;
};

const prepareCmsNavigationToRoutes = (routes) => routes.reduce((acc, item) => {
  if (item.submenu) {
    // eslint-disable-next-line no-param-reassign
    acc = acc.concat(prepareCmsNavigationToRoutes(item.submenu));
  }
  const component = getMappedComponentByStateName(item.stateName, item);
  acc.push(
    <Route
      key={item.url}
      exact
      path={getRoutePath(item.url, item.stateName)}
      render={component}
    />,
  );
  return acc;
}, []);

export default function getAppRoutes() {
  const cmsRoutes = prepareCmsNavigationToRoutes(getNavigationTopNodesFromAppConfig());
  return concat(cmsRoutes, prepareStaticRoutes());
}
