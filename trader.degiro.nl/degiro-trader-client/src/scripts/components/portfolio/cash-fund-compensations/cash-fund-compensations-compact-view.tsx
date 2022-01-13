import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {item, primaryContent, primaryContentTitle, secondaryContent} from '../../list/list.css';
import {nbsp} from '../../value';
import Amount from '../../value/amount';
import {CashFundCompensationsViewProps} from './index';

const {useContext} = React;
const CashFundCompensationsCompactView = React.memo<CashFundCompensationsViewProps>(
    ({tableItems, getPayoutControl}) => {
        const i18n = useContext(I18nContext);

        return (
            <>
                {tableItems.map((compensationItem) => {
                    const {id, translation, currency} = compensationItem;

                    return (
                        <div className={item} key={id}>
                            <div className={primaryContent}>
                                <div className={primaryContentTitle} data-field="product">
                                    {localize(i18n, translation)}
                                </div>
                            </div>
                            <div className={secondaryContent}>
                                <Amount
                                    prefix={`${getCurrencySymbol(currency)}${nbsp}`}
                                    field="amount"
                                    value={compensationItem.amount}
                                    id={id}
                                />
                                <span className={inlineRight}>{getPayoutControl(compensationItem)}</span>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    }
);

CashFundCompensationsCompactView.displayName = 'CashFundCompensationsCompactView';
export default CashFundCompensationsCompactView;
