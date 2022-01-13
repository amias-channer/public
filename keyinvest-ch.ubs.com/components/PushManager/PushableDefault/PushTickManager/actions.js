export const PUSH_TICK_MANAGER_SET_SHOULD_TICK_FOR_FIELD = 'PushTickManager/PUSH_TICK_MANAGER_SET_SHOULD_TICK_FOR_FIELD';
export const PUSH_TICK_MANAGER_SET_SHOULD_TICK_FOR_FIELDS = 'PushTickManager/PUSH_TICK_MANAGER_SET_SHOULD_TICK_FOR_FIELDS';
export const PUSH_TICK_MANAGER_CLEAR_DATA = 'PushTickManager/PUSH_TICK_MANAGER_CLEAR_DATA';

export const pushTickManagerSetShouldTickForField = (fieldId, shouldTick) => ({
  type: PUSH_TICK_MANAGER_SET_SHOULD_TICK_FOR_FIELD,
  fieldId,
  shouldTick,
});

export const pushTickManagerSetShouldTickForFields = (fields, shouldTick) => ({
  type: PUSH_TICK_MANAGER_SET_SHOULD_TICK_FOR_FIELDS,
  fields,
  shouldTick,
});

export const pushTickManagerClearData = () => ({
  type: PUSH_TICK_MANAGER_CLEAR_DATA,
});
