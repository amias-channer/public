import {ProductInfo} from 'frontend-core/dist/models/product';

// [WF-2461] VWD doesn't allow to change chart type when we compare products
export default function canSetChartType(options: {comparableProduct: ProductInfo | undefined}): boolean {
    return !options.comparableProduct;
}
