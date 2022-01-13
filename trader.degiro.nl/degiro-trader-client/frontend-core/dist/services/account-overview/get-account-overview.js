import formatDate from '../../utils/date/format-date';
import requestToApi from '../api-requester/request-to-api';
import prepareAccountOverview from './prepare-account-overview';
export const dateFormat = 'DD/MM/YYYY';
export default function getAccountOverview(config, params) {
    return requestToApi({
        config,
        url: `${config.reportingUrl}v6/accountoverview`,
        params: {
            ...params,
            fromDate: formatDate(params.fromDate, dateFormat),
            toDate: formatDate(params.toDate, dateFormat)
        }
    }).then(prepareAccountOverview);
}
//# sourceMappingURL=get-account-overview.js.map