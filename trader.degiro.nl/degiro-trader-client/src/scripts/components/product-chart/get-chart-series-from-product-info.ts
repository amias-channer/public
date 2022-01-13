import {ProductInfo, VwdIdentifierTypes} from 'frontend-core/dist/models/product';
import getVwdIdParams from '../../services/vwd-chart/get-vwd-id-params';

export type SeriesStyle = Partial<{
    color: string;
    upColor: string;
    downColor: string;
    lineWidth: number;
}>;

type DataSeries = SeriesStyle & {
    dataSource: string;
    description: string;
};

export interface Series {
    key: string;
    style: SeriesStyle;
    dataseries: DataSeries[];
}

export default function getChartSeriesFromProductInfo(
    productInfo: ProductInfo,
    style: SeriesStyle
): Series | undefined {
    const {vwdId, vwdIdentifierType = VwdIdentifierTypes.ISSUE_ID} = getVwdIdParams(productInfo);

    return vwdId == null
        ? undefined
        : {
              key: `${vwdIdentifierType}:${vwdId}`,
              style,
              dataseries: [
                  {
                      dataSource: 'price:@key',
                      description: '',
                      ...style
                  }
              ]
          };
}
