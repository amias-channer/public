import { favouriteProductsDefaultListFakeId, favouriteProductsDefaultListName } from '../../models/favourite-product';
import requestToApi from '../api-requester/request-to-api';
const getListWeight = (list) => (list.isDefault ? 1 : 0);
export default function getFavouriteProductsLists(config) {
    return requestToApi({
        config,
        url: `${config.paUrl}favourites/lists`
    }).then((lists) => {
        const hasDefaultList = lists.some((list) => list.isDefault);
        if (!hasDefaultList) {
            lists = [
                {
                    id: favouriteProductsDefaultListFakeId,
                    name: favouriteProductsDefaultListName,
                    productIds: [],
                    isDefault: true
                },
                ...lists
            ];
        }
        return lists
            .sort((list1, list2) => getListWeight(list2) - getListWeight(list1))
            .map((list) => ({
            ...list,
            productIds: (list.productIds || []).map((productId) => String(productId))
        }));
    });
}
//# sourceMappingURL=get-favourite-products-lists.js.map