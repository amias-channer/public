import { produce } from 'immer';
import {
  CMS_PAGE_FETCH_CONTENT,
  CMS_PAGE_GOT_CONTENT,
  CMS_PAGE_GOT_ERROR,
  CMS_PAGE_WILL_UNMOUNT,
} from './actions';

const cmsPageReducer = (state = {}, action) => produce(state, (draft) => {
  switch (action.type) {
    case CMS_PAGE_FETCH_CONTENT:
      draft.content = [];
      draft.pageTitle = '';
      draft.isLoading = true;
      draft.failed = false;
      break;
    case CMS_PAGE_GOT_CONTENT:
      draft.content = action.data.data;
      draft.pageTitle = action.data.title;
      draft.isLoading = false;
      draft.failed = false;
      break;
    case CMS_PAGE_GOT_ERROR:
      draft.content = action.data;
      draft.pageTitle = null;
      draft.isLoading = false;
      draft.failed = true;
      break;
    case CMS_PAGE_WILL_UNMOUNT:
      draft.content = {};
      draft.pageTitle = '';
      draft.isLoading = false;
      draft.failed = false;
      break;
    default:
      break;
  }
});

export default cmsPageReducer;
