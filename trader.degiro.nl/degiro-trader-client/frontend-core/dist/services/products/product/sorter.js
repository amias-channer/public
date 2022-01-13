import parseUrlSearchParams from '../../../utils/url/parse-url-search-params';
import plainClone from '../../../utils/plain-clone';
import { SortTypes } from '../../filter/index';
export class ProductsSorter {
    constructor() {
        this.columns = [];
        this.data = {
            sortColumns: [],
            sortTypes: []
        };
    }
    setColumns(columns, options) {
        const { excludeColumns = [] } = options;
        this.columns = columns.filter((column) => excludeColumns.indexOf(column.id) < 0);
    }
    getDefaultSorterData() {
        const { columns } = this;
        // select a 'name' filter or the first one by default
        const sortColumn = columns.find(({ id }) => id === 'name') || columns[0];
        return {
            sortColumns: [sortColumn.id],
            sortTypes: [SortTypes.ASC]
        };
    }
    setDefaults(options) {
        const { columns } = this;
        if (!columns || !columns[0]) {
            return;
        }
        const query = parseUrlSearchParams(options.location.search);
        const sortColumns = [];
        const sortTypes = [];
        if (query.sortColumns && query.sortTypes) {
            const sortTypesParam = query.sortTypes.split(',');
            query.sortColumns.split(',').forEach((id, index) => {
                const sortColumn = columns.find((sortColumn) => sortColumn.id === id);
                if (sortColumn) {
                    sortColumns.push(id);
                    const sortType = sortTypesParam[index];
                    if (sortType === SortTypes.ASC || sortType === SortTypes.DESC) {
                        sortTypes.push(sortType);
                    }
                    else {
                        sortTypes.push(SortTypes.ASC);
                    }
                }
            });
        }
        this.data = sortColumns[0]
            ? {
                sortColumns,
                sortTypes
            }
            : options.defaultSorterData || this.getDefaultSorterData();
    }
    load(options) {
        this.setDefaults(options);
        return Promise.resolve();
    }
    save(sorterData) {
        this.data = plainClone(sorterData);
    }
    toggleSortType({ column, sorterData }) {
        const sortColumnId = column.id;
        const index = sorterData.sortColumns.indexOf(sortColumnId);
        const result = plainClone(sorterData);
        if (index === -1) {
            result.sortColumns.push(sortColumnId);
            result.sortTypes.push(SortTypes.ASC);
            return result;
        }
        const sortType = result.sortTypes[index];
        if (sortType === SortTypes.ASC) {
            result.sortTypes[index] = SortTypes.DESC;
            return result;
        }
        if (sortType === SortTypes.DESC) {
            // we should have at least 1 active sort column
            if (result.sortColumns[1]) {
                result.sortColumns.splice(index, 1);
                result.sortTypes.splice(index, 1);
            }
            else {
                result.sortTypes[index] = SortTypes.ASC;
            }
            return result;
        }
        return result;
    }
}
//# sourceMappingURL=sorter.js.map