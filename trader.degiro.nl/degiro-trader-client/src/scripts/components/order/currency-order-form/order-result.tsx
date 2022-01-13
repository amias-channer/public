import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {buttonsLine, formButton, formMessage, formTitle} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {OrderResult} from '../../../models/order';
import {I18nContext} from '../../app-component/app-context';
import Button, {ButtonVariants} from '../../button';
import StatusIcon from '../../status/status-icon';
import {nbsp} from '../../value/index';
import {orderFormMainContentText} from '../order-form.css';

interface Props {
    orderResult: OrderResult;
    onPortfolioButtonClick(): void;
}

const {useContext} = React;
const CurrencyOrderResult: React.FunctionComponent<Props> = ({orderResult, onPortfolioButtonClick}) => {
    const i18n = useContext(I18nContext);

    return (
        <div className={orderFormMainContentText}>
            <div className={formTitle}>
                <StatusIcon className={inlineLeft} status={orderResult.status} />
                {nbsp}
                {localize(i18n, 'trader.cashOrder.orderResult.success.title')}
            </div>
            <div className={formMessage}>{localize(i18n, 'trader.cashOrder.orderResult.success.description')}</div>
            <div className={buttonsLine}>
                <Button variant={ButtonVariants.OUTLINED} className={formButton} onClick={onPortfolioButtonClick}>
                    {localize(i18n, 'trader.cashOrder.openPortfolio')}
                </Button>
            </div>
        </div>
    );
};

export default React.memo(CurrencyOrderResult);
