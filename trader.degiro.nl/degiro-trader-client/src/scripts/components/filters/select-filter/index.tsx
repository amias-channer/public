import {SelectOption} from 'frontend-core/dist/components/ui-trader4/select';
import Select, {SelectSizes} from 'frontend-core/dist/components/ui-trader4/select/index';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {nbsp} from '../../value';
import {filterLabel, filtersSection} from '../filters.css';
import getSelectOptionLabel from './get-select-option-label';

export interface SelectFilterValue {
    id: string | number;
    translation?: string;
    name?: string;
    label?: string;
}

interface Props<FiltersValues> {
    field: keyof FiltersValues & string;
    values: SelectFilterValue[] | undefined;
    value?: string | number;
    label?: React.ReactNode;
    size?: SelectSizes;
    className?: string;
    onChange(field: keyof FiltersValues & string, value: string): void;
}

const {useCallback, useContext} = React;
const SelectFilter = <FiltersValues extends Record<string, any>>({
    field,
    values,
    value,
    size = SelectSizes.WIDE,
    className = '',
    label = nbsp,
    onChange
}: React.PropsWithChildren<Props<FiltersValues>>) => {
    const i18n = useContext(I18nContext);
    const onSelectChange = useCallback(
        (value: string | number) => onChange(field, value as FiltersValues[keyof FiltersValues]),
        [field, onChange]
    );
    const getSelectOption = (selectFilterValue: SelectFilterValue): SelectOption => ({
        value: String(selectFilterValue.id),
        label: getSelectOptionLabel(i18n, selectFilterValue)
    });

    if (!values?.[0]) {
        return null;
    }

    const selectedValue: SelectFilterValue | undefined = values.find(({id}) => String(value) === String(id));

    return (
        <div className={`${filtersSection} ${className}`}>
            <div className={filterLabel}>{label}</div>
            <Select
                name={field}
                size={size}
                disabled={!values[1]}
                searchable={Boolean(values[10])}
                onChange={onSelectChange}
                selectedOption={selectedValue && getSelectOption(selectedValue)}
                options={values.map(getSelectOption)}
            />
        </div>
    );
};

export default React.memo(SelectFilter) as <T extends Record<string, any>>(
    props: React.PropsWithChildren<Props<T>>
) => JSX.Element;
