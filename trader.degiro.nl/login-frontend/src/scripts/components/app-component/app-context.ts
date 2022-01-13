import {I18n} from 'frontend-core/dist/models/i18n';
import {DeviceInfo} from 'frontend-core/dist/platform/get-device-info';
import {createContext} from 'react';
import {AppParams} from '../../models/app-params';
import {Config, initialConfig} from '../../models/config';
import {User} from '../../models/user';
import {AppComponentApi} from './index';

export const AppApiContext = createContext<AppComponentApi>({} as AppComponentApi);

export const I18nContext = createContext<I18n>({});

export const ConfigContext = createContext<Config>(initialConfig);

export const UserContext = createContext<User>({});

export const UsersContext = createContext<User[]>([]);

export const AppParamsContext = createContext<AppParams>({});

export const DeviceInfoContext = createContext<Partial<DeviceInfo>>({});
