import { produce } from 'immer';
import {
  PUSH_MANAGER_UPDATE_STORE_STATE,
  PUSH_MANAGER_UPDATE_STORE_STATE_RECEIVED_MESSAGE,
  PUSH_MANAGER_REMOVE_SUBSCRIPTION,
  PUSH_MANAGER_CLEAR_PUSH_DATA,
} from './actions';
import {
  getDefaultDisplayProperty,
  getIdentifierPropertyFromAction,
  getIdentifierValueFromField,
  IDENTIFIER_PROPERTY,
} from './PushableDefault/PushableDefault.helper';

export const initialState = {
  pushableFields: {},
  pushData: {},
};

const pushManagerReducer = (state = initialState, action) => produce(state, (draft) => {
  const identifierProp = action
    && action.field
    && action.field.identifierProperty
    ? action.field.identifierProperty : getIdentifierPropertyFromAction(action || {});
  const identifierValue = getIdentifierValueFromField(
    identifierProp || undefined, action.field || {},
  );
  const displayProp = getDefaultDisplayProperty(action.field || {});
  switch (action.type) {
    case PUSH_MANAGER_UPDATE_STORE_STATE:
      if (draft.pushableFields[identifierValue]
      && draft.pushableFields[identifierValue][displayProp]) {
        draft.pushableFields[identifierValue][displayProp].usage += 1;
      } else {
        if (!draft.pushableFields[identifierValue]) {
          draft.pushableFields[identifierValue] = {};
        }
        if (action.field
          && action.field.pushMetaData
          && action.field.precision
          && action.field.precisionMax
        ) {
          draft.pushableFields[identifierValue][displayProp] = {
            pushMetaData: action.field.pushMetaData,
            format: {
              precision: action.field.precision,
              precisionMax: action.field.precisionMax,
            },
            usage: 1,
          };
        }
      }
      break;

    case PUSH_MANAGER_UPDATE_STORE_STATE_RECEIVED_MESSAGE: {
      if (action.message && Object.keys(action.message).length) {
        Object.keys(action.message)
          .forEach((index) => {
            const newFieldData = action.message[index];
            const pushId = newFieldData.id ? newFieldData.id : newFieldData[IDENTIFIER_PROPERTY];
            const pushPath = draft.pushData[pushId];
            if (draft.pushableFields[pushId]) {
              draft.pushData[pushId] = {
                act: newFieldData.fields,
                prev: { ...pushPath && pushPath.act ? pushPath.act : {} },
              };
            } else if (pushPath) {
              delete draft.pushData[pushId];
            }
          });
      }

      break;
    }
    case PUSH_MANAGER_REMOVE_SUBSCRIPTION: {
      const pushableField = draft.pushableFields[identifierValue]
      && draft.pushableFields[identifierValue][displayProp]
        ? draft.pushableFields[identifierValue][displayProp] : null;
      if (pushableField) {
        if (pushableField.usage
          && pushableField.usage > 1
        ) {
          pushableField.usage -= 1;
        } else {
          delete draft.pushableFields[identifierValue][displayProp];
          if (Object.keys(draft.pushableFields[identifierValue]).length === 0) {
            delete draft.pushableFields[identifierValue];
          }
        }
      }
      break;
    }
    case PUSH_MANAGER_CLEAR_PUSH_DATA:
      draft.pushData = {};
      break;
    default:
      break;
  }
});

export default pushManagerReducer;
