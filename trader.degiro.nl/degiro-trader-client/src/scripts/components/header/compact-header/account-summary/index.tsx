import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {hiddenValue} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {AccountSummaryEvents} from '../../../../event-broker/event-types';
import {Unsubscribe, unsubscribeAll} from '../../../../event-broker/subscription';
import useLatestTransactions from '../../../../hooks/use-latest-transactions';
import useOpenOrders from '../../../../hooks/use-open-orders';
import useTotalPortfolio from '../../../../hooks/use-total-portfolio';
import getTotalPortfolioCostTypeFields from '../../../../services/total-portfolio/get-total-portfolio-cost-type-fields';
import isCompensationCappingExceeded from '../../../../services/user/is-compensation-capping-exceeded';
import ValuesVisibilityButton from '../../../account-summary/values-visibility-button';
import {ConfigContext, CurrentClientContext, EventBrokerContext, I18nContext} from '../../../app-component/app-context';
import {nbsp} from '../../../value';
import AbsoluteDifference from '../../../value/absolute-difference';
import Amount from '../../../value/amount';
import RelativeDifference from '../../../value/relative-difference';
import {
    accountSummaryToggle,
    accountSummaryToggleIcon,
    content,
    label,
    layout,
    neutralSecondaryValue,
    primaryValue,
    secondaryValue,
    sectionWarningIcon,
    visibilityToggle
} from './account-summary.css';
import useAccountSummaryValueVisibility from '../../../account-summary/hooks/use-account-summary-value-visibility';

const {useState, useEffect, useCallback, useContext, memo} = React;
const AccountSummary = memo(() => {
    const config = useContext(ConfigContext);
    const eventBroker = useContext(EventBrokerContext);
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const [hasOrderView, setOrderViewState] = useState<boolean>(false);
    const [isOpened, setOpenedState] = useState<boolean>(false);
    const [areValuesVisible, setValuesVisibilityState] = useAccountSummaryValueVisibility();
    const orders = useOpenOrders() || [];
    const {transactions} = useLatestTransactions();
    const {totalPortfolio} = useTotalPortfolio();
    const toggleOpenedStateAndNotify = useCallback(() => {
        setOpenedState((isOpened) => {
            eventBroker.emit(isOpened ? AccountSummaryEvents.CLOSE : AccountSummaryEvents.OPEN);
            return !isOpened;
        });
    }, []);

    useEffect(() => {
        const unsubscribeHandlers: Unsubscribe[] = [
            eventBroker.on(AccountSummaryEvents.SWITCH_ON_ORDER_VIEW, setOrderViewState.bind(null, true)),
            eventBroker.on(AccountSummaryEvents.SWITCH_OFF_ORDER_VIEW, setOrderViewState.bind(null, false))
        ];

        return () => unsubscribeAll(unsubscribeHandlers);
    }, []);

    useEffect(() => {
        // close summary, because there is no toggle in Order View state
        if (isOpened && hasOrderView) {
            toggleOpenedStateAndNotify();
        }
    }, [isOpened, hasOrderView]);

    return hasOrderView ? (
        <div className={layout}>
            <div className={content}>
                <Amount
                    id="totalPortfolio"
                    className={primaryValue}
                    field={getTotalPortfolioCostTypeFields(currentClient).defaultField}
                    prefix={`${getCurrencySymbol(config.baseCurrency)}${nbsp}`}
                    value={totalPortfolio[getTotalPortfolioCostTypeFields(currentClient).defaultField]}
                />
                <span className={label}>{localize(i18n, 'trader.totalPortfolio.availableToSpend')}</span>
            </div>
        </div>
    ) : (
        <div className={layout}>
            <div className={content}>
                {isOpened && (
                    <ValuesVisibilityButton
                        className={visibilityToggle}
                        onClick={setValuesVisibilityState.bind(null, !areValuesVisible)}
                        areValuesVisible={areValuesVisible}
                    />
                )}
                <button
                    type="button"
                    data-name="totalPortfolioToggle"
                    className={accountSummaryToggle}
                    onClick={toggleOpenedStateAndNotify}>
                    {isOpened ? (
                        <span className={primaryValue}>{localize(i18n, 'trader.accountSummary.title')}</span>
                    ) : (
                        <>
                            <Amount
                                className={`${primaryValue} ${areValuesVisible ? '' : hiddenValue}`}
                                id="totalPortfolio"
                                prefix={`${getCurrencySymbol(config.baseCurrency)}${nbsp}`}
                                field="total"
                                value={totalPortfolio.total}
                            />
                            <span className={`${secondaryValue} ${areValuesVisible ? '' : hiddenValue}`}>
                                <AbsoluteDifference
                                    neutralValueClassName={neutralSecondaryValue}
                                    highlightValueChange={false}
                                    id="totalPortfolio"
                                    prefix={`${getCurrencySymbol(config.baseCurrency)}${nbsp}`}
                                    field="todayPl"
                                    value={totalPortfolio.todayPl}
                                />
                                {/* backward compatibility with old API based on which we can't calculate this value */}
                                {totalPortfolio.todayRelativePl != null && (
                                    <>
                                        {nbsp}
                                        <RelativeDifference
                                            neutralValueClassName={neutralSecondaryValue}
                                            highlightValueChange={false}
                                            brackets={true}
                                            id="totalPortfolio"
                                            field="todayRelativePl"
                                            value={totalPortfolio.todayRelativePl}
                                        />
                                    </>
                                )}
                            </span>
                        </>
                    )}
                    <Icon type="keyboard_arrow_down" className={accountSummaryToggleIcon} flipped={isOpened} />
                    {!isOpened && (
                        <span className={label}>
                            {isCompensationCappingExceeded(totalPortfolio, currentClient) && (
                                <Icon type="error" className={`${sectionWarningIcon} ${inlineLeft}`} />
                            )}
                            {orders.length} {localize(i18n, 'trader.openOrders.outstandingAmountColumn')}
                            {', '}
                            {transactions.length} {localize(i18n, 'trader.openOrders.executedAmountColumn')}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
});

AccountSummary.displayName = 'AccountSummary';
export default AccountSummary;
