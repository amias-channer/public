import getAppConfig from '../../main/AppConfig';
import { ENV_DEV } from '../../utils/utils';
import {
  DESKTOP_MODE,
  MOBILE_MODE,
  NOTEBOOK_MODE,
  TABLET_MODE,
} from '../../utils/responsive';

export const DEFAULT_DURATION = 5000;

export const SCENE_SLIDER_ANALYTICS_NAME = 'SceneSlider';

export const RESPONSIVE_IMAGES_KEY_MAPPING = {
  [DESKTOP_MODE]: 'dhref',
  [NOTEBOOK_MODE]: 'nhref',
  [TABLET_MODE]: 'thref',
  [MOBILE_MODE]: 'mhref',
};

export const getImageFullUrl = (url) => {
  const appConfig = getAppConfig();
  if (appConfig.environment === ENV_DEV) {
    return `//${appConfig.hostname}${url}`;
  }
  return url;
};
