import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import * as React from 'react';
import {label as labelClassName, line, valueItem} from '../../../../../styles/details-overview.css';
import {ConfigContext} from '../../../app-component/app-context';
import ExternalHtmlContent from '../../../external-html-content';
import {nbsp} from '../../../value';
import Amount from '../../../value/amount';

interface Props {
    label: string;
    field: 'transactionFee' | 'transactionOppositeFee';
    value: number;
}

const {useContext} = React;
const orderConfirmationFormatting: NumberFormattingOptions = {preset: 'amount', roundSize: 2};
const OrderConfirmationFeeLine: React.FunctionComponent<Props> = ({field, label, value}) => {
    const config = useContext(ConfigContext);

    return (
        <div className={line}>
            <ExternalHtmlContent className={labelClassName}>{label}</ExternalHtmlContent>
            <Amount
                id="orderConfirmation"
                field={field}
                formatting={orderConfirmationFormatting}
                className={valueItem}
                prefix={`${getCurrencySymbol(config.baseCurrency)}${nbsp}`}
                value={value}
            />
        </div>
    );
};

export default React.memo(OrderConfirmationFeeLine);
