import getAppConfig from '../../../main/AppConfig';
import HttpService from '../../../utils/httpService';

export const getUniqSearchResult = (data) => {
  if (data && Object.keys(data).length) {
    const keys = Object.keys(data);
    const tmpResult = keys.map((key) => {
      const section = data[key];
      if (section && section.entries && section.entries.length === 1) {
        const [firstItem] = section.entries;
        return firstItem;
      }
      return null;
    });
    if (tmpResult && tmpResult.length > 0) {
      const result = tmpResult.filter((el) => el !== null && el !== undefined);

      if (result && result.length === 1) {
        const [firstItem] = result;
        return firstItem;
      }
    }
  }
  return null;
};

export const generateSearchUrl = (searchText) => {
  const appConfig = getAppConfig();
  return `${HttpService.generateUrl(appConfig.searchAutoCompletePath)}?q=${encodeURIComponent(searchText)}&format=json&locale=${appConfig.locale}&siteVariant=${appConfig.application}`;
};
