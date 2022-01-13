import {
    buttonsLine,
    fieldError as fieldErrorClassName,
    fieldLabel,
    formButton,
    formLine,
    formMessage
} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import getSelectOptionFromPrimitive from 'frontend-core/dist/components/ui-trader4/select/get-select-option-from-primitive';
import Select, {SelectSizes} from 'frontend-core/dist/components/ui-trader4/select/index';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AppError, FieldErrors} from 'frontend-core/dist/models/app-error';
import {CurrencyPairProduct, CurrencySettings} from 'frontend-core/dist/models/currency';
import {CurrencyOrderData, OrderActionTypes, OrderConfirmation} from 'frontend-core/dist/models/order';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import hasTranslation from 'frontend-core/dist/services/i18n/has-translation';
import localize from 'frontend-core/dist/services/i18n/localize';
import checkCurrencyOrder from 'frontend-core/dist/services/order/check-currency-order';
import createCurrencyOrder from 'frontend-core/dist/services/order/create-currency-order';
import {CurrencyOrderRequestDataParams} from 'frontend-core/dist/services/order/get-currency-order-request-data';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import parseNumber from 'frontend-core/dist/utils/number/parse-number';
import * as React from 'react';
import {useHistory} from 'react-router-dom';
import {actionLink} from '../../../../styles/link.css';
import useCurrencyExchangeRate from '../../../hooks/use-currency-exchange-rate';
import useCurrencyPairProduct from '../../../hooks/use-currency-pair-product';
import {OrderResult} from '../../../models/order';
import {Statuses} from '../../../models/status';
import {Routes} from '../../../navigation';
import getCurrenciesToBuy from '../../../services/currency-order/get-currencies-to-buy';
import getCurrenciesToSell from '../../../services/currency-order/get-currencies-to-sell';
import trackOrderError from '../../../services/order/track-order-error';
import {
    AppApiContext,
    ConfigContext,
    CurrentClientContext,
    EventBrokerContext,
    I18nContext
} from '../../app-component/app-context';
import PanelHeader from '../../app-component/side-information-panel/header';
import {content, contentLayout} from '../../app-component/side-information-panel/side-information-panel.css';
import Button, {ButtonVariants} from '../../button';
import ExternalHtmlContent from '../../external-html-content/index';
import {InputSizes} from '../../input/index';
import NumericInput from '../../input/numeric';
import Spinner from '../../progress-bar/spinner';
import {orderFormMainContentText} from '../order-form.css';
import CurrencyOrderConfirmation from './order-confirmation';
import CurrencyOrderResult from './order-result';

export interface CurrencyOrderFormProps {
    onClose(): void;
}

interface CurrencyOption {
    value: string;
    label: string;
    className?: string;
}

type FormData = Partial<Omit<CurrencyOrderData, 'pairProduct'>>;

enum CurrencyOptionIds {
    CURRENCY_SETTINGS = 'CURRENCY_SETTINGS'
}
const createCurrencyOptionFromCurrencySettings = ({currency}: CurrencySettings): CurrencyOption => ({
    value: currency,
    label: currency
});
const getOrderRequestParams = (
    formData: FormData,
    pairProduct: CurrencyPairProduct
): CurrencyOrderRequestDataParams => ({
    orderData: {
        buySell: pairProduct.reversed ? OrderActionTypes.BUY : OrderActionTypes.SELL,

        // [DHELP-22823] price shouldn't be skipped
        price: formData.price || 0,
        amount: formData.amount || 0,
        pairProduct
    }
});
const {useState, useEffect, useCallback, useContext} = React;
const CurrencyOrderForm: React.FunctionComponent<CurrencyOrderFormProps> = ({onClose}) => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const eventBroker = useContext(EventBrokerContext);
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AppError | undefined>(undefined);
    const [sellAmount, setSellAmount] = useState<number | undefined>(undefined);
    const [buyAmount, setBuyAmount] = useState<number | undefined>(undefined);
    const [currencyToSell, setCurrencyToSell] = useState<string | undefined>(undefined);
    const [currencyToBuy, setCurrencyToBuy] = useState<string | undefined>(undefined);
    const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | undefined>(undefined);
    const [orderResult, setOrderResult] = useState<OrderResult | undefined>(undefined);
    const [currenciesToSellOptions, setCurrencyToSellOptions] = useState<CurrencyOption[]>([]);
    const [currencyToBuyOptions, setCurrencyToBuyOptions] = useState<CurrencyOption[]>([]);
    const [formData, setFormData] = useState<FormData>({});
    const pairProduct: CurrencyPairProduct | undefined = useCurrencyPairProduct(currencyToSell, currencyToBuy);
    const exchangeRate: number | undefined = useCurrencyExchangeRate(currencyToSell, currencyToBuy);
    const onCurrencyToSellChange = useCallback(
        (currencyToSell: string | undefined) => {
            setError(undefined);
            setCurrencyToSell(currencyToSell);
            setFormData({});
            setCurrencyToBuyOptions([]);

            if (!currencyToSell) {
                return;
            }

            getCurrenciesToBuy(config, eventBroker, {currencyToSell})
                .then((currencies: readonly CurrencySettings[]) => {
                    const currencyToByOptions: CurrencyOption[] = currencies.map(
                        createCurrencyOptionFromCurrencySettings
                    );

                    if (currencyToByOptions.length < 2) {
                        currencyToByOptions.push({
                            value: CurrencyOptionIds.CURRENCY_SETTINGS,
                            label: localize(i18n, 'trader.currencyOrder.enableCurrency'),
                            className: actionLink
                        });
                    }

                    setCurrencyToBuyOptions(currencyToByOptions);
                })
                .catch(logErrorLocally);
        },
        [i18n]
    );
    const onCurrencyToBuyChange = useCallback((currencyToBuy: string | undefined) => {
        if (currencyToBuy === CurrencyOptionIds.CURRENCY_SETTINGS) {
            history.push(Routes.CURRENCY_SETTINGS);
            setCurrencyToBuy(undefined);
        } else {
            setCurrencyToBuy(currencyToBuy);
        }

        setError(undefined);
        setFormData({});
    }, []);
    const onAmountInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const input: HTMLInputElement = event.currentTarget;

        if (input.validity.valid) {
            setFormData((formData) => ({...formData, amount: parseNumber(input.value)}));
        }
    }, []);
    const onPortfolioButtonClick = useCallback(() => {
        onClose();
        history.push(Routes.PORTFOLIO);
    }, [onClose]);
    const onOrderError = (error: Error | AppError) => {
        const fieldErrors: FieldErrors | undefined = getFieldErrors(error);

        if (fieldErrors) {
            setError(error as AppError);
        } else {
            app.openModal({
                error: new AppError({
                    ...error,
                    text: (error as AppError).text || 'order.error.default'
                })
            });
        }
    };
    const onConfirm = (orderConfirmation: OrderConfirmation, pairProduct: CurrencyPairProduct) => {
        setIsLoading(true);
        setOrderConfirmation(undefined);
        setError(undefined);
        const requestParams: CurrencyOrderRequestDataParams = getOrderRequestParams(formData, pairProduct);

        createCurrencyOrder(config, requestParams, orderConfirmation)
            .then(() => {
                setIsLoading(false);
                setFormData({});
                setOrderResult({status: Statuses.SUCCESS});
            })
            .catch((error: Error | AppError) => {
                setIsLoading(false);
                onOrderError(error);
                trackOrderError(error, {orderType: 'CURRENCY_ORDER', requestParams, orderConfirmation});
            });
    };
    const onFormSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!pairProduct) {
                return;
            }

            setIsLoading(true);
            setError(undefined);
            const requestParams: CurrencyOrderRequestDataParams = getOrderRequestParams(formData, pairProduct);

            checkCurrencyOrder(config, requestParams)
                .then((orderConfirmation: OrderConfirmation) => {
                    setIsLoading(false);
                    setOrderConfirmation(orderConfirmation);
                })
                .catch((error: Error | AppError) => {
                    setIsLoading(false);
                    onOrderError(error);
                    trackOrderError(error, {orderType: 'CURRENCY_ORDER', requestParams});
                });
        },
        [formData, pairProduct]
    );

    useEffect(() => {
        const initialDataPromise = createCancellablePromise(getCurrenciesToSell(config));

        initialDataPromise.promise
            .then((currencies: CurrencySettings[]) => {
                const [firstCurrencySettings] = currencies;

                setIsLoading(false);
                setCurrencyToSellOptions(currencies.map(createCurrencyOptionFromCurrencySettings));
                onCurrencyToSellChange(firstCurrencySettings?.currency);
            })
            .catch(logErrorLocally);

        return initialDataPromise.cancel;
    }, []);

    useEffect(() => {
        if (!pairProduct) {
            return;
        }

        const {amount} = formData;
        // reset previous price
        let price: number | undefined;
        let sellAmount: number | undefined;
        let buyAmount: number | undefined;

        if (amount && exchangeRate) {
            /**
             * @description Send the price on 2% worse than actual price
             * @type {number}
             */
            const correctionPercents: number = 0.02;

            if (pairProduct.reversed) {
                // Rate of [currencyToBuy -> currencyToSell]
                const reversedExchangeRate: number = 1 / exchangeRate;

                // Rate of [currencyToBuy -> currencyToSell] + correction percents
                price = reversedExchangeRate + reversedExchangeRate * correctionPercents;

                // flip the amounts to show for Client correct values
                sellAmount = amount * reversedExchangeRate;
                buyAmount = amount;
            } else {
                // Rate of [currencyToSell -> currencyToBuy] - correction percents
                price = exchangeRate - exchangeRate * correctionPercents;
                sellAmount = amount;
                buyAmount = amount * exchangeRate;
            }
        }

        setFormData({...formData, price});
        setSellAmount(sellAmount);
        setBuyAmount(buyAmount);
    }, [exchangeRate, pairProduct, formData.amount]);

    const descriptionTranslationCode: string = 'trader.currencyOrder.description';
    const fieldErrors: FieldErrors | undefined = error && getFieldErrors(error);
    const amountFieldError: AppError | undefined = fieldErrors && fieldErrors.amount;
    const amountCurrency: string | undefined = pairProduct
        ? pairProduct.reversed
            ? currencyToBuy
            : currencyToSell
        : undefined;

    return (
        <div data-name="currencyOrderForm" className={contentLayout}>
            <PanelHeader onAction={onClose}>{localize(i18n, 'trader.currencyOrder.title')}</PanelHeader>
            <div className={content}>
                {isLoading ? (
                    <Spinner />
                ) : orderResult ? (
                    <CurrencyOrderResult orderResult={orderResult} onPortfolioButtonClick={onPortfolioButtonClick} />
                ) : orderConfirmation && pairProduct ? (
                    <CurrencyOrderConfirmation
                        buyAmount={buyAmount}
                        sellAmount={sellAmount}
                        fromCurrency={currencyToSell}
                        toCurrency={currencyToBuy}
                        onCancel={setOrderConfirmation.bind(null, undefined)}
                        onConfirm={onConfirm.bind(null, orderConfirmation, pairProduct)}
                    />
                ) : (
                    <>
                        {currentClient.areCurrencySettingsAvailable && (
                            <ExternalHtmlContent className={formMessage} data-name="currencySettingsDescription">
                                {localize(i18n, 'trader.currencyOrder.currencySettingsDescription', {
                                    currencySettingsUrl: `#${Routes.CURRENCY_SETTINGS}`
                                })}
                            </ExternalHtmlContent>
                        )}
                        {hasTranslation(i18n, descriptionTranslationCode) && (
                            <ExternalHtmlContent className={formMessage}>
                                {localize(i18n, descriptionTranslationCode)}
                            </ExternalHtmlContent>
                        )}
                        <form
                            autoComplete="off"
                            method="post"
                            onSubmit={onFormSubmit}
                            className={orderFormMainContentText}>
                            <div className={formLine}>
                                <div className={fieldLabel}>{localize(i18n, 'trader.currencyOrder.fromCurrency')}</div>
                                <Select
                                    size={SelectSizes.WIDE}
                                    name="fromCurrency"
                                    required={true}
                                    placeholder={localize(i18n, 'trader.currencyOrder.selectCurrency')}
                                    onChange={onCurrencyToSellChange}
                                    selectedOption={
                                        currencyToSell ? getSelectOptionFromPrimitive(currencyToSell) : undefined
                                    }
                                    options={currenciesToSellOptions}
                                />
                            </div>
                            <div className={formLine}>
                                <div className={fieldLabel}>{localize(i18n, 'trader.currencyOrder.toCurrency')}</div>
                                <Select
                                    size={SelectSizes.WIDE}
                                    name="toCurrency"
                                    required={true}
                                    placeholder={localize(i18n, 'trader.currencyOrder.selectCurrency')}
                                    onChange={onCurrencyToBuyChange}
                                    disabled={!currencyToSell}
                                    selectedOption={
                                        currencyToBuy ? getSelectOptionFromPrimitive(currencyToBuy) : undefined
                                    }
                                    options={currencyToBuyOptions}
                                />
                            </div>
                            <div className={formLine}>
                                <NumericInput
                                    name="amount"
                                    min="0.01"
                                    size={InputSizes.WIDE}
                                    required={true}
                                    placeholder={`${localize(i18n, 'trader.orderForm.amountField')}${
                                        amountCurrency ? ` (${amountCurrency})` : ''
                                    }`}
                                    invalid={Boolean(amountFieldError)}
                                    onInput={onAmountInput}
                                    defaultValue={String(formData.amount || '')}
                                />
                                {amountFieldError && (
                                    <div className={fieldErrorClassName}>{localize(i18n, amountFieldError.text)}</div>
                                )}
                            </div>
                            <div className={buttonsLine}>
                                <Button
                                    type="submit"
                                    variant={ButtonVariants.ACCENT}
                                    className={formButton}
                                    disabled={!sellAmount || !buyAmount}>
                                    {localize(i18n, 'trader.currencyOrder.submitOrder')}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default React.memo(CurrencyOrderForm);
