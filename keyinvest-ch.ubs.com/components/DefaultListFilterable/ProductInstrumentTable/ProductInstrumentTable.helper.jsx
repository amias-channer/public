import { intersection, path } from 'ramda';
import i18n from '../../../utils/i18n';
import { pathOrString } from '../../../utils/typeChecker';

export const getContainerGroups = (data) => path(['containerGroups'], data);
export const getColumnsToRender = (data) => path(['columnsToRender'], data);

export const getIsin = path(['isin', 'value']);
export const getUnderlyingName = path(['underlyingName', 'value']);
export const getName = path(['name', 'value']);
export const getTermSheetLink = path(['termsheet', 'value']);
export const getFactSheetLink = pathOrString('', ['factsheet', 'value']);

export const shouldSkipColumn = (
  containerGroups,
  columnsToRender,
  column,
) => !!(containerGroups[column]
    && Array.isArray(containerGroups[column])
    && columnsToRender
    && intersection(containerGroups[column],
      Object.keys(columnsToRender)).length === 0);

export const shouldNotRenderColumn = (
  containerGroups,
  columnsToRender,
  column,
) => !!(containerGroups[column]
    && typeof containerGroups[column] === 'string'
    && columnsToRender
    && Object.keys(columnsToRender).indexOf(containerGroups[column]) === -1);

export const getProductAnalyticsText = (product) => `${i18n.t('underlying')}:${getUnderlyingName(product) || ''} | ${i18n.t('name')}:${getName(product) || ''}`;
