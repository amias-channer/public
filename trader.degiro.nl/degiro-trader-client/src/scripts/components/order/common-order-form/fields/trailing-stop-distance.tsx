import {Order, TrailingStopOrderOffsetTypes} from 'frontend-core/dist/models/order';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import * as React from 'react';
import {ConfigContext, I18nContext} from '../../../app-component/app-context';
import {nbsp} from '../../../value';
import NumericValue from '../../../value/numeric';

interface TrailingStopOrderLike {
    id: string;
    currency: string;
    pegOffsetType?: number | string;
    pegOffsetValue?: number;
}

interface Props {
    order: Order | TrailingStopOrderLike;
    label?: boolean;
    className?: string;
}

const {useContext} = React;
const orderInputPriceFormatting: NumberFormattingOptions = {preset: 'orderInputPrice'};
const TrailingStopDistance: React.FunctionComponent<Props> = ({order, label, className}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const isPriceOffset: boolean = String(order.pegOffsetType) === String(TrailingStopOrderOffsetTypes.PRICE);

    return (
        <span className={className}>
            {label && (
                <span>
                    {localize(i18n, 'trader.orderForm.trailingStopDistanceField')}
                    {nbsp}:
                </span>
            )}
            <NumericValue
                id={order.id}
                field="pegOffsetValue"
                prefix={isPriceOffset ? `${getCurrencySymbol(config.baseCurrency)}${nbsp}` : undefined}
                value={order.pegOffsetValue}
                formatting={isPriceOffset ? orderInputPriceFormatting : undefined}
            />
            {!isPriceOffset && <span>%</span>}
        </span>
    );
};

export default React.memo(TrailingStopDistance);
