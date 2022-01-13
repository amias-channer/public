import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { memoizeWith } from 'ramda';
// eslint-disable-next-line camelcase
import { de_CH } from '../translations/de_CH';
// eslint-disable-next-line camelcase
import { en_CH } from '../translations/en_CH';
// eslint-disable-next-line camelcase
import { de_DE } from '../translations/de_DE';
// eslint-disable-next-line camelcase
import { fr_CH } from '../translations/fr_CH';

import getAppConfig from '../main/AppConfig';
import Logger from './logger';

const resources = {
  de_CH: { translation: de_CH },
  de_DE: { translation: de_DE },
  en_CH: { translation: en_CH },
  fr_CH: { translation: fr_CH },
};

export const getInitOptions = () => ({
  resources,
  lng: getAppConfig().locale,
  nsSeparator: false, // we do not use keys in form messages.welcome
  keySeparator: false, // we do not use keys in form messages.welcome
  debug: Logger.getLevel() === 1,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

i18n
  .use(initReactI18next);

/**
 * Should memoize the i18n.t to the siteVariant + key
 */
try {
  i18n.t = memoizeWith(
    (key, options) => `${getAppConfig().locale}_${key}_${typeof options === 'object' ? JSON.stringify(options) : ''}`,
    i18n.t,
  );
} catch (e) {
  Logger.warn('Could not setup memoize for i18n.t');
}

export default i18n;
