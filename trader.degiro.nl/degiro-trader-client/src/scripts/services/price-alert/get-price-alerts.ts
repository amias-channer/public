import formatDate from 'frontend-core/dist/utils/date/format-date';
import {Config} from 'frontend-core/dist/models/config';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {SortTypes} from 'frontend-core/dist/services/filter';
import {PriceAlertsResult, PriceAlertsResultResponse, PriceAlertsSortColumn} from '../../models/price-alert';

const dateFormat: string = 'YYYY-MM-DD';

export interface PriceAlertsParams {
    fromDate: Date;
    toDate: Date;
    sortColumns: PriceAlertsSortColumn[];
    sortTypes: SortTypes[];
    offset: number;
    limit: number;
    requireTotal?: boolean;
}

export default function getPriceAlerts(config: Config, params: PriceAlertsParams): Promise<PriceAlertsResult> {
    return requestToApi({
        config,
        url: `${config.reportingUrl}v3/price-alerts/regulatory/notifications`,
        params: {
            ...params,
            fromDate: formatDate(params.fromDate, dateFormat),
            toDate: formatDate(params.toDate, dateFormat)
        }
    }).then((result: PriceAlertsResultResponse) => ({
        rows: [],
        ...result
    }));
}
