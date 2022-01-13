import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {CorporateAction} from 'frontend-core/dist/models/corporate-action';
import getCorporateActions from 'frontend-core/dist/services/corporate-action/get-corporate-actions';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {Interval} from 'frontend-core/dist/models/interval';
import {Pagination} from '../../models/pagination';
import getCorporateActionId from '../../services/corporate-action/get-corporate-action-id';
import createPagination from '../../services/pagination/create-pagination';
import getPagesInterval from '../../services/pagination/get-pages-interval';
import setPageSize from '../../services/pagination/set-page-size';
import setTotalSize from '../../services/pagination/set-total-size';
import {ConfigContext, I18nContext} from '../app-component/app-context';
import Card from '../card';
import CardHeader from '../card/header';
import useDataTableFullLayoutFlag from '../data-table/hooks/use-data-table-full-layout-flag';
import TableFooter from '../data-table/table-footer';
import Hint from '../hint/index';
import ListMoreButton from '../list/list-more-button';
import {
    item,
    list,
    primaryContentAsColumn,
    primaryContentTitle,
    secondaryContentAsColumn,
    secondaryContentTitle,
    subContent
} from '../list/list.css';
import {
    cell,
    headerCell,
    inlineEndContentCell,
    productName,
    productNameCell,
    row,
    startStickyCell,
    stickyCellContent,
    stickyCellTableWrapper,
    table as tableClassName
} from '../table/table.css';
import {nbsp} from '../value';
import DateValue from '../value/date';
import Price from '../value/price';
import {nonEmptyPositionsSection} from './portfolio.css';

const {useState, useEffect, useContext} = React;
const CorporateActions = React.memo(() => {
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);
    const {value: corporateActions = []} = useAsync<CorporateAction[]>(() => getCorporateActions(config), [config]);
    const [pagination, setPagination] = useState<Pagination>(createPagination);
    const hasFullView: boolean = useDataTableFullLayoutFlag();
    const range: Interval<number> = getPagesInterval(pagination);
    const baseCurrencySymbolPrefix: string = `${getCurrencySymbol(config.baseCurrency)}${nbsp}`;

    useEffect(() => {
        setPagination((pagination) => setTotalSize(pagination, corporateActions.length));
    }, [corporateActions.length]);

    if (!pagination.totalSize) {
        return null;
    }

    return (
        <div aria-live="polite" data-name="corporateActions" className={nonEmptyPositionsSection}>
            {hasFullView ? (
                <Card
                    innerHorizontalGap={false}
                    header={
                        <CardHeader title={localize(i18n, 'trader.corporateActionsTable.title')}>
                            <Hint
                                className={inlineRight}
                                content={localize(i18n, 'trader.corporateActionsTable.description')}
                            />
                        </CardHeader>
                    }
                    footer={<TableFooter pagination={pagination} onPaginationChange={setPagination} />}>
                    <div className={stickyCellTableWrapper}>
                        <table className={tableClassName}>
                            <thead>
                                <tr className={row}>
                                    <th className={`${headerCell} ${productNameCell} ${startStickyCell}`}>
                                        {localize(i18n, 'trader.corporateActionsTable.productNameColumn')}
                                    </th>
                                    <th className={headerCell}>
                                        {localize(i18n, 'trader.corporateActionsTable.idColumn')}
                                    </th>
                                    <th className={headerCell}>
                                        {localize(i18n, 'trader.corporateActionsTable.descriptionColumn')}
                                    </th>
                                    <th className={`${headerCell} ${inlineEndContentCell}`}>
                                        {localize(i18n, 'trader.corporateActionsTable.totalValueColumn')}
                                    </th>
                                    <th className={`${headerCell} ${inlineEndContentCell}`}>
                                        {localize(i18n, 'trader.corporateActionsTable.totalValueColumn')}
                                        {nbsp}
                                        {getCurrencySymbol(config.baseCurrency)}
                                    </th>
                                    <th className={`${headerCell} ${inlineEndContentCell}`}>
                                        {localize(i18n, 'trader.corporateActionsTable.payDateColumn')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {corporateActions.slice(range.start, range.end).map((action: CorporateAction) => {
                                    const id: string = getCorporateActionId(action);
                                    const {payDate} = action;

                                    return (
                                        <tr key={id} data-name="corporateActionsItem" className={row}>
                                            <td className={`${cell} ${startStickyCell} ${productNameCell}`}>
                                                <div className={stickyCellContent}>
                                                    <span className={productName}>{action.product}</span>
                                                </div>
                                            </td>
                                            <td className={cell}>{action.ca_id}</td>
                                            <td className={cell}>{action.description}</td>
                                            <td className={`${cell} ${inlineEndContentCell}`}>
                                                <Price
                                                    id={id}
                                                    value={action.amount}
                                                    prefix={`${getCurrencySymbol(action.currency)}${nbsp}`}
                                                    field="amount"
                                                />
                                            </td>
                                            <td className={`${cell} ${inlineEndContentCell}`}>
                                                <Price
                                                    id={id}
                                                    value={action.amountInBaseCurr}
                                                    prefix={baseCurrencySymbolPrefix}
                                                    field="amountInBaseCurr"
                                                />
                                            </td>
                                            <td className={`${cell} ${inlineEndContentCell}`}>
                                                {payDate && <DateValue field="payDate" id={id} value={payDate} />}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                <Card
                    innerHorizontalGap={false}
                    header={
                        <CardHeader title={localize(i18n, 'trader.corporateActionsTable.title')}>
                            <Hint
                                className={inlineRight}
                                content={localize(i18n, 'trader.corporateActionsTable.description')}
                            />
                        </CardHeader>
                    }
                    footer={
                        pagination.pagesCount > 1 && (
                            <ListMoreButton
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={() => {
                                    setPagination(
                                        setPageSize(pagination, pagination.pageSize + pagination.pageSizeStep)
                                    );
                                }}
                            />
                        )
                    }>
                    <div className={list}>
                        {corporateActions.slice(range.start, range.end).map((action: CorporateAction) => {
                            const id: string = getCorporateActionId(action);
                            const {payDate} = action;

                            return (
                                <div className={item} key={id}>
                                    <div className={primaryContentAsColumn}>
                                        <div className={primaryContentTitle} data-field="product">
                                            {action.product}
                                            {payDate && (
                                                <>
                                                    {nbsp}(
                                                    <DateValue field="payDate" id={id} value={payDate} />)
                                                </>
                                            )}
                                        </div>
                                        <div className={subContent} data-field="description">
                                            {action.description}
                                        </div>
                                    </div>
                                    <div className={secondaryContentAsColumn}>
                                        <Price
                                            id={id}
                                            value={action.amount}
                                            field="amount"
                                            className={secondaryContentTitle}
                                            prefix={`${getCurrencySymbol(action.currency)}${nbsp}`}
                                        />
                                        <Price
                                            id={id}
                                            value={action.amountInBaseCurr}
                                            field="amountInBaseCurr"
                                            prefix={baseCurrencySymbolPrefix}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}
        </div>
    );
});

CorporateActions.displayName = 'CorporateActions';
export default CorporateActions;
