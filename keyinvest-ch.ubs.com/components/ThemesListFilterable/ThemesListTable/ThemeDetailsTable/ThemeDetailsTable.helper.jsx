import { path } from 'ramda';
import i18n from '../../../../utils/i18n';

export const getIsin = (product) => path(['isin'], product);
export const getUnderlyingName = (product) => path(['underlying'], product);
export const getName = (product) => path(['name'], product);

export const getProductAnalyticsText = (product) => `${i18n.t('underlying')}:${getUnderlyingName(product) || ''} | ${i18n.t('name')}:${getName(product) || ''}`;
