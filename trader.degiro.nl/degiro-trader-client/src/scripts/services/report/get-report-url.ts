import formatDate from 'frontend-core/dist/utils/date/format-date';
import {Config} from 'frontend-core/dist/models/config';
import {User} from 'frontend-core/dist/models/user';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';

export interface ReportUrlOptions {
    url: string;
    params: {
        fromDate?: Date;
        toDate: Date;
    };
}

export default function getReportUrl(config: Config, currentClient: User, options: ReportUrlOptions): string {
    const params: Record<string, any> = {
        intAccount: currentClient.intAccount,
        sessionId: config.sessionId,
        country: currentClient.culture,
        lang: currentClient.language,
        ...options.params
    };

    Object.keys(params).forEach((key: string) => {
        const value: unknown = params[key];

        if (value instanceof Date) {
            params[key] = formatDate(value, 'DD/MM/YYYY');
        }
    });

    return `${options.url.replace(/\?$/, '')}?${getQueryString(params)}`;
}
