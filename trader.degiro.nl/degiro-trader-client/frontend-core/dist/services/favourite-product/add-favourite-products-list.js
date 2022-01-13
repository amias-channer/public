import requestToApi from '../api-requester/request-to-api';
export default function addFavouriteProductsList(config, params) {
    return requestToApi({
        config,
        url: `${config.paUrl}favourites/lists`,
        method: 'POST',
        body: params
    }).then((id) => ({
        ...params,
        id,
        productIds: []
    }));
}
//# sourceMappingURL=add-favourite-products-list.js.map