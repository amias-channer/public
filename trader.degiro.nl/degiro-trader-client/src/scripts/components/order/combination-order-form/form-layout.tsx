import {
    fieldError as fieldErrorClassName,
    fieldLabel,
    formLine,
    formLineWithMultipleFields,
    halfWidthFieldLayout
} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import Select, {SelectSizes} from 'frontend-core/dist/components/ui-trader4/select';
import {AppError, FieldErrors} from 'frontend-core/dist/models/app-error';
import {
    CombinationOrderData,
    CombinationOrderStrategyLeg,
    CombinationOrderStrategyLegIndex,
    PriceConditionIds
} from 'frontend-core/dist/models/combination-order';
import {Exchange} from 'frontend-core/dist/models/exchange';
import {OptionUnderlying} from 'frontend-core/dist/models/option';
import {OrderActionTypes, OrderTimeTypeNames} from 'frontend-core/dist/models/order';
import {ProductInfo} from 'frontend-core/dist/models/product';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import localize from 'frontend-core/dist/services/i18n/localize';
import parseNumber from 'frontend-core/dist/utils/number/parse-number';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import Button, {ButtonVariants} from '../../button';
import NumericInput from '../../input/numeric';
import SwitchButtons from '../../switch-buttons';
import {
    activeOrderActionOption,
    activeProductSelectButton,
    orderActionSwitch,
    orderActionSwitchLayout,
    productSelectButton,
    productSelectButtonIcon,
    strategyValue as strategyValueClassName,
    submitButton
} from './combination-order-form.css';
import ProductDetails from './product-details';
import {ExchangeSelectOption, getExchangeSelectOption} from './state-helpers/exchange-select-option';
import {getPriceConditionSelectOption, PriceConditionOption} from './state-helpers/price-condition';
import {getTimeConditionSelectOption, TimeConditionOption} from './state-helpers/time-condition';
import {getUnderlyingSelectOption, UnderlyingSelectOption} from './state-helpers/underlying-select-option';

type FormData = Omit<CombinationOrderData, 'size' | 'price'> & Partial<Pick<CombinationOrderData, 'size' | 'price'>>;

interface Props {
    formData: FormData;
    exchange: Exchange | undefined;
    underlying: OptionUnderlying | undefined;
    error: AppError | undefined;
    firstProduct: ProductInfo | undefined;
    secondProduct: ProductInfo | undefined;
    strategyValue: string | undefined;
    productPickerIndex: CombinationOrderStrategyLegIndex | undefined;
    exchangeOptions: ExchangeSelectOption[];
    underlyingOptions: UnderlyingSelectOption[];
    setProductPickerState(productPickerIndex: CombinationOrderStrategyLegIndex): void;
    onExchangeChange(exchange: Exchange): void;
    onUnderlyingChange(underlying: OptionUnderlying): void;
    onFormDataChange(formData: FormData): void;
    onSubmit(): void;
    onClose(): void;
}

const {useMemo, useCallback, useContext} = React;
const formDataFields: string[] = ['size', 'price'];
const CombinationOrderFormLayout: React.FunctionComponent<Props> = ({
    exchangeOptions,
    exchange,
    underlyingOptions,
    underlying,
    error,
    formData,
    strategyValue,
    productPickerIndex,
    firstProduct,
    secondProduct,
    setProductPickerState,
    onExchangeChange,
    onUnderlyingChange,
    onFormDataChange,
    onSubmit
}) => {
    const i18n = useContext(I18nContext);
    const priceConditionOptions: PriceConditionOption[] = useMemo(
        () => [
            getPriceConditionSelectOption(i18n, PriceConditionIds.PAY),
            getPriceConditionSelectOption(i18n, PriceConditionIds.RECEIVE)
        ],
        [i18n]
    );
    const timeConditionOptions: TimeConditionOption[] = useMemo(
        () => [
            getTimeConditionSelectOption(i18n, OrderTimeTypeNames.DAY),
            getTimeConditionSelectOption(i18n, OrderTimeTypeNames.GTC)
        ],
        [i18n]
    );
    const selectTimeCondition = useCallback(
        (orderTimeType: OrderTimeTypeNames) => {
            onFormDataChange({...formData, orderTimeType});
        },
        [formData, onFormDataChange]
    );
    const selectPriceCondition = useCallback(
        (priceCondition: PriceConditionIds) => {
            onFormDataChange({
                ...formData,
                strategy: {
                    ...formData.strategy,
                    payReceive: priceCondition
                }
            });
        },
        [formData, onFormDataChange]
    );
    const onFormChange = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            const input: HTMLInputElement = event.target as HTMLInputElement;
            const field: string = input.name;

            if (!formDataFields.includes(field) || !input.checkValidity()) {
                return;
            }

            onFormDataChange({...formData, [field]: parseNumber(input.value)});
        },
        [formData, onFormDataChange]
    );
    const onFormSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const form: HTMLFormElement = event.currentTarget;

            if (form.checkValidity()) {
                onSubmit();
            }
        },
        [onSubmit]
    );
    const toggleStrategyOrderAction = (strategyLegIndex: CombinationOrderStrategyLegIndex) => {
        const {strategy} = formData;
        const strategyLeg: CombinationOrderStrategyLeg | undefined = strategy && strategy.legs[strategyLegIndex];

        if (!strategy || !strategyLeg) {
            return;
        }

        strategyLeg.buySell =
            strategyLeg.buySell === OrderActionTypes.BUY ? OrderActionTypes.SELL : OrderActionTypes.BUY;

        onFormDataChange({...formData, strategy: {...strategy}});
    };
    const {strategy, orderTimeType} = formData;
    const firstStrategyLeg = strategy && strategy.legs[0];
    const secondStrategyLeg = strategy && strategy.legs[1];
    const firstStrategyLegLabel = `${localize(i18n, 'trader.combinationOrder.leg')} 1`;
    const secondStrategyLegLabel = `${localize(i18n, 'trader.combinationOrder.leg')} 2`;
    const fieldErrors: FieldErrors | undefined = error && getFieldErrors(error);
    const quantityFieldError: AppError | undefined = fieldErrors && fieldErrors.size;
    const priceFieldError: AppError | undefined = fieldErrors && fieldErrors.price;

    return (
        <form autoComplete="off" method="post" onSubmit={onFormSubmit} onChange={onFormChange}>
            <div className={formLine}>
                <Select
                    size={SelectSizes.WIDE}
                    name="exchange"
                    required={true}
                    placeholder={localize(i18n, 'trader.combinationOrder.selectExchange')}
                    onChange={onExchangeChange}
                    selectedOption={exchange && getExchangeSelectOption(i18n, exchange)}
                    options={exchangeOptions}
                />
            </div>
            {underlyingOptions[0] && (
                <div className={formLine}>
                    <Select
                        size={SelectSizes.WIDE}
                        name="underlying"
                        required={true}
                        onChange={onUnderlyingChange}
                        placeholder={localize(i18n, 'trader.combinationOrder.selectOptionChain')}
                        selectedOption={underlying && getUnderlyingSelectOption(underlying)}
                        options={underlyingOptions}
                    />
                </div>
            )}
            {underlying && (
                <fieldset>
                    <div className={formLineWithMultipleFields}>
                        <div className={orderActionSwitchLayout}>
                            {firstStrategyLegLabel}
                            <SwitchButtons
                                className={orderActionSwitch}
                                activeOptionClassName={activeOrderActionOption}
                                checked={!firstStrategyLeg || firstStrategyLeg.buySell !== OrderActionTypes.SELL}
                                fromOption={localize(i18n, 'trader.productActions.buy.short')}
                                toOption={localize(i18n, 'trader.productActions.sell.short')}
                                onChange={toggleStrategyOrderAction.bind(null, 0)}
                            />
                        </div>
                        <div className={halfWidthFieldLayout}>
                            <button
                                type="button"
                                data-name="firstProduct"
                                onClick={setProductPickerState.bind(null, 0)}
                                className={productPickerIndex === 0 ? activeProductSelectButton : productSelectButton}>
                                {firstProduct
                                    ? firstProduct.name
                                    : localize(i18n, 'trader.combinationOrder.selectProduct')}
                                <Icon type="keyboard_arrow_down" className={productSelectButtonIcon} />
                            </button>
                        </div>
                    </div>
                    <div className={formLineWithMultipleFields}>
                        <div className={orderActionSwitchLayout}>
                            {secondStrategyLegLabel}
                            <SwitchButtons
                                className={orderActionSwitch}
                                activeOptionClassName={activeOrderActionOption}
                                checked={!secondStrategyLeg || secondStrategyLeg.buySell !== OrderActionTypes.SELL}
                                fromOption={localize(i18n, 'trader.productActions.buy.short')}
                                toOption={localize(i18n, 'trader.productActions.sell.short')}
                                onChange={toggleStrategyOrderAction.bind(null, 1)}
                            />
                        </div>
                        <div className={halfWidthFieldLayout}>
                            <button
                                type="button"
                                data-name="secondProduct"
                                onClick={setProductPickerState.bind(null, 1)}
                                className={productPickerIndex === 1 ? activeProductSelectButton : productSelectButton}>
                                {secondProduct
                                    ? secondProduct.name
                                    : localize(i18n, 'trader.combinationOrder.selectProduct')}
                                <Icon type="keyboard_arrow_down" className={productSelectButtonIcon} />
                            </button>
                        </div>
                    </div>
                    <div className={formLineWithMultipleFields}>
                        <div className={halfWidthFieldLayout}>
                            <div className={fieldLabel}>{localize(i18n, 'trader.orderForm.quantityField')}</div>
                            <NumericInput
                                name="size"
                                invalid={Boolean(quantityFieldError)}
                                required={true}
                                hideFloatPlaceholder={true}
                                placeholder="0"
                                value={formData.size}
                            />
                            {quantityFieldError && (
                                <div className={fieldErrorClassName}>{localize(i18n, quantityFieldError.text)}</div>
                            )}
                        </div>
                        <div className={halfWidthFieldLayout}>
                            <div className={fieldLabel}>{localize(i18n, 'trader.orderForm.priceField')}</div>
                            <NumericInput
                                name="price"
                                invalid={Boolean(priceFieldError)}
                                required={true}
                                hideFloatPlaceholder={true}
                                fractionSize={4}
                                placeholder="0"
                                value={formData.price}
                            />
                            {priceFieldError && (
                                <div className={fieldErrorClassName}>{localize(i18n, priceFieldError.text)}</div>
                            )}
                        </div>
                    </div>
                    <div className={formLineWithMultipleFields}>
                        {strategy && (
                            <div className={halfWidthFieldLayout}>
                                <div className={fieldLabel}>
                                    {localize(i18n, 'trader.combinationOrder.priceCondition')}
                                </div>
                                <Select
                                    size={SelectSizes.WIDE}
                                    name="priceCondition"
                                    required={true}
                                    onChange={selectPriceCondition}
                                    placeholder={localize(i18n, 'trader.combinationOrder.priceCondition')}
                                    selectedOption={getPriceConditionSelectOption(i18n, strategy.payReceive)}
                                    options={priceConditionOptions}
                                />
                            </div>
                        )}
                        {orderTimeType && (
                            <div className={halfWidthFieldLayout}>
                                <div className={fieldLabel}>
                                    {localize(i18n, 'trader.combinationOrder.timeCondition')}
                                </div>
                                <Select
                                    size={SelectSizes.WIDE}
                                    name="timeCondition"
                                    required={true}
                                    onChange={selectTimeCondition}
                                    placeholder={localize(i18n, 'trader.combinationOrder.timeCondition')}
                                    selectedOption={getTimeConditionSelectOption(i18n, orderTimeType)}
                                    options={timeConditionOptions}
                                />
                            </div>
                        )}
                    </div>
                </fieldset>
            )}
            <Button type="submit" className={submitButton} variant={ButtonVariants.ACCENT} disabled={!strategyValue}>
                {localize(i18n, 'trader.orderForm.placeOrderAction')}
            </Button>
            {strategyValue && (
                <div>
                    {localize(i18n, 'trader.combinationOrder.selectedStrategy')}
                    {': '}
                    <span className={strategyValueClassName}>{strategyValue}</span>
                </div>
            )}
            {firstProduct && <ProductDetails label={firstStrategyLegLabel} productInfo={firstProduct} />}
            {secondProduct && <ProductDetails label={secondStrategyLegLabel} productInfo={secondProduct} />}
        </form>
    );
};

export default React.memo(CombinationOrderFormLayout);
