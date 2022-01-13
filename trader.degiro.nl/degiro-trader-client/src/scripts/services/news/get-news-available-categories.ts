import {Config} from 'frontend-core/dist/models/config';
import {ProductInfo} from 'frontend-core/dist/models/product';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {NewsSubCategoryId} from '../../models/news';

export default function getNewsAvailableCategories(
    config: Config,
    params: ProductInfo['id'][]
): Promise<NewsSubCategoryId[]> {
    return requestToApi({
        config,
        method: 'POST',
        url: config.refinitivTopNewsCategoriesUrl,
        body: params
    });
}
