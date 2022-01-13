import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {ProductInfo, ProductsInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import {DateParserOptions} from 'frontend-core/dist/utils/date/parse-date';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {accentWhenSelectedLink} from '../../../../styles/link.css';
import {InitialPriceSources, PriceAlert} from '../../../models/price-alert';
import getPositionTypeLabel from '../../../services/price-alert/get-position-type-label';
import getProductDetailsHref from '../../../services/router/get-product-details-href';
import TableHeadSortableColumn from '../../data-table/table-head-sortable-column';
import ProductName from '../../product-name/index';
import {
    cell,
    headerCell,
    inlineEndContentCell,
    productName,
    row,
    secondaryContentCell,
    startStickyCell,
    stickyCellTableWrapper,
    table as tableClassName
} from '../../table/table.css';
import Hint from '../../hint/index';
import DateValue from '../../value/date';
import {nbsp} from '../../value';
import Price from '../../value/price';
import RelativeDifference from '../../value/relative-difference';
import LastAlertsStatusIcon from '../last-alerts-status-icon';
import LastAlertsStatusTooltip from '../last-alerts-status-tooltip';
import {secondaryValueText} from '../portfolio-depreciation.css';
import {cellTooltip, cellTooltipContainer, productNameCell} from './full-view.css';
import {I18nContext} from '../../app-component/app-context';
import {PortfolioDepreciationFiltersData} from '../filters';

interface Props {
    alerts: PriceAlert[];
    productsInfo: ProductsInfo;
    filters: PortfolioDepreciationFiltersData;
    sortAlerts(orderBy: string): void;
}

const {useContext, memo} = React;
const dateParserOptions: DateParserOptions = {keepOriginDate: true};
const dateFormat: string = 'DD-MM-YYYY';
const PortfolioDepreciationFullView = memo<Props>(({productsInfo, filters: {orderBy}, alerts, sortAlerts}) => {
    const i18n = useContext(I18nContext);

    return (
        <div className={stickyCellTableWrapper}>
            <table className={tableClassName}>
                <thead>
                    <tr className={row}>
                        <TableHeadSortableColumn
                            field="notificationDate"
                            value={orderBy}
                            onToggle={sortAlerts}
                            className={startStickyCell}>
                            {localize(i18n, 'trader.portfolioDepreciation.notificationDate')}
                        </TableHeadSortableColumn>
                        <th className={`${headerCell} ${productNameCell}`}>
                            {localize(i18n, 'trader.productsTable.productNameColumn')}
                        </th>
                        <th className={headerCell}>{localize(i18n, 'trader.productDetails.isin')}</th>
                        <th className={headerCell}>{localize(i18n, 'trader.productDetails.exchange')}</th>
                        <TableHeadSortableColumn field="positionSize" value={orderBy} onToggle={sortAlerts}>
                            {localize(i18n, 'trader.portfolioDepreciation.positionType')}
                        </TableHeadSortableColumn>
                        <TableHeadSortableColumn
                            field="depreciationPercent"
                            value={orderBy}
                            onToggle={sortAlerts}
                            className={inlineEndContentCell}>
                            {localize(i18n, 'regulatoryPriceAlert.mail.table.pricePercentDepreciation')}
                        </TableHeadSortableColumn>
                        <th className={`${headerCell} ${inlineEndContentCell}`}>
                            {localize(i18n, 'regulatoryPriceAlert.mail.table.priceDepreciation')}
                        </th>
                        <th className={`${headerCell} ${inlineEndContentCell}`}>
                            {localize(i18n, 'regulatoryPriceAlert.mail.table.lastBuyPrice')}
                        </th>
                        <th className={`${headerCell} ${inlineEndContentCell}`}>
                            {localize(i18n, 'regulatoryPriceAlert.mail.table.closePrice')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.map((priceAlert: PriceAlert) => {
                        const {id: priceAlertId, productId} = priceAlert;
                        const productInfo: ProductInfo | undefined = productsInfo && productsInfo[productId];

                        if (!productInfo) {
                            return;
                        }

                        const {exchange} = productInfo;
                        const productCurrencyPrefix: string | undefined = `${getCurrencySymbol(
                            productInfo.currency
                        )}${nbsp}`;

                        return (
                            <tr key={priceAlertId} className={row}>
                                <td className={`${cell} ${startStickyCell} ${secondaryContentCell}`}>
                                    <DateValue
                                        id={productId}
                                        format={dateFormat}
                                        value={priceAlert.notificationDate}
                                        parserOptions={dateParserOptions}
                                        field="notificationDate"
                                    />
                                </td>
                                <td className={`${cell} ${productNameCell}`}>
                                    <Link
                                        to={getProductDetailsHref(productInfo.id)}
                                        className={`${productName} ${accentWhenSelectedLink}`}>
                                        <ProductName productInfo={productInfo} />
                                    </Link>
                                </td>
                                <td className={`${cell} ${secondaryContentCell}`} data-field="isin">
                                    {productInfo.isin}
                                </td>
                                <td className={`${cell} ${secondaryContentCell}`} data-field="exchange">
                                    {exchange && exchange.name}
                                </td>
                                <td className={cell}>{localize(i18n, getPositionTypeLabel(priceAlert))}</td>
                                <td className={`${cell} ${inlineEndContentCell}`}>
                                    <LastAlertsStatusIcon priceAlert={priceAlert} />
                                    <RelativeDifference
                                        id={productId}
                                        value={priceAlert.depreciationPercent}
                                        showPositiveSign={false}
                                        highlightValueBySign={false}
                                        field="depreciationPercent"
                                    />
                                </td>
                                <td className={`${cell} ${inlineEndContentCell}`}>
                                    <div className={cellTooltipContainer}>
                                        <LastAlertsStatusTooltip
                                            i18n={i18n}
                                            className={cellTooltip}
                                            priceAlert={priceAlert}
                                        />
                                        <Price
                                            id={productId}
                                            value={priceAlert.depreciationValue}
                                            prefix={productCurrencyPrefix}
                                            field="depreciationValue"
                                        />
                                    </div>
                                </td>
                                <td className={`${cell} ${inlineEndContentCell}`}>
                                    <Price
                                        id={productId}
                                        value={priceAlert.initialPrice}
                                        prefix={productCurrencyPrefix}
                                        field="initialPrice"
                                    />
                                    <DateValue
                                        id={productId}
                                        format={dateFormat}
                                        className={`${inlineRight} ${secondaryValueText}`}
                                        value={priceAlert.initialPriceDate}
                                        parserOptions={dateParserOptions}
                                        field="initialPriceDate"
                                    />
                                </td>
                                <td className={`${cell} ${inlineEndContentCell}`}>
                                    <div className={cellTooltipContainer}>
                                        {priceAlert.initialPriceSource === InitialPriceSources.CLOSE_PRICE && (
                                            <Hint
                                                className={cellTooltip}
                                                content={localize(
                                                    i18n,
                                                    'regulatoryPriceAlert.mail.initialPriceFromRecentClosePrice.explanation'
                                                )}>
                                                <Icon hintIcon={true} />
                                            </Hint>
                                        )}
                                        <Price
                                            id={productId}
                                            value={priceAlert.firePrice}
                                            prefix={productCurrencyPrefix}
                                            field="firePrice"
                                        />
                                        <DateValue
                                            id={productId}
                                            format={dateFormat}
                                            className={`${inlineRight} ${secondaryValueText}`}
                                            value={priceAlert.firePriceDate}
                                            parserOptions={dateParserOptions}
                                            field="firePriceDate"
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
});

PortfolioDepreciationFullView.displayName = 'PortfolioDepreciationFullView';
export default PortfolioDepreciationFullView;
