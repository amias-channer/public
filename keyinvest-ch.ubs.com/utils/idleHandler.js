import Logger from './logger';

let idleTimer = null;
export const IDLE_TIMEOUT = 1000 * 60 * 60; // 1 hour in ms

// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
export const getCrossBrowserHiddenAndVisibilityChange = () => {
  let hidden;
  let visibilityChange;
  try {
    if (typeof document.hidden !== 'undefined') {
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
  } catch (e) {
    Logger.warn('IdleHandler', 'getCrossBrowserHiddenAndVisibilityChange', e);
  }
  return {
    hiddenPropertyName: hidden,
    visibilityChangePropertyName: visibilityChange,
  };
};

const browserSpecificPropNames = getCrossBrowserHiddenAndVisibilityChange();
export const { hiddenPropertyName } = browserSpecificPropNames;
export const { visibilityChangePropertyName } = browserSpecificPropNames;

const clearIdleTimer = () => {
  if (idleTimer) {
    clearTimeout(idleTimer);
    Logger.debug('IdleHandler', 'clearIdleTimer', 'Cleared timer');
  }
};

export const onWindowHidden = () => {
  if (idleTimer) {
    clearIdleTimer();
  }
  idleTimer = setTimeout(() => {
    window.location.reload();
  }, IDLE_TIMEOUT);
  Logger.debug('IdleHandler', 'onWindowHidden', 'Setting idle timer...');
};

export const onWindowVisible = () => {
  Logger.debug('IdleHandler', 'onWindowVisible');
  clearIdleTimer();
};

export const handleDocumentVisibilityChange = () => {
  try {
    if (document && document[hiddenPropertyName]) {
      onWindowHidden();
    } else {
      onWindowVisible();
    }
  } catch (e) {
    Logger.warn('IdleHandler', 'handleDocumentVisibilityChange', e);
  }
};
