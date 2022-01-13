import { pathOr } from 'ramda';
import HttpService from '../../utils/httpService';
import {
  EXPORT_TYPE_CSV,
  EXPORT_TYPE_XLSX,
} from '../FileDownloadManager/FileDownloadManager.helper';
import { generateCmsLayout } from '../../pages/CmsPage/CmsPage.helper';

export const EXPORT_PRODUCT_LIST_KEY = 'productListExport';

export const PRODUCT_LIST_EXPORT_BUTTONS = [EXPORT_TYPE_CSV, EXPORT_TYPE_XLSX];

export const getCmsComponents = (data) => generateCmsLayout(pathOr([], ['cmsPage', 'data'])(data));
export const getNumberOfResultsCount = pathOr('', ['filterData', 'summary', 'currentCount']);
export const getPageTitle = pathOr('', ['pageTitle']);
export const getMetaDescription = pathOr('', ['metaDescription']);
export const getMetaKeywords = pathOr('', ['metaKeywords']);
export const getGroupDescriptionTitle = pathOr('', ['listHeader']);
export const getGroupDescriptionText = pathOr('', ['description']);

export const getProductListExcelExportStartApiPath = (
  exportFileType,
) => HttpService.getBackendUrlByStateName(
  'productListExcelExportStart',
  true,
  { exportFormat: exportFileType },
);

export const getProductListExcelExportCheckProgressApiPath = (
  jobId,
) => HttpService.getBackendUrlByStateName(
  'productListExcelExportCheckProgress',
  false,
  { id: jobId },
);

export const getProductListExcelExportCancelApiPath = (
  jobId,
) => HttpService.getBackendUrlByStateName(
  'productListExcelExportCancel',
  false,
  { id: jobId },
);

export const getProductListJobDataFromResponse = pathOr({}, [EXPORT_PRODUCT_LIST_KEY]);
