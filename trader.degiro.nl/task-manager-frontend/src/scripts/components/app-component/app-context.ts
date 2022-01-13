import {Country, Nationality} from 'frontend-core/dist/models/country';
import {I18n} from 'frontend-core/dist/models/i18n';
import {TasksInfo} from 'frontend-core/dist/models/task/task';
import {User} from 'frontend-core/dist/models/user';
import {createContext} from 'react';
import {AppParams} from '../../models/app-params';
import {Config} from '../../models/config';
import {AppComponentApi} from './index';

export const AppApiContext = createContext<AppComponentApi>({} as AppComponentApi);

export const AppParamsContext = createContext<AppParams>({});

export const I18nContext = createContext<I18n>({});

export const ConfigContext = createContext<Config>({} as Config);

export const MainClientContext = createContext<User>({} as User);

export const CurrentClientContext = createContext<User>({} as User);

export const CountriesContext = createContext<Country[]>([]);

export const NationalitiesContext = createContext<Nationality[]>([]);

export const TasksInfoContext = createContext<TasksInfo>({
    tasks: [],
    hasOverdueTask: false
});
