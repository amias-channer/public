import getDictionary from '../dictionary/get-dictionary';
import sortProductTypes from './sort-product-types';
export default async function getProductTypes(config) {
    const dictionary = await getDictionary(config);
    return [...dictionary.productTypes].sort(sortProductTypes);
}
//# sourceMappingURL=get-product-types.js.map