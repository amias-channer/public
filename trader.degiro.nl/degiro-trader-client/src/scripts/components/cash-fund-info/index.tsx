import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {
    CashFundInfo as CashFundInfoModel,
    cashFundInfoDefaultPositionFields,
    CashFundInfoPositionField
} from 'frontend-core/dist/models/cash-fund';
import {ProductInfo} from 'frontend-core/dist/models/product';
import baseLocalize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {
    inlineEndValueItem,
    justifiedLabel,
    line,
    lineTopSeparator,
    valueItem
} from '../../../styles/details-overview.css';
import {ConfigContext, I18nContext} from '../app-component/app-context';
import Hint from '../hint';
import {nbsp} from '../value';
import Amount from '../value/amount';
import NumericValue from '../value/numeric';
import Price from '../value/price';

export interface CashFundInfoProps {
    cashFundInfo: CashFundInfoModel;
    productInfo?: ProductInfo;
    className?: string;
    inlineStartValueItems?: boolean;
    cashFundPositionFields?: CashFundInfoPositionField[];
}

const {useContext} = React;
const CashFundInfo: React.FunctionComponent<CashFundInfoProps> = ({
    cashFundInfo,
    productInfo,
    className,
    inlineStartValueItems,
    cashFundPositionFields = cashFundInfoDefaultPositionFields
}) => {
    const i18n = useContext(I18nContext);
    const {baseCurrency} = useContext(ConfigContext);
    const {totalFlatexFundValue} = cashFundInfo;
    const baseCurrencySymbolPrefix: string = `${getCurrencySymbol(baseCurrency)}${nbsp}`;
    const productCurrencySymbolPrefix: string | undefined =
        productInfo && `${getCurrencySymbol(productInfo.currency)}${nbsp}`;
    const valueItemClassName: string = inlineStartValueItems ? valueItem : `${valueItem} ${inlineEndValueItem}`;
    const localize = (translationCode: string) => {
        const currency: string | undefined = cashFundInfo.currency || cashFundInfo.productInfo?.currency;

        return baseLocalize(i18n, translationCode, {currency});
    };

    return (
        <div className={className}>
            <div className={line}>
                <div className={justifiedLabel}>
                    {localize('trader.cashFunds.freeCash')}
                    <Hint className={inlineRight} content={localize('trader.cashFunds.freeCashHint')} />
                </div>
                <Amount
                    id="cashFundInfo"
                    field="freeCash"
                    prefix={productCurrencySymbolPrefix}
                    value={cashFundInfo.freeCash}
                    className={valueItemClassName}
                />
            </div>
            {totalFlatexFundValue !== undefined ? (
                <div className={line}>
                    <div className={justifiedLabel}>
                        {localize('trader.cashFunds.totalFlatexFundValue')}
                        <Hint className={inlineRight} content={localize('trader.cashFunds.totalFlatexFundValueHint')} />
                    </div>
                    <Amount
                        id="cashFundInfo"
                        field="totalFlatexFundValue"
                        prefix={productCurrencySymbolPrefix}
                        value={cashFundInfo.totalFlatexFundValue}
                        className={valueItemClassName}
                    />
                </div>
            ) : (
                <>
                    {cashFundPositionFields.includes('balanceParticipations') && (
                        <>
                            <div className={`${line} ${lineTopSeparator}`}>
                                {localize('trader.cashFunds.currencyFreeCash')}
                            </div>
                            <div className={line}>
                                <div className={justifiedLabel}>
                                    {localize('trader.cashFunds.balanceParticipations')}
                                    <Hint
                                        className={inlineRight}
                                        content={localize('trader.cashFunds.balanceParticipationsHint')}
                                    />
                                </div>
                                <NumericValue
                                    id="cashFundInfo"
                                    className={valueItemClassName}
                                    field="balanceParticipations"
                                    value={cashFundInfo.balanceParticipations}
                                />
                            </div>
                        </>
                    )}
                    {cashFundPositionFields.includes('price') && (
                        <div className={line}>
                            <div className={justifiedLabel}>
                                {localize('trader.cashFunds.price')}
                                <Hint className={inlineRight} content={localize('trader.cashFunds.priceHint')} />
                            </div>
                            <Price
                                id="cashFundInfo"
                                field="price"
                                prefix={productCurrencySymbolPrefix}
                                value={cashFundInfo.price}
                                className={valueItemClassName}
                            />
                        </div>
                    )}
                    {cashFundPositionFields.includes('totalFundValue') && (
                        <div className={line}>
                            <div className={justifiedLabel}>
                                {localize('trader.cashFunds.totalFundValue')}
                                <Hint
                                    className={inlineRight}
                                    content={localize('trader.cashFunds.totalFundValueHint')}
                                />
                            </div>
                            <Amount
                                id="cashFundInfo"
                                field="totalFundValue"
                                prefix={productCurrencySymbolPrefix}
                                marked={true}
                                className={valueItemClassName}
                                value={cashFundInfo.totalFundValue}
                            />
                        </div>
                    )}
                    {cashFundPositionFields.includes('todayResult') && (
                        <div className={`${line} ${lineTopSeparator}`}>
                            <div className={justifiedLabel}>
                                {localize('trader.cashFunds.todayResult')}
                                <Hint className={inlineRight} content={localize('trader.cashFunds.todayResultHint')} />
                            </div>
                            <Amount
                                id="cashFundInfo"
                                field="todayResult"
                                highlightValueBySign={true}
                                prefix={baseCurrencySymbolPrefix}
                                value={cashFundInfo.todayResult}
                                className={valueItemClassName}
                            />
                        </div>
                    )}
                    {cashFundPositionFields.includes('totalResult') && (
                        <div className={line}>
                            <div className={justifiedLabel}>
                                {localize('trader.cashFunds.totalResult')}
                                <Hint className={inlineRight} content={localize('trader.cashFunds.totalResultHint')} />
                            </div>
                            <Amount
                                id="cashFundInfo"
                                marked={true}
                                highlightValueBySign={true}
                                className={valueItemClassName}
                                prefix={baseCurrencySymbolPrefix}
                                field="totalResult"
                                value={cashFundInfo.totalResult}
                            />
                        </div>
                    )}
                </>
            )}
            <div className={`${line} ${lineTopSeparator}`}>
                <div className={justifiedLabel}>{localize('trader.cashFunds.totalLiquidity')}</div>
                <Amount
                    id="cashFundInfo"
                    marked={true}
                    field="totalLiquidity"
                    prefix={productCurrencySymbolPrefix}
                    value={cashFundInfo.totalLiquidity}
                    className={valueItemClassName}
                />
            </div>
        </div>
    );
};

export default React.memo(CashFundInfo);
