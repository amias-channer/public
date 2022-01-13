import {Config} from 'frontend-core/dist/models/config';
import {I18n} from 'frontend-core/dist/models/i18n';
import {User} from 'frontend-core/dist/models/user';
import {createContext} from 'react';
import {EventBroker} from '../../event-broker';
import {AppComponentApi} from './index';

export const AppApiContext = createContext<AppComponentApi>({} as AppComponentApi);

export const EventBrokerContext = createContext<EventBroker>({} as EventBroker);

export const I18nContext = createContext<I18n>({});

export const ConfigContext = createContext<Config>({} as Config);

export const MainClientContext = createContext<User>({} as User);

export const CurrentClientContext = createContext<User>({} as User);
