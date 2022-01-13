import { produce } from 'immer';
import {
  MAIN_REGISTER_BEFORE_FORM_SUBMIT,
  MAIN_REGISTER_FETCH_CONTENT,
  MAIN_REGISTER_FORM_SUBMIT_ERROR,
  MAIN_REGISTER_FORM_SUBMIT_SUCCESS,
  MAIN_REGISTER_GOT_CONTENT,
} from './actions';


const mainRegisterPageReducer = (state = {
  error: null,
}, action) => produce(state, (draft) => {
  switch (action.type) {
    case MAIN_REGISTER_FETCH_CONTENT:
      draft.isLoading = true;
      draft.error = null;
      break;
    case MAIN_REGISTER_GOT_CONTENT:
      if (action.data) {
        draft.data = action.data;
      }
      draft.error = null;
      draft.isLoading = false;
      break;
    case MAIN_REGISTER_BEFORE_FORM_SUBMIT:
      draft.tableIsLoading = true;
      break;
    case MAIN_REGISTER_FORM_SUBMIT_SUCCESS:
      draft.tableIsLoading = false;
      draft.error = null;
      if (action.data) {
        if (!action.data.foundInstrument) {
          draft.data.instrumentData = false;
          break;
        }

        if (action.data.foundInstrument
            && action.data.instrument
            && action.data.columnsToRender) {
          draft.data.instrumentData = action.data.instrument;
          draft.data.columnsToRender = action.data.columnsToRender;
          break;
        }
      }
      break;
    case MAIN_REGISTER_FORM_SUBMIT_ERROR:
      draft.tableIsLoading = false;
      draft.data.instrumentData = false;
      if (action.data) {
        draft.error = action.data;
      }
      break;
    default:
      break;
  }
});

export default mainRegisterPageReducer;
