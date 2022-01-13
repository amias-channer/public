import {Config} from 'frontend-core/dist/models/config';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {FinancialStatements} from '../../models/financial-statement';
import {RefinitivBaseRequestParams} from '../../models/refinitiv';

export default function getFinancialStatements(
    config: Config,
    params: RefinitivBaseRequestParams
): Promise<FinancialStatements> {
    return requestToApi({
        config,
        url: `${config.refinitivFinancialStatementsUrl}/${params.isin}`
    });
}
