export const CMS_PAGE_FETCH_CONTENT = 'CmsPage/CMS_PAGE_FETCH_CONTENT';
export const CMS_PAGE_GOT_CONTENT = 'CmsPage/CMS_PAGE_GOT_CONTENT';
export const CMS_PAGE_GOT_ERROR = 'CmsPage/CMS_PAGE_GOT_ERROR';
export const CMS_PAGE_WILL_UNMOUNT = 'CmsPage/CMS_PAGE_WILL_UNMOUNT';

export function cmsPageFetchContent() {
  return {
    type: CMS_PAGE_FETCH_CONTENT,
  };
}

export function cmsPageGotContent(data, locationHash) {
  return {
    type: CMS_PAGE_GOT_CONTENT,
    data,
    locationHash,
  };
}

export function cmsPageGotError(data) {
  return {
    type: CMS_PAGE_GOT_ERROR,
    data,
  };
}

export function cmsPageWillUnmount() {
  return {
    type: CMS_PAGE_WILL_UNMOUNT,
  };
}
