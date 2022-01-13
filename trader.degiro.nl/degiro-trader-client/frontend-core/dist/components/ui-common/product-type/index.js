import * as React from 'react';
import useAsync from '../../../hooks/use-async';
import localize from '../../../services/i18n/localize';
import getProductTypes from '../../../services/product-type/get-product-types';
import { valuePlaceholder } from '../value/index';
const ProductType = ({ id, i18n, config, className, fullName }) => {
    const { value: productType } = useAsync(async () => {
        const productTypes = await getProductTypes(config);
        return productTypes.find((productType) => productType.id === id);
    }, [config]);
    return (React.createElement("span", { "data-id": id, "data-name": "productType", className: className }, productType
        ? localize(i18n, fullName ? productType.translation : productType.briefTranslation)
        : valuePlaceholder));
};
export default React.memo(ProductType);
//# sourceMappingURL=index.js.map