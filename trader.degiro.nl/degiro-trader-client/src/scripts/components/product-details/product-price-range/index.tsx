import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {PricingData} from '../../../models/refinitiv-company-profile';
import Hint from '../../hint';
import {nbsp} from '../../value';
import Amount from '../../value/amount';
import DateValue from '../../value/date';
import RelativeDifference from '../../value/relative-difference';
import {defaultAmountFormatting, defaultPercentFormatting} from '../formatting-config';
import ProductDetailsHint from '../product-details-hint';
import {
    compactPrice52WeekRangeAmount,
    price52WeekRangeAmount,
    price52WeekRangeTooltip,
    priceAndPercentage,
    pricePopup,
    priceRange,
    priceRangeAmount,
    priceRangeDateValue,
    priceRangeSlider,
    priceRangeSliderLabel,
    sliderThumb,
    sliderThumbToggle,
    sliderTrack
} from './product-price-range.css';
import {I18nContext} from '../../app-component/app-context';

function getThumbOffsetStyle({NLOW, NHIG, NPRICE}: PricingData): {left: string} | undefined {
    if (NLOW === undefined || NHIG === undefined || NPRICE === undefined) {
        return;
    }

    const priceLow = parseFloat(NLOW);
    const priceHigh = parseFloat(NHIG);
    const price = parseFloat(NPRICE);
    const priceDelta = priceHigh - priceLow;
    const percentStep = priceDelta / 100;
    const sliderThumbLeftOffset = (price - priceLow) / percentStep;

    return isFinite(sliderThumbLeftOffset) ? {left: `${sliderThumbLeftOffset}%`} : undefined;
}
const {useContext} = React;

interface Props {
    productInfo: ProductInfo;
    pricingData: PricingData;
    hasOneColumnLayout: boolean;
}
const ProductPriceRange: React.FunctionComponent<Props> = ({pricingData, hasOneColumnLayout}) => {
    const i18n = useContext(I18nContext);
    const thumbOffsetStyle = getThumbOffsetStyle(pricingData);

    return (
        <div className={priceRange}>
            <div className={priceRangeSlider}>
                <span className={priceRangeAmount}>
                    <Amount formatting={defaultAmountFormatting} id="NLOW" field="NLOW" value={pricingData.NLOW} />
                    {nbsp}
                    {localize(i18n, 'trader.productDetails.priceRangeAmountLow')}
                </span>
                <div className={sliderTrack}>
                    {thumbOffsetStyle && (
                        // eslint-disable-next-line react/forbid-dom-props
                        <div style={thumbOffsetStyle} className={sliderThumb}>
                            <Hint
                                className={sliderThumbToggle}
                                content={
                                    <span className={pricePopup}>
                                        {`${localize(i18n, 'trader.priceRange.lastPrice')}: `}
                                        <Amount
                                            formatting={defaultAmountFormatting}
                                            id="NPRICE"
                                            field="NPRICE"
                                            value={pricingData.NPRICE}
                                        />
                                    </span>
                                }>
                                {nbsp}
                            </Hint>
                        </div>
                    )}
                </div>
                <span className={priceRangeAmount}>
                    <Amount formatting={defaultAmountFormatting} id="NHIG" field="NHIG" value={pricingData.NHIG} />
                    {nbsp}
                    {localize(i18n, 'trader.productDetails.priceRangeAmountHigh')}
                </span>
            </div>
            <span className={priceRangeSliderLabel}>
                <DateValue
                    className={priceRangeDateValue}
                    id="NLOWDATE"
                    value={pricingData.NLOWDATE}
                    field="NLOWDATE"
                />
                <span className={priceAndPercentage}>
                    {localize(i18n, 'trader.productDetails.price52WeekRangeShort')}
                    {!hasOneColumnLayout && (
                        <>
                            {nbsp} / {nbsp}
                            <RelativeDifference
                                id="PR52WKPCT"
                                formatting={defaultPercentFormatting}
                                field="PR52WKPCT"
                                value={pricingData.PR52WKPCT}
                                className={price52WeekRangeAmount}
                            />
                            {nbsp}
                            {localize(i18n, 'trader.productDetails.priceChange')}
                        </>
                    )}
                    <ProductDetailsHint
                        className={price52WeekRangeTooltip}
                        tooltip={localize(i18n, 'trader.productDetails.priceRange52WeekTooltipText')}
                    />
                </span>
                <DateValue
                    className={priceRangeDateValue}
                    id="NHIGDATE"
                    value={pricingData.NHIGDATE}
                    field="NHIGDATE"
                />
            </span>
            {hasOneColumnLayout && (
                <div className={compactPrice52WeekRangeAmount}>
                    <span>{localize(i18n, 'trader.productDetails.priceRange52WeekHeaderLabel')}</span>
                    <RelativeDifference
                        id="PR52WKPCT"
                        formatting={defaultPercentFormatting}
                        field="PR52WKPCT"
                        value={pricingData.PR52WKPCT}
                        className={price52WeekRangeAmount}
                    />
                </div>
            )}
        </div>
    );
};

export default React.memo(ProductPriceRange);
