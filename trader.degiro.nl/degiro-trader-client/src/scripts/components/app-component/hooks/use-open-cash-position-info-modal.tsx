import {Link} from 'react-router-dom';
import * as React from 'react';
import {Position} from 'frontend-core/dist/models/product';
import {formMessage} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import {CashFundInfo as CashFundInfoModel} from 'frontend-core/dist/models/cash-fund';
import getCashFundInfoFromPortfolio from 'frontend-core/dist/services/cash-fund/get-cash-fund-info-from-portfolio';
import hasFlatexBankAccount from 'frontend-core/dist/services/user/has-flatex-bank-account';
import localize from 'frontend-core/dist/services/i18n/localize';
import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import isCompensationCappingExceeded from '../../../services/user/is-compensation-capping-exceeded';
import {CurrencyOrderEvents} from '../../../event-broker/event-types';
import {ModalSizes} from '../../modal';
import ProductName from '../../product-name';
import StatusBox from '../../status/status-box';
import {Statuses} from '../../../models/status';
import {modalButton, modalButtonsLine, warningBox} from '../../account-summary/sections/cash-value/cash-value.css';
import ExternalHtmlContent from '../../external-html-content';
import CashFundInfo from '../../cash-fund-info';
import Button, {ButtonVariants, getButtonClassName} from '../../button';
import CashOrderButton from '../../order/cash-order-button';
import {AppApiContext, ConfigContext, CurrentClientContext, EventBrokerContext, I18nContext} from '../app-context';
import useTotalPortfolio from '../../../hooks/use-total-portfolio';

const {useContext, useCallback} = React;
const currencySettingsButtonClassName: string = getButtonClassName({
    variant: ButtonVariants.OUTLINED,
    className: modalButton
});
const cashOrderButtonClassName: string = getButtonClassName({variant: ButtonVariants.ACCENT, className: modalButton});

export default function useOpenCashPositionInfoModal(position: Position) {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const eventBroker = useContext(EventBrokerContext);
    const currentClient = useContext(CurrentClientContext);
    const {baseCurrency} = config;
    const {productInfo} = position;
    const {totalPortfolio} = useTotalPortfolio();

    return useCallback(() => {
        const shouldShowCompensationCappingWarning = isCompensationCappingExceeded(totalPortfolio, currentClient);
        const cashFundInfo: CashFundInfoModel = getCashFundInfoFromPortfolio(
            config,
            currentClient,
            position,
            totalPortfolio
        );
        const compensationCapping: number | undefined = currentClient.accountInfo?.compensationCapping;
        const hasFlatexCashFunds: boolean = hasFlatexBankAccount(currentClient);

        app.openModal({
            size: ModalSizes.MEDIUM,
            title: hasFlatexCashFunds ? (
                localize(i18n, 'trader.flatexCashFunds.title')
            ) : (
                <ProductName productInfo={productInfo} />
            ),
            content: (
                <>
                    {shouldShowCompensationCappingWarning && (
                        <StatusBox
                            status={Statuses.WARNING}
                            className={warningBox}
                            title={
                                hasFlatexCashFunds
                                    ? localize(i18n, 'trader.flatexCashFunds.compensationCappingWarning.title')
                                    : localize(i18n, 'trader.cashFunds.compensationCappingWarning.title')
                            }
                            body={
                                hasFlatexCashFunds
                                    ? localize(i18n, 'trader.flatexCashFunds.compensationCappingWarning.description', {
                                          compensationCapping
                                      })
                                    : localize(i18n, 'trader.cashFunds.compensationCappingWarning.description', {
                                          compensationCapping
                                      })
                            }
                        />
                    )}
                    {/* [CLM-233] if cash is available on Flatex then we should show alternative translations */}
                    <ExternalHtmlContent className={formMessage}>
                        {hasFlatexCashFunds
                            ? localize(i18n, 'trader.flatexCashFunds.description', {currency: baseCurrency})
                            : localize(i18n, 'trader.cashFunds.description', {currency: baseCurrency})}
                    </ExternalHtmlContent>
                    <CashFundInfo inlineStartValueItems={true} productInfo={productInfo} cashFundInfo={cashFundInfo} />
                </>
            ),
            footer: currentClient.areCurrencySettingsAvailable && (
                <div className={modalButtonsLine}>
                    <Button
                        data-name="currencyOrderButton"
                        className={modalButton}
                        variant={ButtonVariants.OUTLINED}
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={() => {
                            app.closeModal();
                            eventBroker.emit(CurrencyOrderEvents.OPEN);
                        }}>
                        {localize(i18n, 'trader.currencyOrder.title')}
                    </Button>
                    <Link
                        tabIndex={0}
                        className={currencySettingsButtonClassName}
                        onClick={app.closeModal}
                        data-name="currencySettingsButton"
                        to={Routes.CURRENCY_SETTINGS}>
                        {localize(i18n, 'trader.navigation.settings.currency')}
                    </Link>
                    <CashOrderButton className={cashOrderButtonClassName} onClick={app.closeModal} />
                </div>
            )
        });
    }, [app, config, productInfo, currentClient, position, totalPortfolio, eventBroker]);
}
