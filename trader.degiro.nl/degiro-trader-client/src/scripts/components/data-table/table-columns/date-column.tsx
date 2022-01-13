import * as React from 'react';
import localize from 'frontend-core/dist/services/i18n/localize';
import {SortTypes} from 'frontend-core/dist/services/filter';
import SortableColumn from '../sortable-column';
import {I18nContext} from '../../app-component/app-context';
import {dataPlaceholder} from '../products-table/products-table.css';
import {nbsp, valuePlaceholder} from '../../value';
import DateValue from '../../value/date';

interface Props<T extends any = any> {
    format?: string;
    sortType: SortTypes;
    onSort?: (prop: SortTypes) => void;
    mapDataToDate?: (data: T) => Date | undefined;
    dateClassName?: string;
}

const {useContext, memo} = React;
const DateColumn = memo<Props>(({format, sortType, onSort, mapDataToDate, dateClassName}) => {
    const i18n = useContext(I18nContext);

    return (
        <SortableColumn
            sortType={sortType}
            onSort={onSort}
            header={localize(i18n, 'trader.productsTable.dateColumn')}
            skeleton={<span className={dataPlaceholder}>{''.padEnd(20, nbsp)}</span>}>
            {(data) => {
                const date = mapDataToDate ? mapDataToDate(data) : data.date;

                return date ? (
                    <DateValue id="tableEntry" field="date" value={date} className={dateClassName} format={format} />
                ) : (
                    <>{valuePlaceholder}</>
                );
            }}
        </SortableColumn>
    );
});

DateColumn.displayName = 'DateColumn';
export default DateColumn as <T extends any = any>(props: Props<T>) => JSX.Element;
