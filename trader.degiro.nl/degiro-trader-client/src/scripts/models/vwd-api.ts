import {ProductInfo} from 'frontend-core/dist/models/product';

export interface VwdApiOptions {
    userToken: string;
    timezone?: string;
    locale: string;
}

export interface VwdApiEvent extends Event {
    message: string;
    reason: string;
    cause: string;
}

export interface VwdChartPoint {
    value: number;
}

export interface VwdChartOptions {
    target: string | HTMLElement;
    template: string;
    series: string[];
    period?: string;
}

export enum VwdChartTypes {
    AREA = 'area',
    CANDLESTICK = 'candlestick',
    OHLC = 'ohlc'
}

export type VwdChartType = VwdChartTypes.AREA | VwdChartTypes.CANDLESTICK | VwdChartTypes.OHLC;

export interface VwdChartUpdateOptions {
    period?: string;
    resolution?: string;
    start?: string;
    end?: string;
    streaming?: boolean;
    compare?: ProductInfo;
    chartType?: VwdChartType;
    tradeOnClick?: boolean;
}

export interface VwdChartDataSerie {
    dataSource: string;
    description: string;
    color?: string;
}

export interface VwdChartSerie {
    updateValues(data: any): any;
    [key: string]: any;
}

export interface VwdChartSeries extends Array<VwdChartSerie> {
    add(serie: {key: string; dataseries: VwdChartDataSerie[]}): void;
    remove(index: number): void;
}

type VwdApiEventType =
    // Used events
    | 'error'
    | 'dataerror'
    | 'initcomplete'
    | 'dataseriesclicked'
    // Used events but grabbed from source
    | 'configchanged'
    | 'periodchanged'
    //
    | 'resize'
    | 'repaint'
    | 'metaupdated'
    | 'resolutionchanged'
    //
    | 'dataseriesdataloading'
    | 'dataseriesdataloaded'
    | 'dataseriesreplaced'
    | 'dataserieshidden'
    | 'dataseriesshowing'
    | 'dataseriesshown'
    | 'dataseriestogglechanged'
    | 'dataseriesremoving'
    | 'dataseriesupdated'
    | 'dataseriesupdating'
    | 'dataserieshiding'
    | 'dataseriesclear'
    | 'dataseriesadded'
    | 'dataseriesmarkerremoving'
    | 'dataseriesmarkerremoved'
    //
    | 'dataadded'
    | 'dataloading'
    | 'dataloaded'
    //
    | 'seriesremoving'
    | 'seriesremoved'
    | 'seriesadded'
    | 'seriesreplaced';

export interface VwdChart {
    container: HTMLElement;
    series: VwdChartSeries;
    create(options: VwdChartOptions): VwdChart;
    update(options: VwdChartUpdateOptions): VwdChart;
    on(event: VwdApiEventType, callback: (event: VwdApiEvent, point?: VwdChartPoint) => any): any;
    off(event?: VwdApiEventType, callback?: Function): any;
    destroy(): any;
    [key: string]: any;
}

export type VwdChartPeriodValue =
    | 'ALL'
    | 'YTD'
    | 'P1D'
    | 'P1W'
    | 'P1M'
    | 'P3M'
    | 'P6M'
    | 'P1Y'
    | 'P3Y'
    | 'P5Y'
    | 'P50Y';

export interface VwdChartPeriod {
    value: VwdChartPeriodValue;
    translation: string;
    amount?: number;
    default?: boolean;
}
