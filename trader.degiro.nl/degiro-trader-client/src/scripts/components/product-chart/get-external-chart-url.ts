import {Config} from 'frontend-core/dist/models/config';
import {ProductInfo, VwdIdentifierTypes} from 'frontend-core/dist/models/product';
import {User} from 'frontend-core/dist/models/user';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import getVwdIdParams from '../../services/vwd-chart/get-vwd-id-params';

/**
 *
 * @todo Remove related service in CORE
 * @param {Config} config
 * @param {User} client
 * @param {ProductInfo} productInfo
 * @returns {string|undefined}
 */
export default function getExternalChartUrl(
    config: Config,
    client: User,
    productInfo: ProductInfo
): string | undefined {
    // [WF-935]
    const {vwdId, vwdIdentifierType} = getVwdIdParams(productInfo);

    if (!vwdId) {
        return;
    }

    return `${config.vwdChartTemplateUrl}?${getQueryString({
        culture: client.culture === 'NL' ? 'nl' : 'en',
        instrumentKey: `${vwdIdentifierType || VwdIdentifierTypes.ISSUE_ID}:${vwdId}`,
        userIdentifier: client.id,
        tz: client.timezone
    })}`;
}
