import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import {OrderConfirmation} from 'frontend-core/dist/models/order';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import isUsExchange from 'frontend-core/dist/services/exchange/is-us-exchange';
import localize from 'frontend-core/dist/services/i18n/localize';
import getFeeScheduleLink from 'frontend-core/dist/services/order/get-fee-schedule-link';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import * as React from 'react';
import {label, line, valueItem} from '../../../../../styles/details-overview.css';
import {Statuses} from '../../../../models/status';
import getUsSubscriptionSettings from '../../../../services/us-subscription/get-us-subscription-settings';
import isUsSubscriptionAvailable from '../../../../services/us-subscription/is-us-subscription-available';
import {ConfigContext, CurrentClientContext, I18nContext} from '../../../app-component/app-context';
import ExternalHtmlContent from '../../../external-html-content';
import StatusIcon from '../../../status/status-icon';
import {nbsp} from '../../../value';
import {documentsInfo, infoSection} from '../order-confirmation.css';
import OrderConfirmationFeeLine from './fee-line';
import {feesContent, feesHeader} from './order-confirmation-fees.css';

interface Props {
    productInfo: ProductInfo;
    orderConfirmation: OrderConfirmation;
}

const {useContext, useEffect} = React;
const OrderConfirmationFees: React.FunctionComponent<Props> = ({productInfo, orderConfirmation}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const {confirmationId, transactionFee, transactionOppositeFee, showExAnteReportLink} = orderConfirmation;
    const {value: usSubscriptionSettings, error: usSubscriptionSettingsError} = useAsync(
        () => (isUsSubscriptionAvailable() ? getUsSubscriptionSettings(config) : Promise.resolve(undefined)),
        [config]
    );

    useEffect(() => {
        if (usSubscriptionSettingsError) {
            logErrorLocally(usSubscriptionSettingsError);
            logErrorRemotely(usSubscriptionSettingsError);
        }
    }, [usSubscriptionSettingsError]);

    // no fees data at all
    if (transactionFee === undefined && transactionOppositeFee === undefined) {
        return null;
    }

    let shouldShowEnabledUsPlan: boolean = false;
    let shouldShowDisabledUsPlan: boolean = false;

    if (usSubscriptionSettings && transactionFee !== undefined && isUsExchange(productInfo.exchangeId)) {
        shouldShowEnabledUsPlan = transactionFee === 0 && usSubscriptionSettings.thisMonthChecked;
        shouldShowDisabledUsPlan = transactionFee > 0 && !usSubscriptionSettings.nextMonthChecked;
    }

    return (
        <div className={infoSection} data-name="orderConfirmationFees">
            {transactionFee !== undefined && (
                <OrderConfirmationFeeLine
                    field="transactionFee"
                    label={localize(i18n, 'trader.orderConfirmation.fees.transactionFee')}
                    value={transactionFee}
                />
            )}
            {transactionOppositeFee !== undefined && (
                <OrderConfirmationFeeLine
                    field="transactionOppositeFee"
                    label={localize(i18n, 'trader.orderConfirmation.fees.transactionOppositeFee')}
                    value={transactionOppositeFee}
                />
            )}
            {shouldShowEnabledUsPlan && (
                <div className={line}>
                    <div className={label}>{nbsp}</div>
                    <div className={valueItem}>
                        {localize(i18n, 'trader.navigation.settings.usSubscription')}
                        <StatusIcon className={inlineRight} status={Statuses.SUCCESS} />
                    </div>
                </div>
            )}
            {shouldShowEnabledUsPlan && (
                <ExternalHtmlContent>
                    {localize(i18n, 'trader.usSubscriptionSettings.orderConfirmation.enabled.description')}
                </ExternalHtmlContent>
            )}
            {shouldShowDisabledUsPlan && (
                <ExternalHtmlContent>
                    {localize(i18n, 'trader.usSubscriptionSettings.orderConfirmation.disabled.description')}
                </ExternalHtmlContent>
            )}
            {showExAnteReportLink && (
                <ExternalHtmlContent className={documentsInfo} data-name="exAnteFeesReport">
                    {localize(i18n, 'trader.orderConfirmation.exAnteFeesReport', {
                        reportUrl: `${config.reportingUrl}v4/ex-ante-fees-report/${confirmationId}?${getQueryString({
                            intAccount: currentClient.intAccount,
                            sessionId: config.sessionId
                        })}`
                    })}
                </ExternalHtmlContent>
            )}
            <ExternalHtmlContent className={documentsInfo} data-name="feeSchedule">
                {localize(i18n, 'trader.orderConfirmation.feeSchedule', {
                    0: getFeeScheduleLink(currentClient, i18n)
                })}
            </ExternalHtmlContent>
            {productInfo.productTypeId !== ProductTypeIds.STOCK && (
                <div className={documentsInfo}>
                    <div className={feesHeader}>{localize(i18n, 'trader.orderConfirmation.productFees')}</div>(
                    {localize(i18n, 'trader.orderConfirmation.productFeesHint')})
                    <div className={feesContent}>{localize(i18n, 'trader.orderConfirmation.productFeesExpected')}</div>
                </div>
            )}
        </div>
    );
};

export default React.memo(OrderConfirmationFees);
