import { pathOr, pluck } from 'ramda';
import { FILTER_LEVEL_SECOND } from '../DefaultListFilterable/ProductFilters/ProductFilters.helper';
import i18n from '../../utils/i18n';
import { generateCmsLayout } from '../../pages/CmsPage/CmsPage.helper';
import {
  pathOrObject,
  pathOrString,
} from '../../utils/typeChecker';

export const CURRENCY = 'currency';
export const PERFORMANCE_1_MTH_PERCENT = 'performance1MthPercent';
export const PERFORMANCE_Y_TD_PERCENT = 'performanceYtdPercent';
export const PERFORMANCE_SINCE_ISSUE_PERCENT = 'performanceSinceIssuePercent';
export const DEVELOPMENT_SINCE_ISSUE = 'developmentSinceIssue';

export const getFieldValueFromThemeRow = (fieldName, row) => pathOr('', [fieldName, 'value'], row);

export const getThemes = (data) => pathOr([], ['themes'])(data);
export const getThemesFilterData = (data) => ({ [FILTER_LEVEL_SECOND]: pathOr({}, ['filterData'])(data) });
export const getThemesSort = (data) => pathOr({}, ['sort'])(data);
export const getFilteredCount = (data) => pathOr(0, ['filteredCount'])(data);
export const getTotalCount = (data) => pathOr(0, ['totalCount'])(data);
export const getThemesCmsComponents = (data) => generateCmsLayout(pathOr([], ['components'])(data));
export const getThemeId = (theme) => pathOr('', ['title'])(theme);
export const getThemeTitle = (theme) => pathOr('', ['title'])(theme);
export const getThemeImage = (theme) => pathOr('', ['image'])(theme);
export const getThemeDescription = (theme) => pathOr('', ['description'])(theme);
export const getThemeDocuments = (theme) => pathOr([], ['documents'])(theme);
export const getThemeChartPng = (theme) => pathOr('', ['chartPng'])(theme);
export const getThemeChartUrl = (theme) => pathOr('', ['chartUrl'])(theme);
export const shouldDisplayDetailsPageButton = (theme) => pathOrString(false, ['detailPageUrl'], theme);
export const getThemeDetailsPageUrl = (theme) => pathOr('', ['detailPageUrl'])(theme);

export const getTableCounts = (data) => `<span class="count-title">${i18n.t('themes_filtered_total_count', {
  filteredCount: getFilteredCount(data),
  totalCount: getTotalCount(data),
})}</span>`;

export const getThemeDetailsTableData = (theme) => pathOr([], ['detailRows'])(theme);
export const getThemeDetailsColumns = (theme) => pathOrObject({}, ['columnsDetailRows'], theme);
export const getThemeDetailsColumnsKeys = (columnsData) => Object.keys(columnsData);
export const getThemeDetailsColumnsLabels = (columnsData) => pluck('label', Object.values(columnsData));
