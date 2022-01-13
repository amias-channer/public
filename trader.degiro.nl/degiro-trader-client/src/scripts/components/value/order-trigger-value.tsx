import {OrderTypeIds} from 'frontend-core/dist/models/order';
import {ProductInfo} from 'frontend-core/dist/models/product';
import * as React from 'react';
import {CommonOrderEvents} from '../../event-broker/event-types';
import isMarketOrderPrice from '../../services/product/is-market-order-price';
import {EventBrokerContext} from '../app-component/app-context';
import useNumericValue from './hooks/use-numeric-value';
import {NumericValueProps, valuePlaceholder} from './index';
import prepareNumericValueParam from './utils/prepare-numeric-value-param';
import {orderTriggerValue} from './value.css';

interface Props extends NumericValueProps {
    productInfo: ProductInfo;
    checkMarketPrice?: boolean;
}

const {useContext} = React;
// in orders book: B1Price, B2Price, ...
const sellActionFieldPattern: RegExp = /B[0-9]+Price|BidPrice/;
const defaultPriceFormatting: NumericValueProps['formatting'] = {preset: 'price'};
const OrderTriggerValue: React.FunctionComponent<Props> = ({
    productInfo,
    checkMarketPrice,
    formatting = defaultPriceFormatting,
    value,
    ...restProps
}) => {
    const eventBroker = useContext(EventBrokerContext);
    const {brackets, prefix, showPositiveSign} = restProps;
    const numericValue: number | null | undefined = prepareNumericValueParam(value);
    // eslint-disable-next-line prefer-const
    let {sign, content, rootNodeProps} = useNumericValue({...restProps, value: numericValue, formatting});
    const isBuyAction: boolean = !sellActionFieldPattern.test(restProps.field);

    if (numericValue == null || content === valuePlaceholder) {
        return <span {...rootNodeProps}>{valuePlaceholder}</span>;
    }

    let isMarketOrder: boolean = false;

    if (checkMarketPrice && isMarketOrderPrice(numericValue)) {
        isMarketOrder = true;
        content = 'MKT';
        sign = '';
    }

    const contentWithoutSign: string = sign === '-' ? content.slice(1) : content;
    const openMarketOrder = () => {
        eventBroker.emit(CommonOrderEvents.OPEN, {orderTypeId: OrderTypeIds.MARKET, isBuyAction, productInfo});
    };
    const openOrder = () => {
        eventBroker.emit(CommonOrderEvents.OPEN, {orderData: {limit: numericValue}, isBuyAction, productInfo});
    };

    return (
        <button
            type="button"
            {...rootNodeProps}
            className={`${orderTriggerValue} ${rootNodeProps.className || ''}`}
            onClick={isMarketOrder ? openMarketOrder : openOrder}>
            {brackets ? '(' : undefined}
            {prefix}
            {showPositiveSign || sign !== '+' ? sign : undefined}
            {contentWithoutSign}
            {brackets ? ')' : undefined}
        </button>
    );
};

export default React.memo(OrderTriggerValue);
