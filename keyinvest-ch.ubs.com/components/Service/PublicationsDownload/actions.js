export const PUBLICATIONS_DOWNLOAD_FETCH_CONTENT = 'PublicationsDownload/PUBLICATIONS_DOWNLOAD_FETCH_CONTENT';
export const PUBLICATIONS_DOWNLOAD_GOT_CONTENT = 'PublicationsDownload/PUBLICATIONS_DOWNLOAD_GOT_CONTENT';
export const PUBLICATIONS_DOWNLOAD_POST_FORM_DATA = 'PublicationsDownload/PUBLICATIONS_DOWNLOAD_POST_FORM_DATA';
export const PUBLICATIONS_DOWNLOAD_FORM_SUBMIT_SUCCESS = 'PublicationsDownload/PUBLICATIONS_DOWNLOAD_FORM_SUBMIT_SUCCESS';

export function publicationsDownloadFetchContent() {
  return {
    type: PUBLICATIONS_DOWNLOAD_FETCH_CONTENT,
  };
}

export function publicationsDownloadGotContent(data) {
  return {
    type: PUBLICATIONS_DOWNLOAD_GOT_CONTENT,
    data,
  };
}

export function publicationsDownloadPostFormData(data) {
  return {
    type: PUBLICATIONS_DOWNLOAD_POST_FORM_DATA,
    data,
  };
}

export function publicationsDownloadFormSubmitSuccess(message) {
  return {
    type: PUBLICATIONS_DOWNLOAD_FORM_SUBMIT_SUCCESS,
    message,
  };
}
