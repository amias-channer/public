import {Config} from 'frontend-core/dist/models/config';
import {ErrorLoggerOptions} from 'frontend-core/dist/loggers/remote-logger';

type InitialConfig = Required<
    Pick<
        Config,
        'minSearchTermLength' | 'configUrl' | 'loginUrl' | 'logosPath' | 'vwdChartTemplateUrl' | 'vwdChartApiUrl'
    >
>;

export const initialConfig: InitialConfig = {
    minSearchTermLength: 1,
    configUrl: '/login/secure/config',
    // for redirect to Login page when request to /config fails
    loginUrl: '/login',
    logosPath: 'images/logos/',
    vwdChartTemplateUrl: 'https://solutions.vwdservices.com/customers/degiro.nl/charts/analysis',
    vwdChartApiUrl: 'https://charting.vwdservices.com/hchart/v1/deGiro/api.js'
};

export const errorLoggerOptions: ErrorLoggerOptions = {
    dsn: 'https://558a366ecd4944f3b8667b770c4cd9c6@diagnostic.degiro.nl/4',
    release: String(appVersion)
};
