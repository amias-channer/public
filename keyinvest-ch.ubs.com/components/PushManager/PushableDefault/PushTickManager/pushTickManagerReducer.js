import produce from 'immer';
import {
  PUSH_TICK_MANAGER_CLEAR_DATA,
  PUSH_TICK_MANAGER_SET_SHOULD_TICK_FOR_FIELD,
  PUSH_TICK_MANAGER_SET_SHOULD_TICK_FOR_FIELDS,
} from './actions';
import { IDENTIFIER_PROPERTY } from '../PushableDefault.helper';

const initialState = {};
const pushTickManagerReducer = (state = initialState, action) => produce(
  state, (draft) => {
    switch (action.type) {
      case PUSH_TICK_MANAGER_SET_SHOULD_TICK_FOR_FIELD:
        if (action.fieldId) {
          draft[action.fieldId] = action.shouldTick;
        }
        break;
      case PUSH_TICK_MANAGER_SET_SHOULD_TICK_FOR_FIELDS:
        if (action.fields) {
          Object.keys(action.fields)
            .forEach((index) => {
              const newFieldData = action.fields[index];
              const pushId = newFieldData.id ? newFieldData.id : newFieldData[IDENTIFIER_PROPERTY];
              if (pushId) {
                draft[pushId] = action.shouldTick;
              }
            });
        }
        break;
      case PUSH_TICK_MANAGER_CLEAR_DATA:
        return initialState;
      default:
        break;
    }
  },
);

export default pushTickManagerReducer;
