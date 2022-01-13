import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {buttonsLine, formButton, formMessage, formTitle} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import {
    CombinationOrderData,
    CombinationOrderStrategyLeg,
    CombinationOrderStrategyLegIndex,
    CombinationOrderStrategyResult,
    PriceConditionIds
} from 'frontend-core/dist/models/combination-order';
import {Exchange} from 'frontend-core/dist/models/exchange';
import {OptionUnderlying} from 'frontend-core/dist/models/option';
import {OrderActionTypes, OrderConfirmation, OrderTimeTypeNames} from 'frontend-core/dist/models/order';
import {ProductInfo} from 'frontend-core/dist/models/product';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import isAppError from 'frontend-core/dist/services/app-error/is-app-error';
import isProductGovernanceSettingsChangeNeededError from 'frontend-core/dist/services/app-error/is-product-governance-setting-change-needed-error';
import checkCombinationOrder from 'frontend-core/dist/services/combination-order/check-combination-order';
import checkCombinationOrderStrategy from 'frontend-core/dist/services/combination-order/check-combination-order-strategy';
import createCombinationOrder from 'frontend-core/dist/services/combination-order/create-combination-order';
import getCombinationOrderExchanges from 'frontend-core/dist/services/exchange/get-combination-order-exchanges';
import {filterOptionAllId} from 'frontend-core/dist/services/filter';
import localize from 'frontend-core/dist/services/i18n/localize';
import getOptionUnderlyings from 'frontend-core/dist/services/products/option/get-option-underlyings';
import * as React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {OrderResult} from '../../../models/order';
import {Statuses} from '../../../models/status';
import {Routes} from '../../../navigation';
import getCombinationOrderStrategy from '../../../services/combination-order/get-combination-order-strategy';
import trackOrderError from '../../../services/order/track-order-error';
import AccountRestrictionMessage from '../../account-restriction-message/index';
import {AppApiContext, ConfigContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';
import PanelHeader from '../../app-component/side-information-panel/header';
import {content, contentLayout} from '../../app-component/side-information-panel/side-information-panel.css';
import {ButtonVariants, getButtonClassName} from '../../button';
import Spinner from '../../progress-bar/spinner';
import ProductGovernanceSettingsWarning from '../../settings/product-governance-settings/settings-warning';
import {showProductGovernanceSettingsWarningModal} from '../../settings/product-governance-settings/settings-warning/modal-helpers';
import StatusIcon from '../../status/status-icon';
import {warningBox} from '../order-form.css';
import CombinationOrderFormLayout from './form-layout';
import CombinationOrderConfirmation from './order-confirmation';
import ProductPicker from './product-picker/index';
import {ExchangeSelectOption, getExchangeSelectOption} from './state-helpers/exchange-select-option';
import {getUnderlyingSelectOption, UnderlyingSelectOption} from './state-helpers/underlying-select-option';

interface Props {
    onClose(): void;
}

type FormData = Omit<CombinationOrderData, 'size' | 'price'> & Partial<Pick<CombinationOrderData, 'size' | 'price'>>;

const {useState, useEffect, useContext} = React;
const openOrdersButtonClassName: string = getButtonClassName({variant: ButtonVariants.OUTLINED, className: formButton});
const getInitialFormData = (): FormData => ({
    orderTimeType: OrderTimeTypeNames.DAY,
    strategy: {
        payReceive: PriceConditionIds.PAY,
        legs: [
            {buySell: OrderActionTypes.BUY, productId: filterOptionAllId},
            {buySell: OrderActionTypes.BUY, productId: filterOptionAllId}
        ]
    }
});
const CombinationOrderForm: React.FunctionComponent<Props> = ({onClose}) => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData>(getInitialFormData);
    const [exchangeOptions, setExchangeOptions] = useState<ExchangeSelectOption[]>([]);
    const [underlyingOptions, setUnderlyingOptions] = useState<UnderlyingSelectOption[]>([]);
    const [products, setProducts] = useState<ProductInfo[]>([]);
    const [exchange, setExchange] = useState<Exchange | undefined>();
    const [underlying, setUnderlying] = useState<OptionUnderlying | undefined>();
    const [error, setError] = useState<AppError | undefined>();
    const [orderResult, setOrderResult] = useState<OrderResult | undefined>();
    const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | undefined>();
    const [strategyValue, setStrategyValue] = useState<string | undefined>();
    const [productPickerIndex, setProductPickerIndex] = useState<CombinationOrderStrategyLegIndex | undefined>();
    const onRequestError = (error: Error | AppError) => {
        setIsLoading(false);
        trackOrderError(error, {orderType: 'COMBINATION_ORDER', formData});

        if (isProductGovernanceSettingsChangeNeededError(error)) {
            showProductGovernanceSettingsWarningModal({app, error, i18n, history});
            return;
        }

        if (isAppError(error) && getFieldErrors(error)) {
            setError(error);
            return;
        }

        let errorText: string = (isAppError(error) && error.text) || 'order.error.default';

        // TODO: remove when backend will be fixed
        if (errorText === 'combi.strategy.invalid') {
            errorText = 'trader.combinationOrder.invalidStrategy';
        }

        app.openModal({
            error: new AppError({...error, text: errorText})
        });
    };
    const selectProduct = (strategyLegIndex: CombinationOrderStrategyLegIndex, productInfo: ProductInfo) => {
        setProductPickerIndex(undefined);
        setProducts((products) => {
            const newProducts = [...products];

            newProducts[strategyLegIndex] = productInfo;

            return newProducts;
        });
        setFormData((formData) => {
            const {strategy} = formData;
            const strategyLeg: CombinationOrderStrategyLeg = strategy.legs[strategyLegIndex];

            strategyLeg.productId = productInfo.id;

            return {
                ...formData,
                strategy: {
                    ...strategy
                }
            };
        });
    };
    const onExchangeChange = (exchange: Exchange | undefined) => {
        setExchange(exchange);
        setUnderlyingOptions([]);

        if (!exchange) {
            return;
        }

        setIsLoading(true);

        getOptionUnderlyings(config, currentClient, {optionExchangeId: exchange.id})
            .then((underlyings: OptionUnderlying[]) => {
                setIsLoading(false);
                setUnderlyingOptions(underlyings.map(getUnderlyingSelectOption));
                setUnderlying(underlyings[0]);
            })
            .catch(onRequestError);
    };
    const onFormDataSubmit = (orderData: CombinationOrderData) => {
        setIsLoading(true);
        setOrderConfirmation(undefined);
        setError(undefined);

        checkCombinationOrder(config, orderData)
            .then((orderConfirmation: OrderConfirmation) => {
                setIsLoading(false);
                setOrderConfirmation(orderConfirmation);
            })
            .catch(onRequestError);
    };
    const onOrderConfirm = (orderData: CombinationOrderData, orderConfirmation: OrderConfirmation) => {
        setIsLoading(true);
        setOrderConfirmation(undefined);
        setError(undefined);

        createCombinationOrder(config, orderData, orderConfirmation)
            .then(() => {
                setIsLoading(false);
                setOrderResult({
                    status: Statuses.SUCCESS,
                    title: localize(i18n, 'trader.createOrder.result.success.title')
                });
            })
            .catch(onRequestError);
    };

    useEffect(() => {
        // reset the data which depends on exchange or underlying
        setError(undefined);
        setProducts([]);
        setStrategyValue(undefined);
        setFormData(getInitialFormData());
    }, [exchange?.id, underlying?.id]);

    useEffect(() => {
        const {strategy} = formData;
        const firstLegProductId: ProductInfo['id'] = strategy.legs[0].productId;
        const secondLegProductId: ProductInfo['id'] = strategy.legs[1].productId;

        if (firstLegProductId === filterOptionAllId || secondLegProductId === filterOptionAllId) {
            return;
        }

        setIsLoading(true);
        setStrategyValue(undefined);

        checkCombinationOrderStrategy(config, strategy)
            .then((result: CombinationOrderStrategyResult) => {
                setIsLoading(false);
                setStrategyValue(getCombinationOrderStrategy(result.message));
            })
            .catch(onRequestError);
    }, [formData.strategy]);

    useEffect(() => {
        getCombinationOrderExchanges(config, currentClient)
            .then((exchanges: Exchange[]) => {
                const defaultExchange: Exchange | undefined =
                    exchanges.find((exchange: Exchange) => Number(exchange.id) === 1) || exchanges[0];

                setIsLoading(false);
                setExchangeOptions(exchanges.map(getExchangeSelectOption.bind(null, i18n)));
                onExchangeChange(defaultExchange);
            })
            .catch(logErrorLocally);
    }, []);

    const {isCombinationOrderAvailable} = currentClient;
    const firstProduct: ProductInfo | undefined = products[0];
    const secondProduct: ProductInfo | undefined = products[1];
    const anyProduct: ProductInfo | undefined = firstProduct || secondProduct;

    return (
        <div data-name="combinationOrderForm" className={contentLayout}>
            {productPickerIndex !== undefined && underlying && exchange && (
                <ProductPicker
                    exchange={exchange}
                    underlying={underlying}
                    onProductSelect={selectProduct.bind(null, productPickerIndex)}
                    onClose={setProductPickerIndex.bind(null, undefined)}
                />
            )}
            <PanelHeader onAction={onClose}>{localize(i18n, 'trader.combinationOrder.title')}</PanelHeader>
            {isCombinationOrderAvailable && !orderResult && !orderConfirmation && anyProduct && (
                <ProductGovernanceSettingsWarning className={warningBox} onAction={onClose} productInfo={anyProduct} />
            )}
            {!isCombinationOrderAvailable ? (
                <div className={content}>
                    <AccountRestrictionMessage onUpgradeClick={onClose} moduleName="trader.combinationOrder.title" />
                </div>
            ) : (
                <div className={content}>
                    {isLoading ? (
                        <Spinner />
                    ) : orderResult ? (
                        <div data-name="orderResult">
                            <div className={formTitle}>
                                <StatusIcon className={inlineLeft} status={orderResult.status} /> {orderResult.title}
                            </div>
                            <div className={formMessage}>{orderResult.description}</div>
                            <div className={buttonsLine}>
                                <Link className={openOrdersButtonClassName} to={Routes.OPEN_ORDERS} onClick={onClose}>
                                    {localize(i18n, 'trader.orderForm.depositResult.viewActionOrder')}
                                </Link>
                            </div>
                        </div>
                    ) : orderConfirmation && firstProduct && secondProduct && strategyValue ? (
                        <CombinationOrderConfirmation
                            orderConfirmation={orderConfirmation}
                            orderData={formData as CombinationOrderData}
                            firstProduct={firstProduct}
                            secondProduct={secondProduct}
                            strategyValue={strategyValue}
                            onConfirm={onOrderConfirm.bind(null, formData as CombinationOrderData, orderConfirmation)}
                            onCancel={setOrderConfirmation.bind(null, undefined)}
                        />
                    ) : (
                        <CombinationOrderFormLayout
                            onClose={onClose}
                            productPickerIndex={productPickerIndex}
                            formData={formData}
                            firstProduct={firstProduct}
                            secondProduct={secondProduct}
                            underlying={underlying}
                            strategyValue={strategyValue}
                            exchange={exchange}
                            exchangeOptions={exchangeOptions}
                            error={error}
                            underlyingOptions={underlyingOptions}
                            setProductPickerState={setProductPickerIndex}
                            onExchangeChange={onExchangeChange.bind(null)}
                            onUnderlyingChange={setUnderlying}
                            onFormDataChange={setFormData}
                            onSubmit={onFormDataSubmit.bind(null, formData as CombinationOrderData)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default React.memo(CombinationOrderForm);
