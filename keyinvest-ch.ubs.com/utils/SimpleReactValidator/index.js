import SimpleReactValidator from 'simple-react-validator';
import addDeCHLocale from './addDeCHLocale';
import addEnCHLocale from './addEnCHLocale';
import addFrCHLocale from './addFrCHLocale';
import addDeDELocale from './addDeDELocale';
import getAppConfig from '../../main/AppConfig';

addDeCHLocale(SimpleReactValidator);
addEnCHLocale(SimpleReactValidator);
addFrCHLocale(SimpleReactValidator);
addDeDELocale(SimpleReactValidator);

const customHumanizeFieldName = (field) => field.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ');

export const createValidatorInstance = (options = {}) => {
  const { locale } = getAppConfig();
  const instance = new SimpleReactValidator(
    { ...options, locale },
  );

  /**
   * Overriding the default implementation of humanizeFieldName
   * to remove .toLowerCase in DE language
   */
  if (locale === 'de_CH' || locale === 'de_DE') {
    if (instance.helpers && typeof instance.helpers.humanizeFieldName === 'function') {
      instance.helpers.humanizeFieldName = customHumanizeFieldName;
    }
  }
  return instance;
};

export default SimpleReactValidator;
