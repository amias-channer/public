import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import useScrollIntoView from 'frontend-core/dist/hooks/use-scroll-into-view';
import {ProductInfo, ProductsInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import formatDate from 'frontend-core/dist/utils/date/format-date';
import parseDate, {DateParserOptions} from 'frontend-core/dist/utils/date/parse-date';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {InitialPriceSources, PriceAlert} from '../../../models/price-alert';
import getGroupingDate from '../../../services/filter/get-grouping-date';
import isPaginationChunkStartIndex from '../../../services/pagination/is-pagination-chunk-start-index';
import setPageSize from '../../../services/pagination/set-page-size';
import getPositionTypeLabel from '../../../services/price-alert/get-position-type-label';
import getProductDetailsHref from '../../../services/router/get-product-details-href';
import GroupedLists from '../../list/grouped-lists';
import ListMoreButton from '../../list/list-more-button';
import {item, primaryContentAsColumn} from '../../list/list.css';
import ProductName from '../../product-name/index';
import Hint from '../../hint/index';
import DateValue from '../../value/date';
import {nbsp} from '../../value';
import Price from '../../value/price';
import RelativeDifference from '../../value/relative-difference';
import LastAlertsStatusIcon from '../last-alerts-status-icon';
import LastAlertsStatusTooltip from '../last-alerts-status-tooltip';
import {secondaryValueText} from '../portfolio-depreciation.css';
import {listItemTitle, priceDepreciationText, productName, valuesGrid, valuesTitle} from './compact-view.css';
import {ConfigContext, I18nContext, MainClientContext} from '../../app-component/app-context';
import {Pagination} from '../../../models/pagination';
import {PortfolioDepreciationFiltersData} from '../filters';

interface Props {
    pagination: Pagination;
    alerts: PriceAlert[];
    productsInfo: ProductsInfo;
    filters: PortfolioDepreciationFiltersData;
    sortAlerts(orderBy: string): void;
    onPaginationChange(pagination: Pagination): void;
}

const {useCallback, useRef, useContext, memo} = React;
const dateParserOptions: DateParserOptions = {keepOriginDate: true};
const dateFormat: string = 'DD-MM-YYYY';
const getGroupingValue = (priceAlert: PriceAlert): string => getGroupingDate(priceAlert.notificationDate);
const renderListsDivider = (priceAlert: PriceAlert) => {
    const parsedDate: Date | undefined = parseDate(priceAlert.notificationDate);

    return parsedDate && formatDate(parsedDate, 'YYYY-MM-DD');
};
const PortfolioDepreciationCompactView = memo<Props>(({pagination, alerts, productsInfo, onPaginationChange}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const mainClient = useContext(MainClientContext);
    const autoScrollItemRef = useRef<HTMLAnchorElement | null>(null);
    const renderListFooter = useCallback(() => {
        if (pagination.pagesCount > 1) {
            const loadMoreItems = () => {
                onPaginationChange(setPageSize(pagination, pagination.pageSize + pagination.pageSizeStep));
            };

            // eslint-disable-next-line react/jsx-no-bind
            return <ListMoreButton onClick={loadMoreItems} />;
        }
    }, [i18n, pagination, onPaginationChange]);
    const renderListItem = useCallback(
        (priceAlert: PriceAlert, index: number) => {
            const {id: priceAlertId, productId, initialPriceSource} = priceAlert;
            const productInfo: ProductInfo | undefined = productsInfo && productsInfo[productId];

            if (!productInfo) {
                return;
            }

            const productCurrencyPrefix: string | undefined = `${getCurrencySymbol(productInfo.currency)}${nbsp}`;

            return (
                <Link
                    key={priceAlertId}
                    ref={isPaginationChunkStartIndex(index, pagination) ? autoScrollItemRef : null}
                    to={getProductDetailsHref(productInfo.id)}
                    className={item}>
                    <div className={primaryContentAsColumn}>
                        <div className={listItemTitle}>
                            <span className={productName}>
                                ({localize(i18n, getPositionTypeLabel(priceAlert))}){nbsp}
                                <ProductName productInfo={productInfo} />
                            </span>
                            <LastAlertsStatusIcon priceAlert={priceAlert} />
                            <LastAlertsStatusTooltip i18n={i18n} priceAlert={priceAlert} />
                        </div>
                        <dl className={valuesGrid}>
                            <dt className={valuesTitle}>
                                {localize(i18n, 'regulatoryPriceAlert.mail.table.lastBuyPrice')}
                                {initialPriceSource === InitialPriceSources.CLOSE_PRICE && (
                                    <Hint
                                        content={localize(
                                            i18n,
                                            'regulatoryPriceAlert.mail.initialPriceFromRecentClosePrice.explanation'
                                        )}>
                                        <Icon hintIcon={true} />
                                    </Hint>
                                )}
                            </dt>
                            <DateValue
                                id={productId}
                                format={dateFormat}
                                value={priceAlert.initialPriceDate}
                                className={secondaryValueText}
                                parserOptions={dateParserOptions}
                                field="initialPriceDate"
                            />
                            <Price
                                id={productId}
                                value={priceAlert.initialPrice}
                                prefix={productCurrencyPrefix}
                                field="initialPrice"
                            />
                            <dt className={valuesTitle}>
                                {localize(i18n, 'regulatoryPriceAlert.mail.table.closePrice')}
                            </dt>
                            <DateValue
                                id={productId}
                                format={dateFormat}
                                value={priceAlert.firePriceDate}
                                className={secondaryValueText}
                                parserOptions={dateParserOptions}
                                field="firePriceDate"
                            />
                            <Price
                                id={productId}
                                value={priceAlert.firePrice}
                                prefix={productCurrencyPrefix}
                                field="firePrice"
                            />
                            <dt className={valuesTitle}>
                                {localize(i18n, 'regulatoryPriceAlert.mail.table.priceDepreciation')}
                            </dt>
                            <RelativeDifference
                                id={productId}
                                value={priceAlert.depreciationPercent}
                                className={priceDepreciationText}
                                showPositiveSign={false}
                                highlightValueBySign={false}
                                field="depreciationPercent"
                            />
                            <Price
                                id={productId}
                                value={priceAlert.depreciationValue}
                                className={priceDepreciationText}
                                prefix={productCurrencyPrefix}
                                field="depreciationValue"
                            />
                        </dl>
                    </div>
                </Link>
            );
        },
        [productsInfo, i18n, config, mainClient]
    );

    useScrollIntoView(autoScrollItemRef);

    return (
        <GroupedLists
            renderListItem={renderListItem}
            renderListFooter={renderListFooter}
            renderListsDivider={renderListsDivider}
            getGroupingValue={getGroupingValue}
            items={alerts}
        />
    );
});

PortfolioDepreciationCompactView.displayName = 'PortfolioDepreciationCompactView';
export default PortfolioDepreciationCompactView;
