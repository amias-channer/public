import {ProductInfo} from 'frontend-core/dist/models/product';

export default function getVwdIdParams(productInfo: ProductInfo): Pick<ProductInfo, 'vwdId' | 'vwdIdentifierType'> {
    const {vwdId, vwdIdSecondary, vwdIdentifierType, vwdIdentifierTypeSecondary, feedQuality} = productInfo;

    // [WF-935], [WF-1206]
    return vwdIdSecondary && (feedQuality === 'BT' || feedQuality === 'CX')
        ? {
              vwdId: vwdIdSecondary,
              vwdIdentifierType: vwdIdentifierTypeSecondary
          }
        : {
              vwdId,
              vwdIdentifierType
          };
}
