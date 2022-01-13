import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {User} from 'frontend-core/dist/models/user';
import {VwdChart} from '../../models/vwd-api';
import getVwdApiOptions from './get-vwd-api-options';

const chartAPIUrl = 'https://charting.vwdservices.com/hchart/v1/deGiro/api.js';
const getGlobalVwdChartApi = (): VwdChart | undefined => window.vwd?.hchart;

export default function getVwdChartApi(mainClient: User): Promise<VwdChart> {
    const chartApi: VwdChart | undefined = getGlobalVwdChartApi();

    if (chartApi) {
        return Promise.resolve(chartApi);
    }
    const {userToken, timezone, locale} = getVwdApiOptions(mainClient);
    const url = `${chartAPIUrl}?culture=${locale}&userToken=${userToken}&tz=${timezone}`;

    return new Promise((resolve, reject) => {
        const script: HTMLScriptElement = document.createElement('script');

        script.onload = () => {
            const chartApi: VwdChart | undefined = getGlobalVwdChartApi();

            if (chartApi) {
                resolve(chartApi);
            } else {
                script.parentNode?.removeChild(script);

                reject(new Error('VWD chart API is not found'));
            }
        };
        script.onerror = (event: Event | string, _src?: string, _line?: number, _col?: number, error?: Error) => {
            logErrorLocally(event, error);

            reject(
                new Error(
                    `VWD chart API is not loaded: ${error?.message || (typeof event === 'string' ? event : event.type)}`
                )
            );
        };
        script.src = url;

        // [SENTRY-522]
        if (document.head && typeof document.head.appendChild === 'function') {
            document.head.appendChild(script);
        } else {
            reject(
                new Error(
                    `document.head.appendChild is not a function. document.head: ${Object.prototype.toString.call(
                        document.head
                    )}`
                )
            );
        }
    });
}
