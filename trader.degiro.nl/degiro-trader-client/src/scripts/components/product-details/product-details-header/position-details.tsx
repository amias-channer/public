import {PositionId} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {PositionFields} from '../../portfolio/positions-table-columns';
import {nbsp} from '../../value';
import NumericValue from '../../value/numeric';
import Price from '../../value/price';
import {positionDetails, positionDetailsLabel, positionDetailsPrice} from './product-details-header.css';

interface Props {
    id: PositionId;
    currency: string;
    price: number;
    quantity: number;
}

const {useContext, memo} = React;
const PositionDetails: React.FunctionComponent<Props> = memo<Props>(({id, currency, price, quantity}) => {
    const i18n = useContext(I18nContext);

    return (
        <div data-name="positionDetails" data-id={id} className={positionDetails}>
            <Price
                id={id}
                value={price}
                className={positionDetailsPrice}
                prefix={`${getCurrencySymbol(currency)}${nbsp}`}
                field="valueInProductCurrency"
            />
            <NumericValue
                id={id}
                value={quantity}
                field={PositionFields.QUANTITY}
                prefix={`${localize(i18n, 'trader.paymentDetails.quantityUnits')}${nbsp}`}
                brackets={true}
            />
            <span className={positionDetailsLabel}>
                {localize(i18n, 'trader.productDetails.positionDetails.position')}
            </span>
        </div>
    );
});

PositionDetails.displayName = 'PositionDetails';
export default PositionDetails;
