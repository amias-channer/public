import {ProductInfo} from 'frontend-core/dist/models/product';

export enum InitialPriceSources {
    // on BE enum keys do not have underscore separators
    CLOSE_PRICE = 'CLOSEPRICE',
    TRANSACTION = 'TRANSACTION'
}

export interface PriceAlert {
    id: number;
    positionSize: number; // negative for short positions, positive for long positions
    productId: ProductInfo['id'];
    firePrice: number;
    firePriceDate: string; // ISO date
    initialPrice: number;
    initialPriceDate: string; // ISO date
    initialPriceSource: InitialPriceSources;
    triggerPrice: number;
    // when equals to 1, display *) notice;
    // when equals to 0, display **) notice, 2147483647 (MAX_INT) for short positions
    fireCountLeft: number;
    depreciationPercent: number;
    depreciationValue: number;
    notificationDate: string; // ISO date
}

export interface PriceAlertsResultResponse {
    offset: number;
    total?: number;

    // `rows` prop is missing when there is no data
    rows?: PriceAlert[];
}

export type PriceAlertsResult = Omit<PriceAlertsResultResponse, 'rows'> &
    Required<Pick<PriceAlertsResultResponse, 'rows'>>;

export type PriceAlertsSortColumn = 'notificationDate' | 'positionSize' | 'depreciationPercent';

export interface PriceAlertsSettings {
    enabled?: boolean;
}
