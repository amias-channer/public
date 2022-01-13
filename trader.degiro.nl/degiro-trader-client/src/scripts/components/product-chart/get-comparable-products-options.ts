import {Config} from 'frontend-core/dist/models/config';
import {I18n} from 'frontend-core/dist/models/i18n';
import {WorldMarketIndex} from 'frontend-core/dist/models/market-index';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {User} from 'frontend-core/dist/models/user';
import {filterOptionAllId} from 'frontend-core/dist/services/filter';
import localize from 'frontend-core/dist/services/i18n/localize';
import getWorldMarketsIndices from 'frontend-core/dist/services/market-index/get-world-markets-indices';

export interface ComparableProductsOption {
    value: ProductInfo | number;
    label: string;
}

export default function getComparableProductsOptions(
    config: Config,
    client: User,
    i18n: I18n
): Promise<ComparableProductsOption[]> {
    return getWorldMarketsIndices(config, client).then((indices: WorldMarketIndex[]) => {
        const options: ComparableProductsOption[] = indices
            .filter(({vwdId}) => vwdId != null)
            .map((productInfo) => ({value: productInfo, label: productInfo.name}));

        return options.length
            ? [
                  {
                      value: filterOptionAllId,
                      label: localize(i18n, 'trader.productChart.compareWithNone')
                  },
                  ...options
              ]
            : [];
    });
}
