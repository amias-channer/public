import { produce } from 'immer';
import { ANALYTICS_FORM_TRACK_START } from './actions';

const analyticsReducer = (state = {}, action) => produce(state, (draft) => {
  if (action.type === ANALYTICS_FORM_TRACK_START) {
    if (!draft[action.formName]) {
      draft[action.formName] = {};
    }
    draft[action.formName].started = true;
  }
});

export default analyticsReducer;
