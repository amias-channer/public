import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import {Position} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import localize from 'frontend-core/dist/services/i18n/localize';
import {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {
    inlineEndValueItem,
    label,
    line,
    lineTopSeparator,
    nestedLine,
    valueItem
} from '../../../styles/details-overview.css';
import usePositionUpdates, {PositionUpdateField} from '../../hooks/use-position-updates';
import getProductDetailsHref from '../../services/router/get-product-details-href';
import {I18nContext} from '../app-component/app-context';
import PanelHeader from '../app-component/side-information-panel/header';
import PanelProductDetails from '../app-component/side-information-panel/product-details/index';
import {
    content,
    contentLayout,
    detailsButton,
    fullWidthSection,
    navigationItemIcon
} from '../app-component/side-information-panel/side-information-panel.css';
import Hint from '../hint/index';
import {nbsp} from '../value';
import AbsoluteDifference from '../value/absolute-difference';
import Amount from '../value/amount';
import DateValue, {defaultFullTimeValueFormat} from '../value/date';
import NumericValue from '../value/numeric';
import Price from '../value/price';
import RelativeDifference from '../value/relative-difference';
import {PositionFields} from './positions-table-columns';

interface PositionDetailsProps {
    position: Position;
    onClose(): void;
}

const {useContext} = React;
const totalValueFormatting: NumberFormattingOptions = {preset: 'amount', roundSize: 2};
const positionUpdatesFields: PositionUpdateField[] = [
    PositionFields.BREAK_EVEN_PRICE,
    PositionFields.TODAY_ABSOLUTE_DIFF,
    PositionFields.ACCRUED_INTEREST,
    PositionFields.EXPOSURE,
    PositionFields.QUANTITY,
    PositionFields.TOTAL_RESULT,
    PositionFields.TOTAL_VALUE,
    PositionFields.REALIZED_PL,
    PositionFields.UNREALIZED_PL,
    PositionFields.UNREALIZED_FX_PL,
    PositionFields.UNREALIZED_PRODUCT_PL,
    PositionFields.UNREALIZED_RELATIVE_PL,
    PositionFields.LAST_UPDATE
];
const PositionDetails: React.FunctionComponent<PositionDetailsProps> = (props) => {
    const i18n = useContext(I18nContext);
    const {position, onClose} = props;
    const positionValues = usePositionUpdates(position, positionUpdatesFields);
    const {productInfo, id: positionId} = position;
    const {productTypeId} = productInfo;
    const isBond: boolean = productTypeId === ProductTypeIds.BOND;
    const isFutureOrCfd: boolean = productTypeId === ProductTypeIds.FUTURE || productTypeId === ProductTypeIds.CFD;

    return (
        <div data-name="positionDetails" className={contentLayout}>
            <PanelHeader onAction={onClose}>{localize(i18n, 'trader.portfolio.positionDetails.title')}</PanelHeader>
            <div className={content}>
                <PanelProductDetails {...props} productInfo={productInfo} onProductClick={onClose} />
                <div className={line}>
                    <span className={label}>{localize(i18n, 'trader.productsTable.quantityColumn')}</span>
                    <NumericValue
                        id={positionId}
                        value={positionValues[PositionFields.QUANTITY]}
                        className={`${valueItem} ${inlineEndValueItem}`}
                        field={PositionFields.QUANTITY}
                    />
                </div>
                <div className={line}>
                    <span className={label}>
                        {localize(
                            i18n,
                            isFutureOrCfd ? 'trader.portfolio.exposureColumn' : 'trader.productsTable.valueColumn'
                        )}
                    </span>
                    <Amount
                        id={positionId}
                        value={positionValues[isFutureOrCfd ? PositionFields.EXPOSURE : PositionFields.TOTAL_VALUE]}
                        className={`${valueItem} ${inlineEndValueItem}`}
                        formatting={totalValueFormatting}
                        field={isFutureOrCfd ? PositionFields.EXPOSURE : PositionFields.TOTAL_VALUE}
                    />
                </div>
                {isBond ? (
                    <div className={line}>
                        <span className={label}>{localize(i18n, 'trader.portfolio.accruedInterestColumn')}</span>
                        <Amount
                            id={positionId}
                            value={positionValues[PositionFields.ACCRUED_INTEREST]}
                            className={`${valueItem} ${inlineEndValueItem}`}
                            formatting={totalValueFormatting}
                            field={PositionFields.ACCRUED_INTEREST}
                        />
                    </div>
                ) : null}
                <div className={line}>
                    <span className={label}>{localize(i18n, 'trader.portfolio.absoluteDifference')}</span>
                    <span className={`${valueItem} ${inlineEndValueItem}`}>
                        <AbsoluteDifference
                            id={positionId}
                            value={positionValues[PositionFields.TODAY_ABSOLUTE_DIFF]}
                            field={PositionFields.TODAY_ABSOLUTE_DIFF}
                        />
                    </span>
                </div>
                <div className={line}>
                    <span className={label}>{localize(i18n, 'trader.portfolio.totalResultColumn')}</span>
                    <span className={`${valueItem} ${inlineEndValueItem}`}>
                        <AbsoluteDifference
                            id={positionId}
                            value={positionValues[PositionFields.TOTAL_RESULT]}
                            field={PositionFields.TOTAL_RESULT}
                        />
                    </span>
                </div>
                <div className={`${line} ${lineTopSeparator}`}>
                    <span className={label}>
                        {localize(i18n, 'trader.portfolio.unrealizedPlColumn')}
                        {nbsp}
                        <Hint content={localize(i18n, 'trader.portfolio.unrealizedPlHint')} />
                    </span>
                    <span className={`${valueItem} ${inlineEndValueItem}`}>
                        <AbsoluteDifference
                            id={positionId}
                            value={positionValues[PositionFields.UNREALIZED_PL]}
                            field={PositionFields.UNREALIZED_PL}
                        />
                    </span>
                </div>
                <div className={nestedLine}>
                    <span className={label}>{localize(i18n, 'trader.portfolio.unrealizedProductPlColumn')}</span>
                    <span className={`${valueItem} ${inlineEndValueItem}`}>
                        <AbsoluteDifference
                            id={positionId}
                            value={positionValues[PositionFields.UNREALIZED_PRODUCT_PL]}
                            field={PositionFields.UNREALIZED_PRODUCT_PL}
                        />
                    </span>
                </div>
                <div className={nestedLine}>
                    <span className={label}>{localize(i18n, 'trader.portfolio.unrealizedFxPlColumn')}</span>
                    <span className={`${valueItem} ${inlineEndValueItem}`}>
                        <AbsoluteDifference
                            id={positionId}
                            value={positionValues[PositionFields.UNREALIZED_FX_PL]}
                            field={PositionFields.UNREALIZED_FX_PL}
                        />
                    </span>
                </div>
                <div className={nestedLine}>
                    <span className={label}>{localize(i18n, 'trader.portfolio.unrealizedPlColumn')} %</span>
                    <span className={`${valueItem} ${inlineEndValueItem}`}>
                        <RelativeDifference
                            id={positionId}
                            value={positionValues[PositionFields.UNREALIZED_RELATIVE_PL]}
                            field={PositionFields.UNREALIZED_RELATIVE_PL}
                        />
                    </span>
                </div>
                <div className={`${line} ${lineTopSeparator}`}>
                    <span className={label}>
                        {localize(i18n, 'trader.portfolio.realizedPlColumn')}
                        {nbsp}
                        <Hint content={localize(i18n, 'trader.portfolio.realizedPlHint')} />
                    </span>
                    <span className={`${valueItem} ${inlineEndValueItem}`}>
                        <AbsoluteDifference
                            id={positionId}
                            value={positionValues[PositionFields.REALIZED_PL]}
                            field={PositionFields.REALIZED_PL}
                        />
                    </span>
                </div>
                <div className={line}>
                    <span className={label}>
                        {localize(i18n, 'trader.portfolio.breakEvenPriceColumn')}
                        {nbsp}
                        <Hint content={localize(i18n, 'trader.portfolio.breakEvenPriceHint')} />
                    </span>
                    <span className={`${valueItem} ${inlineEndValueItem}`}>
                        <Price
                            id={positionId}
                            value={positionValues[PositionFields.BREAK_EVEN_PRICE]}
                            field={PositionFields.BREAK_EVEN_PRICE}
                        />
                    </span>
                </div>
                <div className={line}>
                    <span className={label}>{localize(i18n, 'trader.productDetails.lastUpdate')}</span>
                    <DateValue
                        value={positionValues[PositionFields.LAST_UPDATE]}
                        id={positionId}
                        onlyTodayTime={true}
                        timeFormat={defaultFullTimeValueFormat}
                        field={PositionFields.LAST_UPDATE}
                    />
                </div>
                <Link
                    to={getProductDetailsHref(productInfo.id)}
                    onClick={onClose}
                    className={`${detailsButton} ${fullWidthSection}`}>
                    {localize(i18n, 'trader.productDetails.title')}
                    <Icon className={navigationItemIcon} type="keyboard_arrow_right" />
                </Link>
            </div>
        </div>
    );
};

export default React.memo(PositionDetails);
