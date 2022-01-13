import {buttonsLine, formButton} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {inlineEndValueItem, label, line, valueItem} from '../../../../styles/details-overview.css';
import {I18nContext} from '../../app-component/app-context';
import Button, {ButtonVariants} from '../../button';
import {nbsp} from '../../value/index';
import Price from '../../value/price';
import {orderFormMainContentText} from '../order-form.css';

interface Props {
    fromCurrency: string | undefined;
    toCurrency: string | undefined;
    sellAmount: number | undefined;
    buyAmount: number | undefined;
    onCancel(): void;
    onConfirm(): void;
}

const {useContext} = React;
const CurrencyOrderConfirmation: React.FunctionComponent<Props> = ({
    fromCurrency,
    toCurrency,
    buyAmount,
    sellAmount,
    onCancel,
    onConfirm
}) => {
    const i18n = useContext(I18nContext);

    return (
        <div className={orderFormMainContentText}>
            <div className={line}>
                <div className={label}>{localize(i18n, 'trader.currencyOrder.sellAmount')}</div>
                <Price
                    id="currencyOrder"
                    field="sellAmount"
                    prefix={fromCurrency && `${fromCurrency}${nbsp}`}
                    className={`${valueItem} ${inlineEndValueItem}`}
                    value={sellAmount}
                />
            </div>
            <div className={line}>
                <div className={label}>{localize(i18n, 'trader.currencyOrder.buyAmount')}</div>
                <Price
                    id="currencyOrder"
                    field="buyAmount"
                    prefix={toCurrency && `${toCurrency}${nbsp}`}
                    className={`${valueItem} ${inlineEndValueItem}`}
                    value={buyAmount}
                />
            </div>
            <div className={buttonsLine}>
                <Button
                    variant={ButtonVariants.OUTLINED}
                    data-name="confirmationCancelButton"
                    className={formButton}
                    onClick={onCancel}>
                    {localize(i18n, 'modals.backTitle')}
                </Button>
                <Button
                    variant={ButtonVariants.ACCENT}
                    data-name="confirmationButton"
                    className={formButton}
                    onClick={onConfirm}>
                    {localize(i18n, 'trader.forms.actions.confirm')}
                </Button>
            </div>
        </div>
    );
};

export default React.memo(CurrencyOrderConfirmation);
