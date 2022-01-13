import { produce } from 'immer';
import {
  PUBLICATIONS_DOWNLOAD_FETCH_CONTENT,
  PUBLICATIONS_DOWNLOAD_FORM_SUBMIT_SUCCESS,
  PUBLICATIONS_DOWNLOAD_GOT_CONTENT,
} from './actions';

const publicationsDownloadReducer = (state = {}, action) => produce(state, (draft) => {
  switch (action.type) {
    case PUBLICATIONS_DOWNLOAD_FETCH_CONTENT:
      draft.isLoading = true;
      break;
    case PUBLICATIONS_DOWNLOAD_GOT_CONTENT:
      if (action.data) {
        draft.data = action.data;
      }
      draft.isLoading = false;
      break;
    case PUBLICATIONS_DOWNLOAD_FORM_SUBMIT_SUCCESS:
      if (action.message) {
        if (draft.data && draft.data.showOrderForm) {
          draft.data.showOrderForm = false;
        }

        draft.formSubmitSuccess = true;
        draft.formSubmitSuccessMessage = action.message;
      }

      break;
    default:
      break;
  }
});

export default publicationsDownloadReducer;
