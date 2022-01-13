import { ProductTypeIds } from '../../models/product-type';
export default function canViewProductType({ id }, client) {
    if (id === ProductTypeIds.OPTION) {
        return Boolean(client.canViewOptions);
    }
    if (id === ProductTypeIds.FUTURE) {
        return Boolean(client.canViewFutures);
    }
    if (id === ProductTypeIds.LEVERAGED) {
        return Boolean(client.canViewLeveragedProducts);
    }
    if (id === ProductTypeIds.WARRANT) {
        return Boolean(client.canViewWarrants);
    }
    if (id === ProductTypeIds.CFD) {
        return Boolean(client.canViewCfd);
    }
    if (id === ProductTypeIds.CERTIFICATE) {
        return Boolean(client.canViewCertificates);
    }
    return true;
}
//# sourceMappingURL=can-view-product-type.js.map